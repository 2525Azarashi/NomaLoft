import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { KANSAI_SPOTS, KANSAI_REGIONS, QUICK_SUGGESTIONS, KansaiSpot } from './data/spots'

const app = new Hono()

app.use('/api/*', cors())

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function enrichSpot(s: KansaiSpot, lat: number, lng: number) {
  const distanceMeters = haversineMeters(lat, lng, s.lat, s.lng)
  const walkFromHere = Math.max(1, Math.round(distanceMeters / 80))
  const powerScore = s.power === 'yes_all' ? 100 : s.power === 'yes_part' ? 78 : 20
  const wifiScore = s.wifi === 'yes_free' ? 95 : s.wifi === 'yes_reg' ? 75 : 15
  const workIndex = Math.round(powerScore * 0.3 + wifiScore * 0.3 + s.deskScore * 0.22 + s.quietScore * 0.18)

  return {
    ...s,
    distanceMeters,
    walkFromHere,
    powerScore,
    wifiScore,
    workIndex
  }
}

// GET /api/spots — Returns enriched Kansai spots + real-time telemetry breakdown
app.get('/api/spots', (c) => {
  const lat = parseFloat(c.req.query('lat') || '34.6965')
  const lng = parseFloat(c.req.query('lng') || '135.5015')
  const area = c.req.query('area') || 'all'
  const category = c.req.query('category') || 'all'
  const powerOnly = c.req.query('power') === '1'
  const wifiOnly = c.req.query('wifi') === '1'
  const q = (c.req.query('q') || '').trim().toLowerCase()
  const sort = c.req.query('sort') || 'distance'

  let list = KANSAI_SPOTS.map((s) => enrichSpot(s, lat, lng))

  if (area !== 'all') {
    list = list.filter((s) => s.areaId === area)
  }

  if (category !== 'all') {
    if (category === 'cafe') {
      list = list.filter((s) => s.category === 'cafe' || s.category === 'roastery' || s.category === 'book_cafe')
    } else {
      list = list.filter((s) => s.category === category)
    }
  }

  if (powerOnly) {
    list = list.filter((s) => s.power === 'yes_all' || s.power === 'yes_part')
  }

  if (wifiOnly) {
    list = list.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg')
  }

  if (q) {
    list = list.filter((s) => {
      const hay = `${s.name} ${s.areaLabel} ${s.station} ${s.categoryLabel} ${s.powerDetail} ${s.wifiDetail} ${s.note}`.toLowerCase()
      return hay.includes(q)
    })
  }

  if (sort === 'distance') {
    list.sort((a, b) => a.distanceMeters - b.distanceMeters)
  } else if (sort === 'score') {
    list.sort((a, b) => b.workIndex - a.workIndex)
  } else if (sort === 'speed') {
    list.sort((a, b) => b.wifiSpeedEst - a.wifiSpeedEst)
  }

  const total = list.length
  const withPower = list.filter((s) => s.power === 'yes_all' || s.power === 'yes_part').length
  const withWifi = list.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg').length
  const powerPct = total ? Math.round((withPower / total) * 100) : 0
  const wifiPct = total ? Math.round((withWifi / total) * 100) : 0

  return c.json({
    spots: list,
    regions: KANSAI_REGIONS,
    stats: {
      total,
      withPower,
      withWifi,
      powerPct,
      wifiPct
    }
  })
})

// GET /api/autocomplete — Fast suggestion engine for stations, cafes, brands, and Kansai areas
app.get('/api/autocomplete', (c) => {
  const q = (c.req.query('q') || '').trim().toLowerCase()

  const matchedSpots = KANSAI_SPOTS.filter((s) => {
    if (!q) return false
    return (
      s.name.toLowerCase().includes(q) ||
      s.station.toLowerCase().includes(q) ||
      s.areaLabel.toLowerCase().includes(q)
    )
  })
    .slice(0, 6)
    .map((s) => ({
      id: s.id,
      kind: 'spot',
      label: s.name,
      sub: `${s.areaLabel} · ${s.station} · 電源:${s.power === 'no' ? 'なし' : 'あり'} / Wi-Fi:${s.wifi === 'no' ? 'なし' : 'あり'}`,
      spotId: s.id,
      query: s.name
    }))

  const matchedQuick = QUICK_SUGGESTIONS.filter((item) => {
    if (!q) return true
    return item.label.toLowerCase().includes(q) || item.query.toLowerCase().includes(q)
  })
    .slice(0, q ? 4 : 7)
    .map((item, i) => ({
      id: `q-${i}`,
      kind: item.type,
      label: item.label,
      sub: item.type === 'area' ? 'エリアへマップ移動' : '条件で絞り込み',
      areaId: item.areaId,
      query: item.query
    }))

  return c.json({
    items: [...matchedSpots, ...matchedQuick].slice(0, 8)
  })
})

app.get('/favicon.ico', (c) => c.redirect('/static/favicon.svg', 301))

// Main Full-Bleed Spatial Landscape Web App (Zero Default Emojis)
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>NomaLoft — 関西カフェ・コワーキング電源＆Wi-Fiマップ</title>
  <meta name="description" content="大阪・京都・神戸・阪神・奈良の実在カフェ＆コワーキングスペースのコンセント有無・Wi-Fi有無・公式サイト・SNSを地図上で即座に確認できるPCワーカー向けマップ。" />
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />

  <!-- Typography: Plus Jakarta Sans, Fraunces, Zen Maru Gothic, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;600;700&family=Zen+Maru+Gothic:wght@500;700;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            cream: {
              50: '#FFFDFA',
              100: '#FAF5ED',
              200: '#F2E8D9',
              300: '#E5D5BE',
              400: '#CFB899',
            },
            moka: {
              500: '#7D6A5B',
              700: '#4A3B31',
              800: '#332720',
              900: '#211813',
            },
            caramel: {
              400: '#E2875A',
              500: '#CA6B3E',
            },
            sage: {
              400: '#6FA07A',
              500: '#497E56',
              600: '#366341',
            },
            honey: {
              200: '#F9E6B3',
              300: '#F2D283',
            }
          },
          fontFamily: {
            display: ['"Fraunces"', '"Zen Maru Gothic"', 'serif'],
            round: ['"Zen Maru Gothic"', '"Plus Jakarta Sans"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Free OpenStreetMap + Leaflet + MarkerCluster -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Custom Styles -->
  <link rel="stylesheet" href="/static/styles.css" />
</head>
<body class="h-screen w-screen overflow-hidden bg-cream-200 text-moka-900 font-round antialiased select-none">

  <!-- =========================================================================
       [LAYER 0] FULL-BLEED 100vw x 100vh FREE OPENSTREETMAP CANVAS
       ========================================================================= -->
  <main id="map-viewport" class="fixed inset-0 z-0">
    <div id="nomaloft-map" class="w-full h-full cafe-map-tone"></div>
  </main>

  <!-- =========================================================================
       [LAYER 1] TOP FLOATING CAPSULE BAR (Area Tabs + Power/Wi-Fi Switches + Infographic Rings)
       ========================================================================= -->
  <header id="top-floating-bar" class="fixed top-3.5 left-3.5 sm:left-[428px] right-3.5 z-30 pointer-events-none flex flex-wrap items-center justify-between gap-2.5">

    <!-- Area Quick-Switch Capsule -->
    <nav aria-label="関西エリア切替" class="pointer-events-auto glass-island rounded-full p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
      <button type="button" data-region="all" class="region-pill active shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">関西全域</button>
      <button type="button" data-region="umeda" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">梅田・新大阪</button>
      <button type="button" data-region="kitahama" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">北浜・本町</button>
      <button type="button" data-region="shinsaibashi" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">心斎橋・難波</button>
      <button type="button" data-region="tennoji" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">天王寺</button>
      <button type="button" data-region="kyoto" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">京都</button>
      <button type="button" data-region="kobe" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">神戸</button>
      <button type="button" data-region="hanshin" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">西宮・芦屋</button>
      <button type="button" data-region="nara" class="region-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all">奈良</button>
    </nav>

    <!-- Right Compact Telemetry & OSM Auto-Expand Capsule -->
    <div class="pointer-events-auto hidden xl:flex items-center gap-2.5 glass-island rounded-full pl-3.5 pr-2 py-1.5">
      <!-- Mini Animated Infographic Ring: Power Coverage -->
      <div class="flex items-center gap-2" title="表示中スポットのコンセント設置率">
        <div class="relative w-7 h-7">
          <svg class="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="12" stroke="#E5D5BE" stroke-width="3.2" fill="none"/>
            <circle id="hud-ring-power" cx="16" cy="16" r="12" stroke="#CA6B3E" stroke-width="3.2" stroke-linecap="round" fill="none" stroke-dasharray="75.4" stroke-dashoffset="75.4" class="ring-anim"/>
          </svg>
        </div>
        <div class="leading-tight">
          <div class="text-[9px] font-mono text-moka-500">POWER</div>
          <div class="text-xs font-mono font-bold text-moka-900"><span id="hud-power-pct">0</span>%</div>
        </div>
      </div>

      <!-- Mini Animated Infographic Ring: Wi-Fi Coverage -->
      <div class="flex items-center gap-2" title="表示中スポットの無料Wi-Fi設置率">
        <div class="relative w-7 h-7">
          <svg class="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="12" stroke="#E5D5BE" stroke-width="3.2" fill="none"/>
            <circle id="hud-ring-wifi" cx="16" cy="16" r="12" stroke="#497E56" stroke-width="3.2" stroke-linecap="round" fill="none" stroke-dasharray="75.4" stroke-dashoffset="75.4" class="ring-anim"/>
          </svg>
        </div>
        <div class="leading-tight">
          <div class="text-[9px] font-mono text-moka-500">WI-FI</div>
          <div class="text-xs font-mono font-bold text-moka-900"><span id="hud-wifi-pct">0</span>%</div>
        </div>
      </div>

      <!-- Live OSM Street-Cafe Expansion Switch -->
      <button id="osm-expand-btn" type="button" class="pill-action-btn px-3 py-1.5 rounded-full bg-moka-900 text-cream-50 text-[11px] font-bold flex items-center gap-1.5 hover:bg-caramel-500 transition-colors" title="OpenStreetMapから表示範囲周辺の一般カフェも一括追加取得します">
        <span class="w-2 h-2 rounded-full bg-sage-400 animate-pulse" id="osm-pulse-dot"></span>
        <span id="osm-btn-label">+ 周辺の街カフェも読込</span>
      </button>

      <!-- Map Style Switch -->
      <button id="map-style-btn" type="button" class="w-8 h-8 rounded-full bg-cream-100 hover:bg-honey-200 border border-moka-900/15 flex items-center justify-center text-moka-800 transition-colors" title="地図トーン切替（ラテ和紙 / 標準OSM）">
        <svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="2,6 7,3 13,6 18,3 18,14 13,17 7,14 2,17"/><line x1="7" y1="3" x2="7" y2="14"/><line x1="13" y1="6" x2="13" y2="17"/>
        </svg>
      </button>
    </div>
  </header>

  <!-- =========================================================================
       [LAYER 2] FLOATING SCULPTED CREAM-GLASS EXPLORER ISLAND (LEFT)
       ========================================================================= -->
  <section
    id="explorer-island"
    aria-label="カフェ・コワーキング検索パネル"
    class="fixed top-3.5 bottom-3.5 left-3.5 w-[calc(100vw-28px)] sm:w-[400px] z-30 glass-island rounded-[28px] flex flex-col overflow-hidden transition-transform duration-300"
  >
    <!-- Top Brand + Eye-Tracking Mascot Cup + Kinetic Typography Counter -->
    <div class="px-4 pt-4 pb-3 border-b border-moka-900/8 shrink-0">
      <div class="flex items-center justify-between gap-2">
        <!-- Brand + Playful Eye-Tracking Cup SVG -->
        <div class="flex items-center gap-2.5">
          <button id="mascot-cup-btn" type="button" class="relative w-11 h-11 rounded-2xl bg-gradient-to-b from-cream-50 to-cream-200 border border-moka-900/15 shadow-sm flex items-center justify-center group hover:scale-105 active:scale-95 transition-transform" title="NomaLoft — クリックで湯気アニメーション">
            <svg viewBox="0 0 44 44" class="w-9 h-9">
              <path class="cup-steam cs-1" d="M16 9 C15 6 18 5 17 2.5" stroke="#CA6B3E" stroke-width="1.8" stroke-linecap="round" fill="none"/>
              <path class="cup-steam cs-2" d="M23 10 C22 7 25 6 24 3.5" stroke="#CFB899" stroke-width="1.8" stroke-linecap="round" fill="none"/>
              <path d="M9 16 H30 V25.5 C30 31.5 25.2 35.5 19.5 35.5 C13.8 35.5 9 31.5 9 25.5 Z" fill="#FFFDFA" stroke="#211813" stroke-width="2"/>
              <path d="M30 18.5 H33.2 C35.6 18.5 37 20.2 37 22.3 C37 24.4 35.6 26 33.2 26 H30" fill="none" stroke="#211813" stroke-width="2" stroke-linecap="round"/>
              <ellipse cx="19.5" cy="16" rx="10.2" ry="2.7" fill="#D5B084" stroke="#211813" stroke-width="1.6"/>
              <!-- Eye-tracking pupils -->
              <g id="mascot-eyes">
                <circle cx="15.8" cy="24.5" r="1.6" fill="#211813"/>
                <circle cx="23.2" cy="24.5" r="1.6" fill="#211813"/>
              </g>
              <ellipse cx="13.2" cy="26.3" rx="1.8" ry="1.1" fill="#E89980" opacity="0.6"/>
              <ellipse cx="25.8" cy="26.3" rx="1.8" ry="1.1" fill="#E89980" opacity="0.6"/>
              <path d="M17.8 26.5 Q19.5 28.2 21.2 26.5" stroke="#211813" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            </svg>
          </button>

          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="font-display font-bold text-xl tracking-tight text-moka-900">NomaLoft</span>
              <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-honey-200 text-moka-800" id="total-spots-pill">89軒</span>
            </div>
            <!-- KINETIC TYPOGRAPHY LINE -->
            <p class="text-xs font-bold text-moka-700 flex items-center gap-1 mt-0.5">
              <span id="kinetic-word" class="inline-block text-caramel-500 font-black">コンセント有無</span>
              <span>が即わかる関西カフェ地図</span>
            </p>
          </div>
        </div>

        <!-- GPS & Saved Bookmarks Quick Buttons -->
        <div class="flex items-center gap-1.5">
          <button id="saved-only-btn" type="button" class="relative h-9 px-2.5 rounded-xl bg-cream-50/90 hover:bg-honey-200/70 border border-moka-900/12 flex items-center gap-1 text-xs font-bold text-moka-800 transition-all" title="保存したカフェのみ表示">
            <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 text-caramel-500" fill="currentColor"><path d="M5 3.5h10a1 1 0 0 1 1 1v12.5L10 13.6l-6 3.4V4.5a1 1 0 0 1 1-1z"/></svg>
            <span id="saved-count" class="font-mono text-[11px]">2</span>
          </button>
          <button id="gps-btn" type="button" class="h-9 px-3 rounded-xl bg-moka-900 hover:bg-caramel-500 text-cream-50 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors" title="現在地から近い順に並べる">
            <svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="10" cy="10" r="5"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke-linecap="round"/>
            </svg>
            <span>現在地</span>
          </button>
        </div>
      </div>

      <!-- AUTO COMPLETE SEARCH BOX -->
      <div class="relative mt-3" id="ac-container">
        <div class="relative flex items-center">
          <svg viewBox="0 0 20 20" class="w-4 h-4 text-moka-500 absolute left-3.5 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8.5" cy="8.5" r="5.3"/><path d="M12.8 12.8L16.8 16.8" stroke-linecap="round"/>
          </svg>
          <input
            id="search-input"
            type="text"
            autocomplete="off"
            placeholder="駅名・店名（北浜、烏丸、三宮、スタバ、FabCafe...）"
            aria-label="カフェ・駅名検索"
            class="w-full pl-10 pr-14 py-2.5 rounded-2xl bg-cream-50 border border-moka-900/15 focus:border-caramel-500 text-xs font-bold text-moka-900 placeholder:text-moka-500/70 placeholder:font-medium shadow-[inset_0_1px_2px_rgba(33,24,19,0.04)] focus:outline-none focus:ring-2 focus:ring-honey-300/70 transition-all"
          />
          <button id="clear-q-btn" type="button" class="hidden absolute right-9 w-5 h-5 rounded-full bg-cream-200 hover:bg-caramel-500 hover:text-white text-moka-700 flex items-center justify-center transition-colors" aria-label="クリア">
            <svg viewBox="0 0 14 14" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke-linecap="round"/></svg>
          </button>
          <kbd class="absolute right-3 px-1.5 py-0.5 rounded-md bg-cream-200/80 text-[10px] font-mono text-moka-500">/</kbd>
        </div>

        <!-- AUTO COMPLETE SUGGESTIONS PANEL -->
        <div id="ac-panel" role="listbox" class="hidden absolute left-0 right-0 mt-1.5 bg-cream-50/98 backdrop-blur-xl border border-moka-900/15 rounded-2xl shadow-[0_18px_40px_rgba(33,24,19,0.16)] overflow-hidden z-50">
          <ul id="ac-list" class="max-h-64 overflow-y-auto divide-y divide-moka-900/6"></ul>
        </div>
      </div>

      <!-- PHYSICAL TACTILE FILTER SWITCHES (Power / Wi-Fi / Category) -->
      <div class="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <!-- Tactile Switch: Power Available -->
        <button id="toggle-power-btn" type="button" aria-pressed="false" class="tactile-switch shrink-0 px-3 py-1.5 rounded-xl border border-moka-900/14 bg-cream-50 text-xs font-bold text-moka-800 flex items-center gap-1.5 transition-all">
          <span class="switch-dot w-2 h-2 rounded-full bg-moka-500/35 transition-colors"></span>
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 text-caramel-500" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6.5 2.5v3.5M11.5 2.5v3.5M4.5 6h9v2.8a4.5 4.5 0 0 1-9 0V6zM9 13.3v2.5"/></svg>
          <span>コンセントあり</span>
        </button>

        <!-- Tactile Switch: Free Wi-Fi -->
        <button id="toggle-wifi-btn" type="button" aria-pressed="false" class="tactile-switch shrink-0 px-3 py-1.5 rounded-xl border border-moka-900/14 bg-cream-50 text-xs font-bold text-moka-800 flex items-center gap-1.5 transition-all">
          <span class="switch-dot w-2 h-2 rounded-full bg-moka-500/35 transition-colors"></span>
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 text-sage-500" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 7a10.5 10.5 0 0 1 13 0M5.2 10a6.5 6.5 0 0 1 7.6 0M8.8 13.2h.4"/></svg>
          <span>Wi-Fiあり</span>
        </button>

        <!-- Category Segmented Mini-Pills -->
        <button type="button" data-cat="coworking" class="cat-chip shrink-0 px-2.5 py-1.5 rounded-xl border border-moka-900/12 bg-cream-50/70 text-xs font-bold text-moka-700 hover:bg-cream-50 transition-all">コワーキング</button>
        <button type="button" data-cat="cafe" class="cat-chip shrink-0 px-2.5 py-1.5 rounded-xl border border-moka-900/12 bg-cream-50/70 text-xs font-bold text-moka-700 hover:bg-cream-50 transition-all">カフェのみ</button>
      </div>
    </div>

    <!-- Compact Sort & Count Strip -->
    <div class="px-4 py-2 bg-cream-200/45 border-b border-moka-900/6 flex items-center justify-between text-[11px] shrink-0">
      <div class="flex items-center gap-1.5 text-moka-700 font-bold">
        <span id="list-result-count" class="font-mono text-moka-900">89</span>
        <span>スポット表示中</span>
        <span class="text-moka-500 font-normal hidden sm:inline">· 右スワイプ保存</span>
      </div>
      <div class="flex items-center gap-1.5">
        <select id="sort-select" aria-label="並び順" class="bg-transparent text-[11px] font-bold text-moka-800 focus:outline-none cursor-pointer">
          <option value="distance">近い順</option>
          <option value="score">作業快適順</option>
          <option value="speed">回線目安順</option>
        </select>
      </div>
    </div>

    <!-- PULL TO REFRESH (Minimal Pour-Over Dripper) -->
    <div id="ptr-bar" class="ptr-bar overflow-hidden bg-cream-100/80 flex items-center justify-center gap-2 text-[11px] font-bold text-moka-700 shrink-0" style="height:0px">
      <svg id="ptr-icon" viewBox="0 0 24 24" class="w-4 h-4 text-caramel-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 5h16l-4.5 8h-7L4 5z"/><path d="M8 13v5a4 4 0 0 0 8 0v-5"/><line x1="3" y1="13" x2="21" y2="13"/>
      </svg>
      <span id="ptr-label">引っ張って現在マップ周辺のカフェを再スキャン</span>
    </div>

    <!-- SCROLLABLE SPOT CARDS (Skeleton Screen + Swipe Action Cards) -->
    <div id="cards-scroller" class="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">

      <!-- SKELETON SCREEN -->
      <div id="skeleton-wrap" class="space-y-2">
        <div class="rounded-2xl bg-cream-50/85 p-3.5 space-y-2.5 border border-white/60">
          <div class="flex justify-between">
            <div class="h-4 w-3/5 rounded-lg latte-shimmer"></div>
            <div class="h-4 w-12 rounded-lg latte-shimmer"></div>
          </div>
          <div class="h-3 w-2/5 rounded-lg latte-shimmer"></div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <div class="h-7 rounded-xl latte-shimmer"></div>
            <div class="h-7 rounded-xl latte-shimmer"></div>
          </div>
        </div>
        <div class="rounded-2xl bg-cream-50/85 p-3.5 space-y-2.5 border border-white/60">
          <div class="flex justify-between">
            <div class="h-4 w-2/3 rounded-lg latte-shimmer"></div>
            <div class="h-4 w-12 rounded-lg latte-shimmer"></div>
          </div>
          <div class="h-3 w-1/2 rounded-lg latte-shimmer"></div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <div class="h-7 rounded-xl latte-shimmer"></div>
            <div class="h-7 rounded-xl latte-shimmer"></div>
          </div>
        </div>
        <div class="rounded-2xl bg-cream-50/85 p-3.5 space-y-2.5 border border-white/60">
          <div class="flex justify-between">
            <div class="h-4 w-1/2 rounded-lg latte-shimmer"></div>
            <div class="h-4 w-12 rounded-lg latte-shimmer"></div>
          </div>
          <div class="h-3 w-2/5 rounded-lg latte-shimmer"></div>
          <div class="grid grid-cols-2 gap-2 pt-1">
            <div class="h-7 rounded-xl latte-shimmer"></div>
            <div class="h-7 rounded-xl latte-shimmer"></div>
          </div>
        </div>
      </div>

      <!-- ACTUAL CARDS STREAM -->
      <div id="cards-list" class="space-y-2 hidden"></div>
    </div>
  </section>

  <!-- Mobile Toggle Button to Collapse/Show List on Small Screens -->
  <button id="mobile-sheet-toggle" type="button" class="sm:hidden fixed bottom-4 right-4 z-40 px-4 py-2.5 rounded-full bg-moka-900 text-cream-50 text-xs font-bold shadow-xl flex items-center gap-2">
    <span id="mobile-toggle-label">地図を広く見る</span>
  </button>

  <!-- =========================================================================
       [LAYER 3] SCULPTED BOTTOM SHEET (Spot Official Info, SNS, Power/Wi-Fi & Infographic)
       ========================================================================= -->
  <aside
    id="spot-bottom-sheet"
    role="dialog"
    aria-labelledby="bs-title"
    class="fixed left-3.5 sm:left-[428px] right-3.5 bottom-3.5 z-40 max-w-4xl mx-auto glass-island-solid rounded-[28px] translate-y-[120%] transition-transform duration-300 ease-out max-h-[82vh] flex flex-col overflow-hidden"
  >
    <!-- Drag Handle -->
    <div id="bs-handle" class="pt-2.5 pb-1.5 px-5 cursor-grab active:cursor-grabbing flex items-center justify-between border-b border-moka-900/8 shrink-0 touch-none">
      <span id="bs-area-tag" class="text-[11px] font-bold text-moka-500">大阪・北浜</span>
      <div class="w-10 h-1 rounded-full bg-moka-900/20"></div>
      <div class="flex items-center gap-1.5">
        <button id="bs-size-btn" type="button" class="px-2.5 py-1 rounded-lg bg-cream-200/70 hover:bg-honey-200 text-[11px] font-bold text-moka-800 transition-colors">拡大</button>
        <button id="bs-close-btn" type="button" class="w-7 h-7 rounded-full bg-cream-200/70 hover:bg-caramel-500 hover:text-white flex items-center justify-center text-moka-800 transition-colors" aria-label="閉じる">
          <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <!-- Bottom Sheet Dynamic Content -->
    <div id="bs-body" class="px-5 py-4 overflow-y-auto flex-1 space-y-4 select-text"></div>
  </aside>

  <!-- =========================================================================
       [LAYER 4] FLOATING TOAST STACK (Top-Center)
       ========================================================================= -->
  <aside id="toast-stack" aria-live="polite" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[90vw] max-w-sm"></aside>

  <!-- Subtle OSM Attribution Pill (Bottom-Right) -->
  <div class="fixed bottom-2 right-3 z-10 px-2 py-0.5 rounded-md bg-cream-50/75 backdrop-blur-sm text-[10px] font-mono text-moka-500 pointer-events-auto">
    <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="hover:underline">OpenStreetMap</a>
  </div>

  <!-- Main Client Script -->
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
