import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { WORK_SPOTS, KANSAI_AREAS, AUTOCOMPLETE_KEYWORDS, WorkSpot } from './data/spots'

const app = new Hono()

app.use('/api/*', cors())

function calcDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function enrichSpot(spot: WorkSpot, userLat: number, userLng: number, jitterSeed: number) {
  const distanceMeters = calcDistanceMeters(userLat, userLng, spot.lat, spot.lng)
  const walkMinFromHere = Math.max(1, Math.round(distanceMeters / 80))

  let seatsAvailable = spot.seatsAvailable
  let crowdLevel = spot.crowdLevel
  let wifiMbps = spot.wifiMbps

  if (jitterSeed > 0) {
    const hash = (spot.id.charCodeAt(6) + jitterSeed * 3) % 7
    const deltaSeats = hash - 3
    seatsAvailable = Math.max(2, Math.min(spot.totalSeats - 2, spot.seatsAvailable + deltaSeats))
    crowdLevel = Math.max(14, Math.min(86, Math.round(((spot.totalSeats - seatsAvailable) / spot.totalSeats) * 100)))
    wifiMbps = Math.max(140, spot.wifiMbps + (hash - 3) * 9)
  }

  const nomadScore = Math.round(
    spot.outletRatio * 0.25 +
      spot.wifiStability * 0.25 +
      spot.chairComfort * 0.2 +
      spot.coffeeScore * 0.15 +
      (100 - crowdLevel) * 0.15
  )

  return {
    ...spot,
    seatsAvailable,
    crowdLevel,
    wifiMbps,
    distanceMeters,
    walkMinFromHere,
    nomadScore
  }
}

// GET /api/spots — Kansai spots with distance, filters, and telemetry summary
app.get('/api/spots', (c) => {
  // Default: Osaka Kitahama / Nakanoshima center
  const lat = parseFloat(c.req.query('lat') || '34.6918')
  const lng = parseFloat(c.req.query('lng') || '135.5064')
  const category = c.req.query('category') || 'all'
  const filter = c.req.query('filter') || ''
  const q = (c.req.query('q') || '').trim().toLowerCase()
  const sort = c.req.query('sort') || 'distance'
  const jitter = parseInt(c.req.query('jitter') || '0', 10)

  let results = WORK_SPOTS.map((s) => enrichSpot(s, lat, lng, jitter))

  if (category !== 'all') {
    if (category === 'cafe') {
      results = results.filter(
        (s) => s.category === 'cafe' || s.category === 'roastery' || s.category === 'library_cafe'
      )
    } else {
      results = results.filter((s) => s.category === category)
    }
  }

  if (filter === 'power90') {
    results = results.filter((s) => s.outletRatio >= 90)
  } else if (filter === 'wifi300') {
    results = results.filter((s) => s.wifiMbps >= 300)
  } else if (filter === 'call_ok') {
    results = results.filter((s) => s.callAllowed === 'ok' || s.callAllowed === 'booth_only')
  } else if (filter === 'quiet') {
    results = results.filter((s) => s.quietness >= 88)
  } else if (filter === 'empty') {
    results = results.filter((s) => s.crowdLevel <= 36)
  }

  if (q) {
    results = results.filter((s) => {
      const hay = [
        s.name,
        s.nameEn,
        s.area,
        s.station,
        s.categoryLabel,
        s.catchcopy,
        s.description,
        s.signatureDrink,
        ...s.tags
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }

  if (sort === 'distance') {
    results.sort((a, b) => a.distanceMeters - b.distanceMeters)
  } else if (sort === 'wifi') {
    results.sort((a, b) => b.wifiMbps - a.wifiMbps)
  } else if (sort === 'empty') {
    results.sort((a, b) => a.crowdLevel - b.crowdLevel)
  } else if (sort === 'score') {
    results.sort((a, b) => b.nomadScore - a.nomadScore)
  }

  const avgWifi = results.length
    ? Math.round(results.reduce((acc, s) => acc + s.wifiMbps, 0) / results.length)
    : 0
  const totalOpenSeats = results.reduce((acc, s) => acc + s.seatsAvailable, 0)
  const avgPower = results.length
    ? Math.round(results.reduce((acc, s) => acc + s.outletRatio, 0) / results.length)
    : 0

  return c.json({
    spots: results,
    areas: KANSAI_AREAS,
    summary: {
      count: results.length,
      avgWifi,
      totalOpenSeats,
      avgPower,
      updatedAt: new Date().toISOString()
    }
  })
})

// GET /api/osm-nearby — Free OpenStreetMap Overpass API live cafe/coworking query in Kansai
app.get('/api/osm-nearby', async (c) => {
  const lat = parseFloat(c.req.query('lat') || '34.6918')
  const lng = parseFloat(c.req.query('lng') || '135.5064')
  const radius = Math.min(1500, parseInt(c.req.query('radius') || '900', 10))

  const overpassQuery = `[out:json][timeout:8];(node["amenity"="cafe"](around:${radius},${lat},${lng});node["amenity"="coworking_space"](around:${radius},${lat},${lng}););out body 18;`

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'NomaLoftKansai/1.0'
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(3500)
      })

      if (!res.ok) continue

      const json = (await res.json()) as {
        elements?: Array<{
          id: number
          lat: number
          lon: number
          tags?: Record<string, string>
        }>
      }

      const nodes = (json.elements || [])
        .filter((el) => el.tags && (el.tags['name:ja'] || el.tags.name))
        .slice(0, 16)
        .map((el) => ({
          id: `osm-${el.id}`,
          name: el.tags?.['name:ja'] || el.tags?.name || 'Cafe',
          lat: el.lat,
          lng: el.lon,
          type: el.tags?.amenity === 'coworking_space' ? 'coworking' : 'cafe',
          wifi: el.tags?.internet_access === 'wlan' || el.tags?.internet_access === 'yes',
          openingHours: el.tags?.opening_hours || '営業時間情報なし'
        }))

      return c.json({ osmNodes: nodes, source: 'overpass' })
    } catch {
      continue
    }
  }

  return c.json({ osmNodes: [], source: 'offline_graceful' })
})

// GET /api/autocomplete
app.get('/api/autocomplete', (c) => {
  const q = (c.req.query('q') || '').trim().toLowerCase()

  const spotSuggestions = WORK_SPOTS.filter((s) => {
    if (!q) return true
    return (
      s.name.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.station.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    )
  })
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      type: 'spot',
      label: s.name,
      sub: `${s.area} / ${s.station} 徒歩${s.walkMinutes}分 / ${s.wifiMbps}Mbps`,
      query: s.name,
      spotId: s.id,
      iconType: s.category === 'coworking' ? 'desk' : 'cup'
    }))

  const keywordSuggestions = AUTOCOMPLETE_KEYWORDS.filter((k) => {
    if (!q) return true
    return k.label.toLowerCase().includes(q) || k.query.toLowerCase().includes(q)
  })
    .slice(0, 5)
    .map((k, idx) => ({
      id: `kw-${idx}`,
      type: k.type,
      areaId: k.areaId || '',
      label: k.label,
      sub: k.type === 'area' ? '関西エリア座標へマップ移動' : 'ワーク環境フィルター検索',
      query: k.query,
      iconType: k.iconType
    }))

  return c.json({
    suggestions: [...spotSuggestions, ...keywordSuggestions].slice(0, 8)
  })
})

// POST /api/checkin
app.post('/api/checkin', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const spotId = body.spotId || 'spot-kitahama-river'
  const spot = WORK_SPOTS.find((s) => s.id === spotId) || WORK_SPOTS[0]
  return c.json({
    ok: true,
    spotName: spot.name,
    beansEarned: 15,
    message: `${spot.name} にチェックインを記録しました（Roast Stamp +15）`
  })
})

app.get('/favicon.ico', (c) => c.redirect('/static/favicon.svg', 301))

// Main Horizontal Widescreen App Shell (Zero Default Emojis)
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>NomaLoft KANSAI — 関西ワークカフェ＆コワーキング空間図鑑</title>
  <meta name="description" content="大阪・京都・神戸のPCワーカー向け電源カフェ・コワーキングスペースを無料OpenStreetMap上に可視化する横画面フィールドガイド。" />
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />

  <!-- Editorial & Technical Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Space+Mono:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Zen+Maru+Gothic:wght@500;700&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            washi: {
              50: '#FCF9F4',
              100: '#F5EFE6',
              200: '#EAE0D0',
              300: '#DCD0BC',
              400: '#C5B49B',
            },
            sumi: {
              600: '#6E6259',
              700: '#4F443C',
              800: '#352C26',
              900: '#221B17',
            },
            roast: {
              400: '#D4795E',
              500: '#C06044',
              600: '#A44B31',
            },
            moss: {
              400: '#6C8F73',
              500: '#4E7255',
            },
            brass: {
              300: '#EAD296',
              400: '#D4B267',
              500: '#B58F44',
            }
          },
          fontFamily: {
            serif: ['"Fraunces"', '"Zen Maru Gothic"', 'serif'],
            sans: ['"Zen Kaku Gothic New"', 'sans-serif'],
            round: ['"Zen Maru Gothic"', 'sans-serif'],
            mono: ['"Space Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Free OpenStreetMap + Leaflet -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Custom Architectural & Motion Styles -->
  <link rel="stylesheet" href="/static/styles.css" />
</head>
<body class="bg-washi-100 text-sumi-900 font-sans antialiased selection:bg-brass-300 selection:text-sumi-900 h-screen w-screen overflow-hidden select-none">

  <!-- Subtle Tactile Washi Paper Grain -->
  <div class="washi-grain pointer-events-none fixed inset-0 z-50"></div>

  <!-- Custom Minimal Line-Art Cursor Follower (Desktop) -->
  <div id="craft-cursor" class="hidden lg:flex fixed top-0 left-0 w-7 h-7 rounded-full border border-sumi-900/45 bg-brass-300/20 pointer-events-none z-[9998] items-center justify-center text-[10px] font-mono font-bold tracking-tighter text-sumi-900 opacity-0 transition-opacity duration-150"></div>

  <!-- Toast Stack (Top-Right over Map Stage) -->
  <aside id="toast-container" aria-live="polite" class="fixed top-4 right-4 w-80 sm:w-96 z-[9990] flex flex-col gap-2 pointer-events-none"></aside>

  <!-- Portrait Orientation Gentle Banner (Only on narrow portrait phones) -->
  <div id="portrait-hint" class="portrait-only-banner fixed bottom-3 left-3 right-3 z-[9500] bg-sumi-900 text-washi-50 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs shadow-lg">
    <span class="font-medium">横画面（ランドスケープ）表示に最適化されています</span>
    <button id="dismiss-portrait-hint" type="button" class="font-mono text-[11px] underline ml-2">CLOSE</button>
  </div>

  <!-- =====================================================================
       HORIZONTAL WIDESCREEN STUDIO SHELL (100vw x 100vh Split Cockpit)
       [1] Left Area Index Rail  [2] Editorial Spot Deck  [3] Free OSM Map
       ===================================================================== -->
  <div id="app-landscape-shell" class="h-screen w-screen flex flex-row overflow-hidden relative z-10">

    <!-- ================= [1] SLIM KANSAI STUDIO RAIL (LEFT) ================= -->
    <nav id="studio-rail" aria-label="関西エリア切替ナビゲーション" class="w-16 sm:w-[72px] h-full bg-washi-200/85 border-r border-sumi-900/15 flex flex-col items-center justify-between py-3.5 shrink-0 z-30">
      <!-- Brand Monogram + Steaming Dripper Line-Art -->
      <div class="flex flex-col items-center gap-1">
        <button id="brand-roast-fortune-btn" type="button" class="group w-11 h-11 rounded-2xl bg-washi-50 border border-sumi-900 flex items-center justify-center shadow-[0_2px_0_#221B17] hover:bg-brass-300/60 active:translate-y-0.5 transition-all" title="NomaLoft — クリックで今日の珈琲ドリップ診断">
          <svg viewBox="0 0 36 36" class="w-6 h-6" fill="none" stroke="#221B17" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path class="steam-stroke s-1" d="M14 8 C13 5.5 15.5 4.5 14.5 2.5" stroke="#C06044"/>
            <path class="steam-stroke s-2" d="M20 9 C19 6.5 21.5 5.5 20.5 3.5" stroke="#B58F44"/>
            <path d="M8 14 H25 V22 C25 26.8 21.2 30.5 16.5 30.5 C11.8 30.5 8 26.8 8 22 Z" fill="#FCF9F4"/>
            <path d="M25 16 H28 C30 16 31 17.4 31 19.2 C31 21 30 22.4 28 22.4 H25"/>
            <circle cx="14" cy="21" r="1" fill="#221B17" stroke="none"/>
            <circle cx="19" cy="21" r="1" fill="#221B17" stroke="none"/>
            <path d="M15.2 23.4 Q16.5 24.6 17.8 23.4" stroke-width="1.5"/>
          </svg>
        </button>
        <span class="font-mono text-[9px] font-bold tracking-widest text-sumi-700">KANSAI</span>
      </div>

      <!-- Kansai District Vertical Index Buttons -->
      <div class="flex flex-col items-center gap-1.5 my-auto" id="kansai-rail-areas">
        <button type="button" data-area="kitahama" data-lat="34.6918" data-lng="135.5064" data-label="大阪・北浜 / 中之島" class="rail-area-btn active group w-12 py-2 rounded-xl border border-sumi-900 bg-sumi-900 text-washi-50 flex flex-col items-center gap-0.5 transition-all">
          <span class="font-mono text-[9px] opacity-75">OSK1</span>
          <span class="text-[11px] font-bold tracking-tight">北浜</span>
        </button>
        <button type="button" data-area="umeda" data-lat="34.7055" data-lng="135.5048" data-label="大阪・梅田 / 中崎町" class="rail-area-btn group w-12 py-2 rounded-xl border border-transparent hover:border-sumi-900/30 bg-washi-50/70 text-sumi-800 flex flex-col items-center gap-0.5 transition-all">
          <span class="font-mono text-[9px] text-sumi-600">OSK2</span>
          <span class="text-[11px] font-bold tracking-tight">梅田</span>
        </button>
        <button type="button" data-area="horie" data-lat="34.6736" data-lng="135.4952" data-label="大阪・心斎橋 / 堀江" class="rail-area-btn group w-12 py-2 rounded-xl border border-transparent hover:border-sumi-900/30 bg-washi-50/70 text-sumi-800 flex flex-col items-center gap-0.5 transition-all">
          <span class="font-mono text-[9px] text-sumi-600">OSK3</span>
          <span class="text-[11px] font-bold tracking-tight">堀江</span>
        </button>
        <button type="button" data-area="kyoto" data-lat="35.0086" data-lng="135.7632" data-label="京都・烏丸 / 河原町" class="rail-area-btn group w-12 py-2 rounded-xl border border-transparent hover:border-sumi-900/30 bg-washi-50/70 text-sumi-800 flex flex-col items-center gap-0.5 transition-all">
          <span class="font-mono text-[9px] text-sumi-600">KYO</span>
          <span class="text-[11px] font-bold tracking-tight">京都</span>
        </button>
        <button type="button" data-area="kobe" data-lat="34.6882" data-lng="135.1912" data-label="神戸・旧居留地 / 元町" class="rail-area-btn group w-12 py-2 rounded-xl border border-transparent hover:border-sumi-900/30 bg-washi-50/70 text-sumi-800 flex flex-col items-center gap-0.5 transition-all">
          <span class="font-mono text-[9px] text-sumi-600">KOB</span>
          <span class="text-[11px] font-bold tracking-tight">神戸</span>
        </button>
      </div>

      <!-- Bottom Utility Controls (Ambience Synth, Saved Passbook, Focus Timer) -->
      <div class="flex flex-col items-center gap-2">
        <!-- Cafe Room Sound Synth -->
        <button id="ambience-btn" type="button" class="w-10 h-10 rounded-xl bg-washi-50 border border-sumi-900/30 hover:border-sumi-900 flex items-center justify-center text-sumi-800 transition-all" title="喫茶室の環境音アンビエント ON/OFF">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4"/>
          </svg>
        </button>

        <!-- Saved Passbook Filter Button -->
        <button id="saved-filter-btn" type="button" class="relative w-10 h-10 rounded-xl bg-washi-50 border border-sumi-900/30 hover:border-sumi-900 flex items-center justify-center text-sumi-800 transition-all" title="保存済みブックマーク一覧">
          <svg id="rail-bookmark-svg" viewBox="0 0 24 24" class="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z"/>
          </svg>
          <span id="saved-count-badge" class="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-roast-500 text-washi-50 font-mono text-[10px] font-bold flex items-center justify-center">2</span>
        </button>

        <!-- Focus Pomodoro Popover Trigger + Stamp Points -->
        <button id="pomo-popover-btn" type="button" class="w-12 py-1.5 rounded-xl bg-sumi-900 text-washi-50 flex flex-col items-center justify-center gap-0.5 hover:bg-roast-500 transition-colors" title="25分珈琲タイマー＆スタンプ帳">
          <span id="bean-points" class="font-mono text-[11px] font-bold leading-none">45</span>
          <span class="font-mono text-[8px] tracking-wider opacity-75">STAMP</span>
        </button>
      </div>
    </nav>

    <!-- ================= [2] EDITORIAL SPOT DECK (LEFT-CENTER PANEL) ================= -->
    <section id="editorial-deck" aria-label="スポット検索と一覧" class="w-[340px] sm:w-[395px] xl:w-[430px] h-full bg-washi-100 border-r border-sumi-900/15 flex flex-col shrink-0 z-20 relative">

      <!-- Masthead + KINETIC TYPOGRAPHY -->
      <header class="px-4 pt-3.5 pb-3 bg-washi-50 border-b border-sumi-900/12 shrink-0">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="font-serif italic font-bold text-lg tracking-tight text-sumi-900">NomaLoft</span>
            <span class="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-washi-200 text-sumi-700">ISSUE 01 · KANSAI</span>
          </div>
          <button id="locate-me-btn" type="button" class="craft-btn px-2.5 py-1 rounded-lg bg-washi-100 border border-sumi-900 text-[11px] font-bold text-sumi-900 flex items-center gap-1.5 hover:bg-brass-300/60">
            <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 text-roast-500" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="10" cy="10" r="5.5"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke-linecap="round"/>
            </svg>
            <span>現在地測位</span>
          </button>
        </div>

        <!-- KINETIC TYPOGRAPHY STAGE (Editorial Split-Flap & Stagger Motion) -->
        <h1 id="kinetic-headline" class="text-[17px] xl:text-[19px] font-bold leading-snug tracking-tight text-sumi-900 py-0.5">
          <span class="text-sumi-600 text-xs font-medium block mb-0.5" id="current-area-caption">大阪・北浜 / 中之島 — 徒歩圏フィールドノート</span>
          <span class="inline-flex flex-wrap items-baseline gap-x-1.5">
            <span class="kinetic-slot inline-flex items-center px-2 py-0.5 rounded-md bg-brass-300/55 border border-sumi-900/35">
              <span id="kinetic-rotating-word" class="font-round font-bold text-sumi-900">全席コンセントの</span>
            </span>
            <span class="kinetic-wave-text font-serif font-bold">喫茶と仕事場。</span>
          </span>
        </h1>

        <!-- AUTO COMPLETE SEARCH BAR -->
        <div class="relative mt-2.5" id="autocomplete-wrapper">
          <div class="relative flex items-center">
            <svg viewBox="0 0 20 20" class="w-4 h-4 text-sumi-600 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4 4" stroke-linecap="round"/>
            </svg>
            <input
              id="search-input"
              type="text"
              autocomplete="off"
              placeholder="北浜・中崎町・烏丸・全席電源・防音ブース..."
              aria-label="スポット検索"
              aria-expanded="false"
              aria-controls="autocomplete-dropdown"
              class="w-full pl-9 pr-16 py-2 rounded-xl bg-white border border-sumi-900/35 focus:border-sumi-900 text-xs font-medium text-sumi-900 placeholder:text-sumi-600/60 focus:outline-none focus:ring-2 focus:ring-brass-300/60 transition-all"
            />
            <button id="clear-search-btn" type="button" class="hidden absolute right-9 w-5 h-5 rounded-full bg-washi-200 text-sumi-800 hover:bg-roast-500 hover:text-white flex items-center justify-center transition-colors" aria-label="検索語をクリア">
              <svg viewBox="0 0 16 16" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l8 8M12 4l-8 8" stroke-linecap="round"/></svg>
            </button>
            <kbd class="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono bg-washi-100 border border-sumi-900/20 rounded text-sumi-600">/</kbd>
          </div>

          <!-- AUTO COMPLETE DROPDOWN -->
          <div id="autocomplete-dropdown" role="listbox" class="hidden absolute left-0 right-0 mt-1.5 bg-washi-50 border border-sumi-900 rounded-xl shadow-[0_12px_28px_rgba(34,27,23,0.16)] overflow-hidden z-50">
            <div class="px-3 py-1.5 bg-washi-200/70 border-b border-sumi-900/10 flex items-center justify-between text-[10px] font-mono text-sumi-700">
              <span>SUGGESTIONS (↑↓ / ENTER)</span>
              <span id="ac-count">8</span>
            </div>
            <ul id="autocomplete-list" class="max-h-64 overflow-y-auto divide-y divide-sumi-900/10"></ul>
          </div>
        </div>

        <!-- Horizontal Filter Strip -->
        <div class="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5" id="filter-bar">
          <button type="button" data-cat="all" class="cat-pill active shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-sumi-900 bg-sumi-900 text-washi-50 transition-all">すべて</button>
          <button type="button" data-cat="cafe" class="cat-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-sumi-900/25 bg-washi-50 text-sumi-800 hover:border-sumi-900 transition-all">喫茶・焙煎所</button>
          <button type="button" data-cat="coworking" class="cat-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-sumi-900/25 bg-washi-50 text-sumi-800 hover:border-sumi-900 transition-all">コワーキング</button>
          <span class="h-3.5 w-[1px] bg-sumi-900/15 shrink-0 mx-0.5"></span>
          <button type="button" data-filter="power90" class="cond-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-sumi-900/20 bg-washi-100 text-sumi-800 hover:border-sumi-900 transition-all">電源90%+</button>
          <button type="button" data-filter="wifi300" class="cond-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-sumi-900/20 bg-washi-100 text-sumi-800 hover:border-sumi-900 transition-all">300Mbps+</button>
          <button type="button" data-filter="call_ok" class="cond-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-sumi-900/20 bg-washi-100 text-sumi-800 hover:border-sumi-900 transition-all">会議・ブース可</button>
          <button type="button" data-filter="quiet" class="cond-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-sumi-900/20 bg-washi-100 text-sumi-800 hover:border-sumi-900 transition-all">静寂読書</button>
        </div>
      </header>

      <!-- Sub-toolbar: Count + Sort + Swipe Guide + Refresh -->
      <div class="px-4 py-2 bg-washi-200/55 border-b border-sumi-900/10 flex items-center justify-between text-[11px] shrink-0">
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold text-sumi-900"><span id="spot-count-num">8</span> SPOTS</span>
          <span class="text-sumi-600 text-[10px]">左右スワイプで保存/記録</span>
        </div>
        <div class="flex items-center gap-1.5">
          <select id="sort-select" aria-label="並び替え" class="bg-washi-50 border border-sumi-900/25 rounded-md px-2 py-0.5 text-[11px] font-bold text-sumi-900 focus:outline-none cursor-pointer">
            <option value="distance">現在地から近い順</option>
            <option value="score">快適指数順</option>
            <option value="wifi">回線速度順</option>
            <option value="empty">空席ゆとり順</option>
          </select>
          <button id="deck-refresh-btn" type="button" class="p-1 rounded-md bg-washi-50 border border-sumi-900/25 hover:bg-brass-300/50 text-sumi-800" title="空席・回線状況を再取得">
            <svg id="deck-refresh-svg" viewBox="0 0 20 20" class="w-3.5 h-3.5 transition-transform duration-500" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6"/><path d="M16.5 3.5v3.5H13"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- PULL TO REFRESH (V60 Hand-Drip Line-Art Indicator) -->
      <div id="ptr-indicator" class="ptr-box overflow-hidden bg-washi-200/70 border-b border-sumi-900/10 flex items-center justify-center gap-2.5 text-[11px] font-bold text-sumi-800 shrink-0" style="height: 0px;">
        <svg id="ptr-dripper-svg" viewBox="0 0 32 32" class="w-6 h-6" fill="none" stroke="#221B17" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="6,7 26,7 20,17 12,17" fill="#FCF9F4"/>
          <line x1="4" y1="17" x2="28" y2="17"/>
          <path d="M10 17 V25 C10 27.2 12.7 29 16 29 C19.3 29 22 27.2 22 25 V17"/>
          <circle id="ptr-drop" cx="16" cy="22" r="1.5" fill="#C06044" stroke="none"/>
        </svg>
        <span id="ptr-text">下に引いて最新ステータスをハンドドリップ...</span>
      </div>

      <!-- SCROLLABLE SPOT STREAM (Skeleton Screen + Swipe Action Cards) -->
      <div id="spot-scroll-container" class="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5">

        <!-- SKELETON SCREEN -->
        <div id="skeleton-list" class="space-y-2.5">
          <div class="rounded-2xl border border-sumi-900/12 bg-washi-50 p-3.5 space-y-2.5">
            <div class="flex gap-3">
              <div class="w-24 h-20 rounded-xl washi-shimmer shrink-0"></div>
              <div class="flex-1 space-y-2 py-0.5">
                <div class="h-3 w-1/3 rounded washi-shimmer"></div>
                <div class="h-4 w-4/5 rounded washi-shimmer"></div>
                <div class="h-3 w-2/3 rounded washi-shimmer"></div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1.5 pt-1">
              <div class="h-6 rounded-lg washi-shimmer"></div>
              <div class="h-6 rounded-lg washi-shimmer"></div>
              <div class="h-6 rounded-lg washi-shimmer"></div>
            </div>
          </div>
          <div class="rounded-2xl border border-sumi-900/12 bg-washi-50 p-3.5 space-y-2.5">
            <div class="flex gap-3">
              <div class="w-24 h-20 rounded-xl washi-shimmer shrink-0"></div>
              <div class="flex-1 space-y-2 py-0.5">
                <div class="h-3 w-2/5 rounded washi-shimmer"></div>
                <div class="h-4 w-3/4 rounded washi-shimmer"></div>
                <div class="h-3 w-1/2 rounded washi-shimmer"></div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-1.5 pt-1">
              <div class="h-6 rounded-lg washi-shimmer"></div>
              <div class="h-6 rounded-lg washi-shimmer"></div>
              <div class="h-6 rounded-lg washi-shimmer"></div>
            </div>
          </div>
          <div class="rounded-2xl border border-sumi-900/12 bg-washi-50 p-3.5 space-y-2.5">
            <div class="flex gap-3">
              <div class="w-24 h-20 rounded-xl washi-shimmer shrink-0"></div>
              <div class="flex-1 space-y-2 py-0.5">
                <div class="h-3 w-1/4 rounded washi-shimmer"></div>
                <div class="h-4 w-5/6 rounded washi-shimmer"></div>
                <div class="h-3 w-3/5 rounded washi-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTUAL SWIPEABLE SPOT CARDS -->
        <div id="spots-cards-list" class="space-y-2.5 hidden"></div>
      </div>

      <!-- Focus Timer Floating Mini-Drawer (Inside Deck Bottom when toggled) -->
      <div id="pomo-drawer" class="hidden border-t border-sumi-900 bg-washi-50 px-4 py-3 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-roast-500" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6" stroke-linecap="round"/>
            </svg>
            <div>
              <div class="text-[10px] font-mono uppercase tracking-wider text-sumi-600" id="pomo-status-text">ROAST FOCUS TIMER</div>
              <div id="pomo-timer-display" class="font-mono font-bold text-lg text-sumi-900 leading-none mt-0.5">25:00</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button id="pomo-toggle-btn" type="button" class="craft-btn px-3 py-1.5 rounded-lg bg-sumi-900 text-washi-50 text-xs font-bold">START</button>
            <button id="pomo-reset-btn" type="button" class="px-2 py-1.5 rounded-lg border border-sumi-900/30 text-xs font-mono text-sumi-700 hover:bg-washi-200">RESET</button>
            <button id="pomo-close-btn" type="button" class="p-1 text-sumi-600 hover:text-sumi-900" aria-label="タイマーを閉じる">
              <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= [3] WIDE FREE OPENSTREETMAP STAGE + INFOGRAPHIC HUD + BOTTOM SHEET ================= -->
    <main id="map-stage" class="flex-1 h-full relative overflow-hidden bg-washi-200">

      <!-- TOP FLOATING TELEMETRY RIBBON (INFOGRAPHIC ANIMATION DOCK) -->
      <header id="map-infographic-hud" class="absolute top-3.5 left-3.5 right-3.5 z-[600] pointer-events-none flex flex-wrap items-stretch justify-between gap-2.5">

        <!-- Left Instrument: Animated Radial Gauges + Hourly Sparkbars -->
        <div class="pointer-events-auto bg-washi-50/95 backdrop-blur-md border border-sumi-900/25 rounded-2xl px-4 py-2.5 shadow-[0_6px_24px_rgba(34,27,23,0.09)] flex items-center gap-4 sm:gap-5">
          <!-- Gauge 1: Avg Wi-Fi -->
          <div class="flex items-center gap-2.5">
            <div class="relative w-11 h-11 shrink-0">
              <svg class="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="17.5" stroke="#EAE0D0" stroke-width="3.8" fill="none"/>
                <circle id="ring-wifi" cx="22" cy="22" r="17.5" stroke="#4E7255" stroke-width="3.8" stroke-linecap="round" fill="none" stroke-dasharray="109.95" stroke-dashoffset="109.95" class="infographic-arc"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-sumi-900" id="stat-avg-wifi">0</span>
            </div>
            <div>
              <div class="font-mono text-[9px] uppercase tracking-wider text-sumi-600">AVG WI-FI</div>
              <div class="text-xs font-bold text-sumi-900">平均 <span id="stat-avg-wifi-label" class="font-mono">0</span> Mbps</div>
            </div>
          </div>

          <div class="h-7 w-[1px] bg-sumi-900/12 hidden sm:block"></div>

          <!-- Gauge 2: AC Power -->
          <div class="hidden sm:flex items-center gap-2.5">
            <div class="relative w-11 h-11 shrink-0">
              <svg class="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="17.5" stroke="#EAE0D0" stroke-width="3.8" fill="none"/>
                <circle id="ring-power" cx="22" cy="22" r="17.5" stroke="#C06044" stroke-width="3.8" stroke-linecap="round" fill="none" stroke-dasharray="109.95" stroke-dashoffset="109.95" class="infographic-arc"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-sumi-900"><span id="stat-avg-power">0</span>%</span>
            </div>
            <div>
              <div class="font-mono text-[9px] uppercase tracking-wider text-sumi-600">POWER SEATS</div>
              <div class="text-xs font-bold text-sumi-900">電源席カバー率</div>
            </div>
          </div>

          <div class="h-7 w-[1px] bg-sumi-900/12 hidden md:block"></div>

          <!-- Gauge 3: Open Seats -->
          <div class="hidden md:flex items-center gap-2.5">
            <div class="relative w-11 h-11 shrink-0">
              <svg class="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="17.5" stroke="#EAE0D0" stroke-width="3.8" fill="none"/>
                <circle id="ring-seats" cx="22" cy="22" r="17.5" stroke="#B58F44" stroke-width="3.8" stroke-linecap="round" fill="none" stroke-dasharray="109.95" stroke-dashoffset="109.95" class="infographic-arc"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-sumi-900" id="stat-open-seats">0</span>
            </div>
            <div>
              <div class="font-mono text-[9px] uppercase tracking-wider text-sumi-600">OPEN SEATS</div>
              <div class="text-xs font-bold text-sumi-900">周辺空席数</div>
            </div>
          </div>

          <div class="h-7 w-[1px] bg-sumi-900/12 hidden xl:block"></div>

          <!-- Mini Hourly Comfort Infographic Spark-Bars -->
          <div class="hidden xl:flex items-center gap-2.5">
            <div>
              <div class="font-mono text-[9px] uppercase tracking-wider text-sumi-600">COMFORT CURVE</div>
              <div class="text-[11px] font-bold text-moss-500">14:00台 空席ピーク</div>
            </div>
            <div id="hud-spark-bars" class="h-9 flex items-end gap-1 pt-1"></div>
          </div>
        </div>

        <!-- Right Map Layer & Live OSM Controls -->
        <div class="pointer-events-auto flex items-center gap-2">
          <!-- Fetch Real Free OpenStreetMap Cafes via Overpass API -->
          <button id="osm-live-btn" type="button" class="craft-btn px-3 py-2 rounded-xl bg-washi-50/95 backdrop-blur-md border border-sumi-900/35 hover:border-sumi-900 text-xs font-bold text-sumi-900 flex items-center gap-1.5 shadow-sm" title="OpenStreetMapの無料Overpass APIから周辺のリアル店舗データを追加取得">
            <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 text-moss-500" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c2.2 2.2 2.2 12.8 0 15M10 2.5c-2.2 2.2-2.2 12.8 0 15"/>
            </svg>
            <span id="osm-live-label">OSM周辺カフェ重畳</span>
          </button>

          <!-- Map Paper Tone Toggle -->
          <button id="map-tone-btn" type="button" class="craft-btn px-3 py-2 rounded-xl bg-washi-50/95 backdrop-blur-md border border-sumi-900/35 hover:border-sumi-900 text-xs font-bold text-sumi-900 flex items-center gap-1.5 shadow-sm" title="和紙トーン / 標準OpenStreetMap表示切替">
            <span class="w-2.5 h-2.5 rounded-full bg-brass-400 border border-sumi-900 inline-block"></span>
            <span id="map-tone-label">和紙マップ</span>
          </button>

          <!-- 8-min Walk Ring Toggle -->
          <button id="walk-ring-btn" type="button" class="craft-btn px-2.5 py-2 rounded-xl bg-washi-50/95 backdrop-blur-md border border-sumi-900/35 hover:border-sumi-900 text-xs font-mono font-bold text-sumi-900 shadow-sm" title="徒歩8分圏（650m）サークル表示">
            650m圏
          </button>
        </div>
      </header>

      <!-- FREE OPENSTREETMAP CANVAS -->
      <div id="nomaloft-map" class="w-full h-full z-10 washi-map-filter"></div>

      <!-- Bottom-Left Subtle Map Legend & Free OSM Attribution -->
      <div class="absolute bottom-3 left-3.5 z-[500] pointer-events-auto bg-washi-50/90 backdrop-blur-sm border border-sumi-900/20 rounded-xl px-3 py-1.5 flex items-center gap-3 text-[11px] text-sumi-800 shadow-sm">
        <span class="inline-flex items-center gap-1.5 font-medium"><span class="w-2.5 h-2.5 rounded-full bg-washi-50 border-2 border-roast-500 inline-block"></span> 喫茶・焙煎所</span>
        <span class="inline-flex items-center gap-1.5 font-medium"><span class="w-2.5 h-2.5 rounded-full bg-washi-50 border-2 border-moss-500 inline-block"></span> コワーキング</span>
        <span class="text-sumi-600 font-mono text-[10px]" id="coords-readout">34.6918N, 135.5064E</span>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono text-sumi-600 underline hover:text-sumi-900">OSM Free Map</a>
      </div>

      <!-- ================= DRAGGABLE BOTTOM SHEET (Anchored over Map Stage) ================= -->
      <div id="bottom-sheet-backdrop" class="absolute inset-0 bg-sumi-900/20 backdrop-blur-[1px] z-[800] opacity-0 pointer-events-none transition-opacity duration-300"></div>

      <aside
        id="spot-bottom-sheet"
        role="dialog"
        aria-modal="false"
        aria-labelledby="bs-spot-title"
        class="absolute left-3 right-3 bottom-0 z-[900] max-w-4xl mx-auto bg-washi-50 border-t-2 border-x border-sumi-900 rounded-t-[24px] shadow-[0_-16px_48px_rgba(34,27,23,0.22)] translate-y-full transition-transform duration-300 ease-out max-h-[84%] flex flex-col"
      >
        <!-- Drag Handle Bar -->
        <div id="bs-drag-handle" class="pt-2.5 pb-2 px-5 cursor-grab active:cursor-grabbing flex items-center justify-between border-b border-sumi-900/10 shrink-0 touch-none">
          <span class="font-mono text-[10px] tracking-widest uppercase text-sumi-600" id="bs-code-label">DOSSIER · NL-01</span>
          <div class="w-12 h-1 rounded-full bg-sumi-900/25"></div>
          <div class="flex items-center gap-2">
            <button id="bs-expand-btn" type="button" class="px-2.5 py-1 rounded-md bg-washi-200/80 hover:bg-brass-300/60 text-[11px] font-bold text-sumi-800 transition-colors">拡大表示</button>
            <button id="bs-close-btn" type="button" class="w-7 h-7 rounded-full bg-washi-200/80 hover:bg-roast-500 hover:text-white flex items-center justify-center text-sumi-900 transition-colors" aria-label="詳細シートを閉じる">
              <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l8 8M12 4l-8 8" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Bottom Sheet Content Body -->
        <div id="bs-content" class="px-5 sm:px-6 py-4 overflow-y-auto flex-1 space-y-4 select-text"></div>
      </aside>

    </main>
  </div>

  <!-- Application Script -->
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
