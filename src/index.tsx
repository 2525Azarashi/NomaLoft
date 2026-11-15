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

// GET /api/spots
app.get('/api/spots', (c) => {
  const lat = parseFloat(c.req.query('lat') || '34.6965')
  const lng = parseFloat(c.req.query('lng') || '135.5015')
  const list = KANSAI_SPOTS.map((s) => enrichSpot(s, lat, lng))

  return c.json({
    spots: list,
    regions: KANSAI_REGIONS,
    stats: {
      total: list.length,
      withPower: list.filter((s) => s.power === 'yes_all' || s.power === 'yes_part').length,
      withWifi: list.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg').length,
      coworking: list.filter((s) => s.category === 'coworking').length
    }
  })
})

// GET /api/autocomplete
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
      sub: `${s.areaLabel} · ${s.station}`,
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
      sub: item.type === 'area' ? 'この街へジャンプ' : '条件でさがす',
      areaId: item.areaId,
      query: item.query
    }))

  return c.json({
    items: [...matchedSpots, ...matchedQuick].slice(0, 8)
  })
})

app.get('/favicon.ico', (c) => c.redirect('/static/favicon.svg', 301))

// Main HTML Application
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>NomaLoft — 関西のあったかい電源・Wi-Fiカフェ地図</title>
  <meta name="description" content="大阪・京都・神戸・阪神・奈良の電源・Wi-Fiカフェとコワーキングスペースをやさしく探せるマップアプリ。" />
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;600;700&family=Zen+Maru+Gothic:wght@500;700;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            milktea: '#F8F1E7',
            panel: '#FCF8F2',
            espresso: '#36261C',
            latte: '#6E5849',
            cafeorange: '#E67645',
            sakura: { light: '#FCE4EC', ink: '#B84A69' },
            mint: { light: '#E0F3E8', ink: '#2F6F4E' },
            butter: { light: '#FEF3C7', ink: '#8C6218' }
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

  <!-- Leaflet + Leaflet.markercluster -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>

  <!-- Custom Styles & Design Tokens -->
  <link rel="stylesheet" href="/static/styles.css" />
</head>
<body class="h-screen w-screen overflow-hidden font-round antialiased select-none flex flex-col sm:flex-row">

  <!-- =========================================================================
       [LEFT PANEL] ORGANIZED SEARCH, FILTERS & CAFE LIST (Zero Map Overlap!)
       ========================================================================= -->
  <section
    id="left-sidebar"
    aria-label="カフェ検索と一覧"
    class="w-full sm:w-[420px] lg:w-[436px] h-[54vh] sm:h-screen bg-panel sm:border-r border-[#E8DDD0] flex flex-col shrink-0 z-20 order-2 sm:order-1 relative shadow-[4px_0_24px_rgba(102,71,48,0.06)]"
  >
    <!-- 1. Brand Header + Mascot Cup (Expression-Changing) + Unbreakable "いまここ" Button -->
    <header class="px-4 pt-3.5 pb-3 border-b border-[#EFE5D8] bg-white/70 shrink-0">
      <div class="flex items-center justify-between gap-3">
        <!-- Brand + Cute Animal-Ear Latte Cup Mascot -->
        <div class="flex items-center gap-2.5 min-w-0">
          <button
            id="header-mascot-btn"
            type="button"
            class="soft-press w-11 h-11 rounded-full bg-[#FFF7ED] border border-[#EADACA] flex items-center justify-center shrink-0 shadow-sm"
            title="カップくん（ブックマークするとにっこりするよ）"
          >
            <!-- Dynamic Mascot SVG Container (normal / happy / loading) -->
            <span id="header-mascot-svg" class="w-8 h-8 block"></span>
          </button>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-display font-bold text-xl tracking-tight text-espresso">NomaLoft</span>
              <span class="px-2.5 py-0.5 rounded-full bg-butter-light text-butter-ink text-[11px] font-bold whitespace-nowrap">関西カフェ地図</span>
            </div>
            <p class="text-xs font-bold text-latte truncate mt-0.5">
              <span id="kinetic-concept" class="text-cafeorange font-black">全席電源デスク</span>
              <span>もすぐ見つかるよ</span>
            </p>
          </div>
        </div>

        <!-- Fixed Unbreakable "いまここ" Button (white-space: nowrap + min-width) -->
        <button
          id="imakoko-header-btn"
          type="button"
          class="soft-press btn-imakoko h-9 px-3.5 bg-white hover:bg-[#FFF5EC] border border-[#E5D4C3] text-espresso text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
        >
          <svg viewBox="0 0 20 20" class="w-4 h-4 text-cafeorange shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="10" cy="10" r="5.2"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/><path d="M10 2.2v2.3M10 15.5v2.3M2.2 10h2.3M15.5 10h2.3"/>
          </svg>
          <span>いまここ</span>
        </button>
      </div>

      <!-- 2. Auto Complete Search Input -->
      <div class="relative mt-3" id="ac-wrap">
        <div class="relative flex items-center">
          <svg viewBox="0 0 20 20" class="w-4 h-4 text-[#9A8475] absolute left-3.5 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="8.8" cy="8.8" r="5.3"/><path d="M13 13l4 4"/>
          </svg>
          <input
            id="search-input"
            type="text"
            autocomplete="off"
            placeholder="駅名・お店の名前でさがす（梅田、北浜、京都…）"
            aria-label="カフェ検索"
            class="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-[#E6D8C9] focus:border-cafeorange text-[13px] font-bold text-espresso placeholder:text-[#A48F80] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#FCE3D5] transition-all"
          />
          <button
            id="clear-q-btn"
            type="button"
            class="hidden absolute right-3 w-6 h-6 rounded-full bg-[#F4EBE0] hover:bg-cafeorange hover:text-white text-latte flex items-center justify-center transition-colors"
            aria-label="入力をクリア"
          >
            <svg viewBox="0 0 14 14" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg>
          </button>
        </div>

        <!-- Auto Complete Dropdown -->
        <div id="ac-panel" role="listbox" class="hidden absolute left-0 right-0 mt-1.5 bg-white border border-[#E6D8C9] rounded-[20px] shadow-[0_14px_34px_rgba(92,62,40,0.14)] overflow-hidden z-50">
          <ul id="ac-list" class="max-h-60 overflow-y-auto divide-y divide-[#F3EAE0]"></ul>
        </div>
      </div>

      <!-- 3. Filter Pills with Counts (Selected = Solid Orange + White Text, Unselected = White + Thin Border) -->
      <div class="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5" aria-label="設備フィルタ">
        <button id="filter-power-btn" type="button" aria-pressed="false" class="soft-press tab-pill px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5">
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 2.5v3.2M11.5 2.5v3.2M4.5 5.7h9v2.8a4.5 4.5 0 0 1-9 0V5.7zM9 13v2.8"/></svg>
          <span>コンセントあり</span>
          <span id="count-power" class="count-chip">90</span>
        </button>

        <button id="filter-wifi-btn" type="button" aria-pressed="false" class="soft-press tab-pill px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5">
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.4 7a10.2 10.2 0 0 1 13.2 0M5.2 10a6.3 6.3 0 0 1 7.6 0M8.8 13h.4"/></svg>
          <span>Wi-Fiあり</span>
          <span id="count-wifi" class="count-chip">99</span>
        </button>

        <button id="filter-cowork-btn" type="button" aria-pressed="false" class="soft-press tab-pill px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5">
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3.5" width="12" height="7.5" rx="1.8"/><path d="M2 14h14M9 11v3"/></svg>
          <span>コワーキング</span>
          <span id="count-cowork" class="count-chip">25</span>
        </button>

        <button id="filter-saved-btn" type="button" aria-pressed="false" class="soft-press tab-pill px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1.5">
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3h9a1 1 0 0 1 1 1v11.5L9 12.4l-5.5 3.1V4a1 1 0 0 1 1-1z"/></svg>
          <span>ブックマーク</span>
          <span id="count-saved" class="count-chip">3</span>
        </button>
      </div>
    </header>

    <!-- 4. Friendly Count + Map Bounds Sync Pill + Sort -->
    <div class="px-4 py-2.5 bg-[#F7EFE4]/70 border-b border-[#ECE0D1] flex items-center justify-between gap-2 text-xs shrink-0">
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="font-bold text-espresso truncate" id="friendly-count-text">99軒のカフェが見つかったよ</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <label for="sort-select" class="sr-only">並び替え</label>
        <select id="sort-select" class="px-2.5 py-1 rounded-full bg-white border border-[#E6D8C9] text-xs font-bold text-espresso focus:outline-none cursor-pointer">
          <option value="distance">近い順</option>
          <option value="score">作業しやすい順</option>
          <option value="speed">Wi-Fi快適順</option>
        </select>
      </div>
    </div>

    <!-- Pull to Refresh Bar (Gentle Swaying Steam Cup) -->
    <div id="ptr-bar" class="overflow-hidden bg-[#FAF2E6] flex items-center justify-center gap-2 text-xs font-bold text-latte shrink-0 transition-all duration-200" style="height:0px">
      <span id="ptr-mascot-slot" class="w-6 h-6 inline-block"></span>
      <span id="ptr-label">引っ張ってこの周辺のカフェを更新…</span>
    </div>

    <!-- 5. Scrollable Cafe Cards List (Skeleton + Opaque Cards) -->
    <div id="cards-scroller" class="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
      <!-- Loading State with Swaying Steam Mascot + Skeleton Cards -->
      <div id="skeleton-wrap" class="space-y-3">
        <div class="flex items-center justify-center gap-2 py-2 text-xs font-bold text-latte">
          <span id="loading-mascot-slot" class="w-7 h-7 inline-block"></span>
          <span>あったかいカフェを探しているよ…</span>
        </div>
        <div class="rounded-[24px] bg-white p-4 space-y-2.5 border border-[#EDE2D5]">
          <div class="h-4 w-3/5 rounded-full cream-shimmer"></div>
          <div class="h-3.5 w-2/5 rounded-full cream-shimmer"></div>
          <div class="flex gap-2 pt-1">
            <div class="h-7 w-28 rounded-full cream-shimmer"></div>
            <div class="h-7 w-24 rounded-full cream-shimmer"></div>
          </div>
        </div>
        <div class="rounded-[24px] bg-white p-4 space-y-2.5 border border-[#EDE2D5]">
          <div class="h-4 w-2/3 rounded-full cream-shimmer"></div>
          <div class="h-3.5 w-1/2 rounded-full cream-shimmer"></div>
          <div class="flex gap-2 pt-1">
            <div class="h-7 w-28 rounded-full cream-shimmer"></div>
            <div class="h-7 w-24 rounded-full cream-shimmer"></div>
          </div>
        </div>
      </div>

      <!-- Cards Container -->
      <div id="cards-list" class="space-y-3 hidden"></div>
    </div>
  </section>

  <!-- =========================================================================
       [RIGHT MAP AREA] CLEAN CLUSTERED MAP + ORGANIZED AREA STRIP + BOTTOM SHEET
       ========================================================================= -->
  <main id="map-stage" class="flex-1 h-[46vh] sm:h-screen relative overflow-hidden order-1 sm:order-2">

    <!-- Top Area Tabs Strip (Clean single horizontal scroll row with generous margin) -->
    <div class="absolute top-3.5 left-3.5 right-3.5 z-[500] pointer-events-none flex flex-col items-start gap-2">
      <nav
        id="area-tabs-nav"
        aria-label="関西エリアタブ"
        class="pointer-events-auto max-w-full overflow-x-auto no-scrollbar bg-white/92 backdrop-blur-md border border-[#E8DDD0] rounded-full p-1.5 shadow-[0_8px_24px_rgba(92,62,40,0.1)] flex items-center gap-1"
      >
        <button type="button" data-region="all" class="soft-press tab-pill is-selected px-3.5 py-1.5 text-xs font-bold">関西すべて</button>
        <button type="button" data-region="imakoko" id="region-imakoko-tab" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold hidden">いまここ周辺</button>
        <button type="button" data-region="umeda" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">梅田・新大阪</button>
        <button type="button" data-region="kitahama" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">北浜・本町</button>
        <button type="button" data-region="shinsaibashi" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">心斎橋・難波</button>
        <button type="button" data-region="tennoji" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">天王寺</button>
        <button type="button" data-region="kyoto" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">京都</button>
        <button type="button" data-region="kobe" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">神戸</button>
        <button type="button" data-region="hanshin" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">西宮・芦屋</button>
        <button type="button" data-region="nara" class="soft-press tab-pill px-3.5 py-1.5 text-xs font-bold">奈良</button>
      </nav>

      <!-- Contextual "Search in this map area" Pill (Shown when user pans/zooms map) -->
      <div class="w-full flex justify-center pointer-events-none">
        <button
          id="search-this-bounds-btn"
          type="button"
          class="hidden pointer-events-auto soft-press px-4 py-2 rounded-full bg-espresso text-white text-xs font-bold shadow-[0_8px_22px_rgba(54,38,28,0.25)] inline-flex items-center gap-2 hover:bg-cafeorange transition-colors"
        >
          <svg viewBox="0 0 18 18" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 9A6 6 0 1 1 13.2 4.7M15 3v3.5h-3.5"/></svg>
          <span id="bounds-btn-text">この地図の範囲でさがす</span>
        </button>
      </div>
    </div>

    <!-- Leaflet Map Canvas -->
    <div id="nomaloft-map" class="w-full h-full calm-cafe-tiles z-10"></div>

    <!-- Map Bottom-Left Compact Legend -->
    <div class="hidden md:flex absolute bottom-4 left-4 z-[500] bg-white/92 backdrop-blur-sm border border-[#E8DDD0] rounded-full px-3.5 py-1.5 shadow-sm items-center gap-3 text-[11px] font-bold text-espresso">
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-cafeorange inline-block"></span>
        <span>電源＋Wi-Fiあり</span>
      </span>
      <span class="inline-flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-[#FFF5E4] border border-[#DFC3A8] inline-block"></span>
        <span>一部のみ</span>
      </span>
      <span class="text-[#9A8475] font-normal">ズームで店名表示</span>
    </div>

    <!-- Map Bottom-Right Round "いまここ" Button + OSM Attribution -->
    <div class="absolute bottom-24 right-3 z-[500] flex flex-col items-end gap-2">
      <button
        id="map-imakoko-fab"
        type="button"
        class="soft-press w-11 h-11 rounded-full bg-white hover:bg-[#FFF5EC] border border-[#E5D4C3] shadow-[0_6px_18px_rgba(92,62,40,0.16)] flex items-center justify-center text-cafeorange"
        title="いまここ（現在地へ移動）"
        aria-label="いまここへ移動"
      >
        <svg viewBox="0 0 22 22" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="5.5"/><circle cx="11" cy="11" r="1.8" fill="currentColor"/><path d="M11 2.5v2.5M11 17v2.5M2.5 11H5M17 11h2.5"/>
        </svg>
      </button>
    </div>

    <div class="absolute bottom-1.5 right-2.5 z-[400] px-2 py-0.5 rounded-full bg-white/75 text-[10px] text-[#8E796A]">
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="hover:underline">OpenStreetMap</a>
    </div>

    <!-- =========================================================================
         BOTTOM SHEET (Cafe Details, Official Website/SNS, Power/Wi-Fi & Infographic)
         ========================================================================= -->
    <aside
      id="spot-bottom-sheet"
      role="dialog"
      aria-labelledby="bs-title"
      class="absolute left-3 right-3 bottom-3 z-[800] max-w-3xl mx-auto bg-white border border-[#E8DDD0] rounded-[28px] shadow-[0_-8px_36px_rgba(92,62,40,0.18)] translate-y-[120%] transition-transform duration-300 ease-out max-h-[82%] flex flex-col overflow-hidden"
    >
      <!-- Drag Handle -->
      <div id="bs-handle" class="pt-2.5 pb-2 px-5 cursor-grab active:cursor-grabbing flex items-center justify-between border-b border-[#F2E8DC] bg-[#FFFDF9] shrink-0 touch-none">
        <span id="bs-area-badge" class="px-2.5 py-0.5 rounded-full bg-milktea text-latte text-[11px] font-bold">大阪・北浜</span>
        <div class="w-11 h-1.5 rounded-full bg-[#E6D8C9]"></div>
        <div class="flex items-center gap-1.5">
          <button id="bs-size-btn" type="button" class="soft-press px-3 py-1 rounded-full bg-milktea hover:bg-butter-light text-[11px] font-bold text-espresso">大きく見る</button>
          <button id="bs-close-btn" type="button" class="soft-press w-7 h-7 rounded-full bg-milktea hover:bg-cafeorange hover:text-white flex items-center justify-center text-latte transition-colors" aria-label="とじる">
            <svg viewBox="0 0 14 14" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7"/></svg>
          </button>
        </div>
      </div>

      <!-- Sheet Content -->
      <div id="bs-body" class="px-5 py-4 overflow-y-auto flex-1 space-y-4 select-text"></div>
    </aside>
  </main>

  <!-- Floating Toast Stack -->
  <aside id="toast-stack" aria-live="polite" class="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none w-[90vw] max-w-sm"></aside>

  <!-- Main Client Script -->
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
