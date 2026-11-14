import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { WORK_SPOTS, PRESET_AREAS, AUTOCOMPLETE_KEYWORDS, WorkSpot } from './data/spots'

const app = new Hono()

app.use('/api/*', cors())

// Haversine formula to calculate distance in meters
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

// Deterministic / organic live jitter when refresh=1 is requested
function enrichSpot(spot: WorkSpot, userLat: number, userLng: number, jitterSeed: number) {
  const distanceMeters = calcDistanceMeters(userLat, userLng, spot.lat, spot.lng)
  const walkMinFromHere = Math.max(1, Math.round(distanceMeters / 80))

  // Subtle realistic live variation if jitterSeed > 0
  let seatsAvailable = spot.seatsAvailable
  let crowdLevel = spot.crowdLevel
  let wifiMbps = spot.wifiMbps

  if (jitterSeed > 0) {
    const hash = (spot.id.charCodeAt(5) + jitterSeed) % 7
    const deltaSeats = (hash - 3)
    seatsAvailable = Math.max(2, Math.min(spot.totalSeats - 2, spot.seatsAvailable + deltaSeats))
    crowdLevel = Math.max(12, Math.min(88, Math.round(((spot.totalSeats - seatsAvailable) / spot.totalSeats) * 100)))
    wifiMbps = Math.max(120, spot.wifiMbps + (hash - 3) * 8)
  }

  // Nomad Score (0 - 100)
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

// GET /api/spots
app.get('/api/spots', (c) => {
  const lat = parseFloat(c.req.query('lat') || '35.6619')
  const lng = parseFloat(c.req.query('lng') || '139.6995')
  const category = c.req.query('category') || 'all'
  const filter = c.req.query('filter') || ''
  const q = (c.req.query('q') || '').trim().toLowerCase()
  const sort = c.req.query('sort') || 'distance'
  const jitter = parseInt(c.req.query('jitter') || '0', 10)

  let results = WORK_SPOTS.map((s) => enrichSpot(s, lat, lng, jitter))

  if (category !== 'all') {
    if (category === 'cafe') {
      results = results.filter((s) => s.category === 'cafe' || s.category === 'roastery' || s.category === 'library_cafe')
    } else {
      results = results.filter((s) => s.category === category)
    }
  }

  if (filter === 'power100') {
    results = results.filter((s) => s.outletRatio >= 90)
  } else if (filter === 'wifi300') {
    results = results.filter((s) => s.wifiMbps >= 300)
  } else if (filter === 'call_ok') {
    results = results.filter((s) => s.callAllowed === 'ok' || s.callAllowed === 'booth_only')
  } else if (filter === 'quiet') {
    results = results.filter((s) => s.quietness >= 85)
  } else if (filter === 'empty') {
    results = results.filter((s) => s.crowdLevel <= 40)
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

  // Summary metrics for infographic dashboard
  const avgWifi = results.length
    ? Math.round(results.reduce((acc, s) => acc + s.wifiMbps, 0) / results.length)
    : 0
  const totalOpenSeats = results.reduce((acc, s) => acc + s.seatsAvailable, 0)
  const avgPower = results.length
    ? Math.round(results.reduce((acc, s) => acc + s.outletRatio, 0) / results.length)
    : 0
  const callFriendlyCount = results.filter((s) => s.callAllowed !== 'ng').length

  return c.json({
    spots: results,
    areas: PRESET_AREAS,
    summary: {
      count: results.length,
      avgWifi,
      totalOpenSeats,
      avgPower,
      callFriendlyCount,
      updatedAt: new Date().toISOString()
    }
  })
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
      sub: `${s.area} · ${s.station}徒歩${s.walkMinutes}分 · ⚡${s.wifiMbps}Mbps`,
      query: s.name,
      spotId: s.id,
      icon: s.category === 'coworking' ? '🪑' : '☕'
    }))

  const keywordSuggestions = AUTOCOMPLETE_KEYWORDS.filter((k) => {
    if (!q) return true
    return k.label.toLowerCase().includes(q) || k.query.toLowerCase().includes(q)
  })
    .slice(0, 5)
    .map((k, idx) => ({
      id: `kw-${idx}`,
      type: k.type,
      label: k.label,
      sub: k.type === 'area' ? 'エリアにジャンプ＆絞り込み' : 'こだわり条件タグ検索',
      query: k.query,
      icon: k.icon
    }))

  return c.json({
    suggestions: [...spotSuggestions, ...keywordSuggestions].slice(0, 8)
  })
})

// POST /api/checkin (Playful check-in action)
app.post('/api/checkin', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const spotId = body.spotId || 'spot-oat-loft'
  const spot = WORK_SPOTS.find((s) => s.id === spotId) || WORK_SPOTS[0]
  return c.json({
    ok: true,
    spotName: spot.name,
    beansEarned: 15,
    message: `「${spot.name}」にチェックイン完了！焼きたてビーンズ +15粒ゲット☕✨`
  })
})

// Redirect /favicon.ico cleanly to our SVG icon
app.get('/favicon.ico', (c) => c.redirect('/static/favicon.svg', 301))

// Main HTML Entry
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>NomaLoft (ノマロフト) — 珈琲の香りと電源のある秘密基地マップ</title>
  <meta name="description" content="PCワーカーのための現在地から近いカフェ＆コワーキングスペース可視化マップ。薄いベージュの優しい世界観と遊び心あふれるノマド体験。" />
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />

  <!-- Google Fonts: Fraunces, Fredoka, Zen Maru Gothic, Space Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600&family=Fredoka:wght@500;600;700&family=Space+Mono:wght@700&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            oat: {
              50: '#FDFBF7',
              100: '#FAF5EC',
              200: '#F3E9D7',
              300: '#E8D7BC',
              400: '#D7BE98',
              500: '#C29F70',
            },
            espresso: {
              700: '#5C4435',
              800: '#423024',
              900: '#2E2018',
            },
            berry: {
              400: '#E88D72',
              500: '#D97254',
            },
            matcha: {
              400: '#8FB996',
              500: '#6D9F75',
            },
            butter: {
              300: '#F8DF8C',
              400: '#F2CA52',
            }
          },
          fontFamily: {
            display: ['"Fraunces"', '"Fredoka"', '"Zen Maru Gothic"', 'serif'],
            rounded: ['"Zen Maru Gothic"', '"Fredoka"', 'sans-serif'],
            mono: ['"Space Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css" />

  <!-- Leaflet Map CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Custom Styles -->
  <link rel="stylesheet" href="/static/styles.css" />
</head>
<body class="bg-oat-100 text-espresso-900 font-rounded antialiased selection:bg-butter-300 selection:text-espresso-900 overflow-x-hidden">

  <!-- Subtle Paper Grain & Floating Cozy Blobs -->
  <div class="paper-grain pointer-events-none fixed inset-0 z-50"></div>
  <div class="ambient-blobs pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <!-- Magnetic Kawaii Cursor Follower (Desktop) -->
  <div id="latte-cursor" class="hidden lg:flex fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-espresso-900/40 bg-butter-300/25 pointer-events-none z-[9998] items-center justify-center text-xs font-black text-espresso-900 opacity-0 transition-opacity duration-200"></div>

  <!-- Toast Notification Stack -->
  <aside id="toast-container" aria-live="polite" class="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-[9999] flex flex-col gap-2.5 pointer-events-none"></aside>

  <!-- ================= HEADER NAVIGATION ================= -->
  <header id="top-header" class="sticky top-0 z-40 backdrop-blur-md bg-oat-50/85 border-b-2 border-espresso-900/10">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
      <!-- Brand Logo + Animated Mascot Cup -->
      <a href="#hero-section" id="brand-logo" class="group flex items-center gap-2.5 focus:outline-none">
        <div class="relative w-10 h-10 rounded-2xl bg-oat-200 border-2 border-espresso-900 shadow-[0_3px_0_#2E2018] flex items-center justify-center group-hover:-rotate-6 transition-transform duration-300">
          <!-- Cute Steaming Cup SVG -->
          <svg viewBox="0 0 40 40" class="w-7 h-7">
            <path class="steam-line steam-1" d="M15 9 C14 6, 17 5, 16 2" stroke="#D97254" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path class="steam-line steam-2" d="M22 10 C21 7, 24 6, 23 3" stroke="#C29F70" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M8 15 H28 V24 C28 29.5 23.5 34 18 34 C12.5 34 8 29.5 8 24 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="2.3"/>
            <path d="M28 17 H31.5 C33.8 17 35 18.7 35 20.8 C35 22.9 33.8 24.5 31.5 24.5 H28" fill="none" stroke="#2E2018" stroke-width="2.3" stroke-linecap="round"/>
            <ellipse cx="18" cy="15.5" rx="9.5" ry="2.6" fill="#C29F70" stroke="#2E2018" stroke-width="1.8"/>
            <!-- Cute kawaii eyes -->
            <circle cx="14.5" cy="23.5" r="1.5" fill="#2E2018"/>
            <circle cx="21.5" cy="23.5" r="1.5" fill="#2E2018"/>
            <circle cx="12" cy="25" r="1.6" fill="#F4A698" opacity="0.75"/>
            <circle cx="24" cy="25" r="1.6" fill="#F4A698" opacity="0.75"/>
            <path d="M16.3 25 C17.2 26.5, 18.8 26.5, 19.7 25" stroke="#2E2018" stroke-width="1.7" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-display font-extrabold text-xl tracking-tight text-espresso-900">NomaLoft</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-butter-300 border border-espresso-900 text-espresso-900 shadow-[0_1.5px_0_#2E2018]">BETA 2.6</span>
          </div>
          <p class="text-[11px] text-espresso-700 font-medium -mt-0.5 hidden sm:block">珈琲と電源のノマド秘密基地マップ</p>
        </div>
      </a>

      <!-- Kinetic Marquee Pill (Desktop) -->
      <div class="hidden xl:flex items-center overflow-hidden max-w-md bg-oat-200/80 border border-espresso-900/15 rounded-full px-3 py-1">
        <span class="text-xs font-bold text-berry-500 mr-2 shrink-0">● LIVE</span>
        <div class="marquee-track text-xs font-medium text-espresso-800 whitespace-nowrap">
          <span>🥐 代官山 Café Beurre クロワッサン焼き上がりました（残り8個） ・ ⚡ 渋谷 Oat & Timber 窓際2口コンセント席 空きあり ・ 🎧 中目黒 Biscuit & Byte 実測680Mbps記録中！ ・ ☕ 表参道 Komorebi テラス席が心地よい22℃</span>
        </div>
      </div>

      <!-- Right Action Pills -->
      <nav class="flex items-center gap-2 sm:gap-2.5">
        <!-- BGM / Cafe Ambience Toggle -->
        <button id="ambience-btn" type="button" class="tactile-btn px-3 py-1.5 rounded-full bg-oat-50 border-2 border-espresso-900 text-xs font-bold flex items-center gap-1.5 hover:bg-butter-300 transition-colors" title="カフェ環境音シンセを再生">
          <i class="fa-solid fa-headphones text-berry-500"></i>
          <span class="hidden md:inline" id="ambience-label">Cafe音 OFF</span>
        </button>

        <!-- Saved Spots Counter -->
        <button id="saved-drawer-btn" type="button" class="tactile-btn px-3 py-1.5 rounded-full bg-oat-50 border-2 border-espresso-900 text-xs font-bold flex items-center gap-1.5 hover:bg-oat-200">
          <i class="fa-solid fa-heart text-berry-500 transition-transform duration-300" id="header-heart-icon"></i>
          <span>お気に入り</span>
          <span id="saved-count-badge" class="px-1.5 py-0.2 rounded-full bg-espresso-900 text-oat-50 font-mono text-[11px]">2</span>
        </button>

        <!-- Beans Wallet / Pomodoro -->
        <button id="pomodoro-btn" type="button" class="tactile-btn px-3 py-1.5 rounded-full bg-espresso-900 text-oat-50 border-2 border-espresso-900 text-xs font-bold flex items-center gap-1.5">
          <span>🫘</span>
          <span id="bean-points" class="font-mono">45</span>
          <span class="hidden sm:inline text-oat-200">粒</span>
        </button>
      </nav>
    </div>
  </header>

  <!-- ================= KINETIC TYPOGRAPHY HERO & SEARCH ================= -->
  <section id="hero-section" class="relative z-20 pt-5 pb-4 sm:pt-7 sm:pb-6 px-4 sm:px-6 max-w-[1440px] mx-auto">
    <div class="bg-oat-50/90 backdrop-blur-sm border-2 border-espresso-900 rounded-[28px] p-5 sm:p-7 shadow-[0_8px_0_#2E2018] relative overflow-visible">

      <!-- Floating Playful Stickers (Clickable Easter Eggs) -->
      <button id="sticker-croissant" type="button" class="hidden lg:flex items-center gap-1.5 absolute -top-4 right-28 rotate-6 bg-butter-300 border-2 border-espresso-900 px-3.5 py-1.5 rounded-2xl shadow-[0_4px_0_#2E2018] hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10" title="クリックでラテ占い！">
        <span class="text-lg">🥐</span>
        <span class="text-xs font-black text-espresso-900">今日のノマド運勢を占う！</span>
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Left: Kinetic Typography Headline -->
        <div class="lg:col-span-7 space-y-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oat-200 border border-espresso-900/20 text-xs font-bold text-espresso-800">
            <span class="inline-block w-2 h-2 rounded-full bg-matcha-500 animate-ping"></span>
            <span id="current-location-pill">現在地: 渋谷・神南エリア周辺をスキャン中</span>
          </div>

          <!-- KINETIC TYPOGRAPHY STAGE -->
          <h1 id="kinetic-headline" class="text-2xl sm:text-4xl xl:text-[42px] font-black leading-[1.22] tracking-tight text-espresso-900">
            <span class="block text-espresso-800 text-lg sm:text-2xl font-bold mb-1">PCを開けば、そこはもう</span>
            <span class="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span class="kinetic-word-box relative inline-flex items-center px-3 py-0.5 rounded-2xl bg-butter-300 border-2 border-espresso-900 shadow-[0_4px_0_#2E2018]">
                <span id="kinetic-rotating-word" class="kinetic-letters font-display font-extrabold text-espresso-900">爆速Wi-Fiの</span>
              </span>
              <span class="kinetic-wave-text">ご褒美ロフト</span>
              <span class="inline-block animate-bounce-gentle">☕✨</span>
            </span>
          </h1>

          <p class="text-xs sm:text-sm text-espresso-700 leading-relaxed max-w-2xl">
            コンセント難民も、Web会議の場所探しも今日でおしまい。現在地からすぐ行ける<strong class="text-espresso-900 underline decoration-berry-400 decoration-wavy underline-offset-4">電源・実測Wi-Fi・空席・珈琲の美味しさ</strong>をひと目でマップ検索！カードは左右スワイプでお気に入り保存できます。
          </p>

          <!-- AUTO COMPLETE SEARCH BAR + GPS BUTTON -->
          <div class="relative pt-1 max-w-2xl z-30" id="autocomplete-wrapper">
            <div class="flex flex-col sm:flex-row gap-2.5">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-espresso-700 pointer-events-none">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  id="search-input"
                  type="text"
                  autocomplete="off"
                  placeholder="駅名・カフェ名・「全席電源」「防音ブース」「クロワッサン」..."
                  aria-label="カフェ・コワーキングスペース検索"
                  aria-expanded="false"
                  aria-controls="autocomplete-dropdown"
                  class="w-full pl-11 pr-20 py-3.5 rounded-2xl bg-white border-2 border-espresso-900 text-sm font-bold text-espresso-900 placeholder:text-espresso-700/50 placeholder:font-medium shadow-[0_4px_0_#2E2018] focus:outline-none focus:ring-4 focus:ring-butter-300/70 transition-all"
                />
                <button id="clear-search-btn" type="button" class="hidden absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-oat-200 text-espresso-800 text-xs hover:bg-berry-400 hover:text-white transition-colors" aria-label="検索クリア">
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <kbd class="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono bg-oat-100 border border-espresso-900/30 rounded-md text-espresso-700">/</kbd>
              </div>

              <!-- Near Me GPS Radar Button -->
              <button id="locate-me-btn" type="button" class="tactile-btn shrink-0 px-4 py-3.5 rounded-2xl bg-berry-400 hover:bg-berry-500 text-white border-2 border-espresso-900 shadow-[0_4px_0_#2E2018] text-sm font-black flex items-center justify-center gap-2">
                <i class="fa-solid fa-location-crosshairs animate-pulse"></i>
                <span>現在地から探す</span>
              </button>
            </div>

            <!-- AUTO COMPLETE DROPDOWN PANEL -->
            <div id="autocomplete-dropdown" role="listbox" class="hidden absolute left-0 right-0 mt-2 bg-oat-50 border-2 border-espresso-900 rounded-2xl shadow-[0_10px_0_#2E2018] overflow-hidden z-50">
              <div class="px-3.5 py-2 bg-oat-200/80 border-b border-espresso-900/15 flex items-center justify-between text-[11px] font-bold text-espresso-700">
                <span><i class="fa-solid fa-wand-magic-sparkles text-berry-500 mr-1"></i>リアルタイム候補サジェスト（↑↓キーで選択 / Enterで決定）</span>
                <span id="ac-count" class="font-mono">8件</span>
              </div>
              <ul id="autocomplete-list" class="max-h-72 overflow-y-auto divide-y divide-espresso-900/10"></ul>
            </div>
          </div>
        </div>

        <!-- Right: Animated Infographic Radar Summary Card -->
        <div class="lg:col-span-5">
          <div id="hero-infographic-card" class="bg-oat-100 border-2 border-espresso-900 rounded-3xl p-4 sm:p-5 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)] relative overflow-hidden">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">📊</span>
                <div>
                  <h2 class="text-xs sm:text-sm font-black text-espresso-900">周辺ノマド環境インフォグラフィック</h2>
                  <p class="text-[11px] text-espresso-700">表示中スポットのリアルタイム集計</p>
                </div>
              </div>
              <button id="manual-refresh-btn" type="button" class="tactile-btn px-2.5 py-1 rounded-xl bg-white border-2 border-espresso-900 text-[11px] font-bold flex items-center gap-1 hover:bg-butter-300" title="空席データを最新化">
                <i class="fa-solid fa-rotate text-espresso-800" id="refresh-spin-icon"></i>
                <span>更新</span>
              </button>
            </div>

            <!-- 3 Animated SVG Circular Gauges + Counters -->
            <div class="grid grid-cols-3 gap-2.5 text-center">
              <!-- Gauge 1: Avg Wi-Fi -->
              <div class="bg-white/90 border-2 border-espresso-900/15 rounded-2xl p-2.5 flex flex-col items-center">
                <div class="relative w-16 h-16">
                  <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="#F3E9D7" stroke-width="6" fill="none" />
                    <circle id="ring-wifi" cx="32" cy="32" r="26" stroke="#6D9F75" stroke-width="6" stroke-linecap="round" fill="none" stroke-dasharray="163.36" stroke-dashoffset="163.36" class="infographic-ring" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span id="stat-avg-wifi" class="font-mono font-bold text-sm text-espresso-900">0</span>
                    <span class="text-[9px] font-bold text-espresso-700 -mt-1">Mbps</span>
                  </div>
                </div>
                <span class="text-[11px] font-black text-espresso-800 mt-1">平均Wi-Fi速度</span>
              </div>

              <!-- Gauge 2: Power Ratio -->
              <div class="bg-white/90 border-2 border-espresso-900/15 rounded-2xl p-2.5 flex flex-col items-center">
                <div class="relative w-16 h-16">
                  <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="#F3E9D7" stroke-width="6" fill="none" />
                    <circle id="ring-power" cx="32" cy="32" r="26" stroke="#E88D72" stroke-width="6" stroke-linecap="round" fill="none" stroke-dasharray="163.36" stroke-dashoffset="163.36" class="infographic-ring" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="font-mono font-bold text-sm text-espresso-900"><span id="stat-avg-power">0</span>%</span>
                  </div>
                </div>
                <span class="text-[11px] font-black text-espresso-800 mt-1">電源席カバー率</span>
              </div>

              <!-- Gauge 3: Available Seats -->
              <div class="bg-white/90 border-2 border-espresso-900/15 rounded-2xl p-2.5 flex flex-col items-center">
                <div class="relative w-16 h-16">
                  <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="#F3E9D7" stroke-width="6" fill="none" />
                    <circle id="ring-seats" cx="32" cy="32" r="26" stroke="#F2CA52" stroke-width="6" stroke-linecap="round" fill="none" stroke-dasharray="163.36" stroke-dashoffset="163.36" class="infographic-ring" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span id="stat-open-seats" class="font-mono font-bold text-sm text-espresso-900">0</span>
                    <span class="text-[9px] font-bold text-espresso-700 -mt-1">席空き</span>
                  </div>
                </div>
                <span class="text-[11px] font-black text-espresso-800 mt-1">今すぐ座れる席</span>
              </div>
            </div>

            <!-- Area Quick Jump Chips -->
            <div class="mt-3 pt-2.5 border-t border-espresso-900/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar" id="area-chips-bar">
              <span class="text-[10px] font-black text-espresso-700 shrink-0 mr-0.5">📍街ジャンプ:</span>
              <button data-area="shibuya" data-lat="35.6619" data-lng="139.6995" class="area-chip active shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border border-espresso-900 bg-espresso-900 text-oat-50 transition-all">🐕 渋谷</button>
              <button data-area="daikanyama" data-lat="35.6488" data-lng="139.7032" class="area-chip shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border border-espresso-900/30 bg-white text-espresso-800 hover:bg-butter-300 transition-all">🥐 代官山・恵比寿</button>
              <button data-area="omotesando" data-lat="35.6652" data-lng="139.7123" class="area-chip shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border border-espresso-900/30 bg-white text-espresso-800 hover:bg-butter-300 transition-all">🌿 表参道</button>
              <button data-area="nakameguro" data-lat="35.6443" data-lng="139.6982" class="area-chip shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border border-espresso-900/30 bg-white text-espresso-800 hover:bg-butter-300 transition-all">🌸 中目黒</button>
              <button data-area="shimokita" data-lat="35.6616" data-lng="139.6683" class="area-chip shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border border-espresso-900/30 bg-white text-espresso-800 hover:bg-butter-300 transition-all">🎸 下北沢</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Pills & Sort Controls -->
      <div class="mt-5 pt-4 border-t-2 border-dashed border-espresso-900/15 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0" id="filter-bar">
          <button data-cat="all" class="cat-pill active shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-espresso-900 bg-espresso-900 text-oat-50 shadow-[0_2px_0_#2E2018]">✨ すべて</button>
          <button data-cat="cafe" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-espresso-900 bg-white text-espresso-900 hover:bg-oat-200 shadow-[0_2px_0_#2E2018]">☕ カフェ・ロースタリー</button>
          <button data-cat="coworking" class="cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-espresso-900 bg-white text-espresso-900 hover:bg-oat-200 shadow-[0_2px_0_#2E2018]">🪑 コワーキング</button>

          <span class="h-5 w-[2px] bg-espresso-900/15 mx-0.5 shrink-0"></span>

          <button data-filter="power100" class="cond-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-espresso-900/25 bg-oat-100 text-espresso-800 hover:border-espresso-900 transition-all">🔌 電源90%以上</button>
          <button data-filter="wifi300" class="cond-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-espresso-900/25 bg-oat-100 text-espresso-800 hover:border-espresso-900 transition-all">⚡ 爆速300Mbps+</button>
          <button data-filter="call_ok" class="cond-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-espresso-900/25 bg-oat-100 text-espresso-800 hover:border-espresso-900 transition-all">🎧 Web会議OK</button>
          <button data-filter="quiet" class="cond-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-espresso-900/25 bg-oat-100 text-espresso-800 hover:border-espresso-900 transition-all">🤫 もくもく静寂</button>
          <button data-filter="empty" class="cond-pill shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border-2 border-espresso-900/25 bg-oat-100 text-espresso-800 hover:border-espresso-900 transition-all">🛋️ 今すぐ空いてる</button>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <label for="sort-select" class="text-xs font-bold text-espresso-700">並び順:</label>
          <select id="sort-select" class="px-3 py-1.5 rounded-xl bg-white border-2 border-espresso-900 text-xs font-black text-espresso-900 shadow-[0_2px_0_#2E2018] focus:outline-none cursor-pointer">
            <option value="distance">🚶 現在地から近い順</option>
            <option value="score">👑 ノマド快適スコア順</option>
            <option value="wifi">⚡ Wi-Fiが速い順</option>
            <option value="empty">🛋️ 空いている順</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= MAIN SPLIT WORKSPACE: LIST (Pull-to-Refresh + Swipe + Skeleton) & MAP ================= -->
  <main id="workspace-main" class="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 pb-16">
    <!-- Mobile View Mode Switcher -->
    <div class="flex lg:hidden mb-3 bg-oat-200 p-1 rounded-2xl border-2 border-espresso-900 shadow-[0_3px_0_#2E2018]">
      <button id="tab-both-btn" type="button" class="flex-1 py-2 rounded-xl text-xs font-black bg-espresso-900 text-oat-50 transition-all">🗺️ マップ＋リスト</button>
      <button id="tab-map-only-btn" type="button" class="flex-1 py-2 rounded-xl text-xs font-black text-espresso-800 transition-all">🧭 マップ拡大</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- LEFT COLUMN: PULL-TO-REFRESH + SKELETON + SWIPEABLE SPOT CARDS -->
      <section id="spot-list-section" aria-label="スポット一覧" class="lg:col-span-5 order-2 lg:order-1">
        <div class="bg-oat-50/95 border-2 border-espresso-900 rounded-[28px] shadow-[0_8px_0_#2E2018] overflow-hidden flex flex-col max-h-[760px]">

          <!-- List Header + Swipe Hint + Pull-to-Refresh Trigger Hint -->
          <div class="px-5 py-3.5 bg-oat-200/75 border-b-2 border-espresso-900/15 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">🧺</span>
              <div>
                <h2 class="text-sm font-black text-espresso-900">見つかったノマド基地 <span id="spot-count-label" class="font-mono text-berry-500">(8)</span></h2>
                <p class="text-[11px] text-espresso-700">下に引っ張って空席更新 / カード左右スワイプで操作！</p>
              </div>
            </div>
            <button id="demo-skeleton-btn" type="button" class="px-2.5 py-1 rounded-lg bg-oat-50 border border-espresso-900/30 text-[11px] font-bold text-espresso-800 hover:bg-butter-300 transition-colors" title="引っ張って更新アニメーションを実行">
              ☕ 最新スキャン
            </button>
          </div>

          <!-- PULL TO REFRESH INDICATOR -->
          <div id="ptr-indicator" class="ptr-container overflow-hidden bg-oat-100 border-b border-espresso-900/10 flex items-center justify-center gap-3 text-xs font-black text-espresso-800" style="height: 0px;">
            <div class="ptr-cup relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 36 36" class="w-8 h-8" id="ptr-svg">
                <path d="M7 13 H25 V22 C25 27 21 31 16 31 C11 31 7 27 7 22 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="2.2"/>
                <path d="M25 15 H28 C30 15 31 16.5 31 18.5 C31 20.5 30 22 28 22 H25" fill="none" stroke="#2E2018" stroke-width="2.2"/>
                <rect id="ptr-coffee-fill" x="9" y="21" width="14" height="8" rx="4" fill="#C29F70" />
              </svg>
            </div>
            <span id="ptr-text">下に引っ張ってドリップ更新...</span>
          </div>

          <!-- Swipe Tutorial Mini Banner -->
          <div class="px-4 py-2 bg-butter-300/45 border-b border-espresso-900/10 flex items-center justify-between text-[11px] font-bold text-espresso-800">
            <span>👉 右スワイプ: <strong class="text-berry-500">お気に入り保存</strong></span>
            <span>👈 左スワイプ: <strong class="text-matcha-500">チェックイン / 詳細</strong></span>
          </div>

          <!-- SCROLLABLE CONTAINER (Supports Touch & Mouse Drag Pull-to-Refresh) -->
          <div id="spot-scroll-container" class="p-4 space-y-3.5 overflow-y-auto flex-1 select-none">
            <!-- SKELETON SCREEN CONTAINER -->
            <div id="skeleton-list" class="space-y-3.5">
              <!-- Populated immediately for crisp initial skeleton experience -->
              <div class="skeleton-card rounded-3xl border-2 border-espresso-900/15 bg-white p-4 space-y-3">
                <div class="flex gap-3.5">
                  <div class="w-24 h-24 rounded-2xl shimmer-latte shrink-0"></div>
                  <div class="flex-1 space-y-2.5 py-1">
                    <div class="h-4 w-2/5 rounded-full shimmer-latte"></div>
                    <div class="h-5 w-4/5 rounded-full shimmer-latte"></div>
                    <div class="h-3.5 w-3/5 rounded-full shimmer-latte"></div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-1">
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                </div>
              </div>
              <div class="skeleton-card rounded-3xl border-2 border-espresso-900/15 bg-white p-4 space-y-3">
                <div class="flex gap-3.5">
                  <div class="w-24 h-24 rounded-2xl shimmer-latte shrink-0"></div>
                  <div class="flex-1 space-y-2.5 py-1">
                    <div class="h-4 w-1/3 rounded-full shimmer-latte"></div>
                    <div class="h-5 w-3/4 rounded-full shimmer-latte"></div>
                    <div class="h-3.5 w-2/3 rounded-full shimmer-latte"></div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-1">
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                  <div class="h-7 rounded-xl shimmer-latte"></div>
                </div>
              </div>
              <div class="skeleton-card rounded-3xl border-2 border-espresso-900/15 bg-white p-4 space-y-3">
                <div class="flex gap-3.5">
                  <div class="w-24 h-24 rounded-2xl shimmer-latte shrink-0"></div>
                  <div class="flex-1 space-y-2.5 py-1">
                    <div class="h-4 w-1/2 rounded-full shimmer-latte"></div>
                    <div class="h-5 w-5/6 rounded-full shimmer-latte"></div>
                    <div class="h-3.5 w-1/2 rounded-full shimmer-latte"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTUAL SPOT CARDS LIST -->
            <div id="spots-cards-list" class="space-y-3.5 hidden"></div>
          </div>
        </div>
      </section>

      <!-- RIGHT COLUMN: INTERACTIVE CAFE-TONED MAP -->
      <section id="map-section" aria-label="インタラクティブマップ" class="lg:col-span-7 order-1 lg:order-2">
        <div class="bg-oat-50 border-2 border-espresso-900 rounded-[28px] p-2.5 sm:p-3 shadow-[0_8px_0_#2E2018] relative">
          <!-- Map Floating Top Controls -->
          <div class="absolute top-5 left-5 right-5 z-[500] pointer-events-none flex flex-wrap items-center justify-between gap-2">
            <div class="pointer-events-auto bg-oat-50/95 backdrop-blur-md border-2 border-espresso-900 rounded-2xl px-3.5 py-2 shadow-[0_4px_0_#2E2018] flex items-center gap-2.5">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-berry-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-berry-500"></span>
              </span>
              <span class="text-xs font-black text-espresso-900" id="map-radar-status">徒歩圏内の電源カフェを表示中</span>
            </div>

            <div class="pointer-events-auto flex items-center gap-2">
              <button id="toggle-radar-circle-btn" type="button" class="tactile-btn px-3 py-2 rounded-2xl bg-oat-50/95 border-2 border-espresso-900 text-xs font-black text-espresso-900 shadow-[0_4px_0_#2E2018] hover:bg-butter-300">
                ⭕ 徒歩8分圏リング
              </button>
              <button id="recenter-map-btn" type="button" class="tactile-btn w-9 h-9 rounded-2xl bg-oat-50/95 border-2 border-espresso-900 text-xs font-black text-espresso-900 shadow-[0_4px_0_#2E2018] flex items-center justify-center hover:bg-butter-300" title="現在地へ戻る">
                <i class="fa-solid fa-compass text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Leaflet Canvas -->
          <div id="nomaloft-map" class="w-full h-[430px] sm:h-[560px] lg:h-[695px] rounded-[20px] overflow-hidden z-10 border border-espresso-900/20"></div>

          <!-- Map Legend Bottom Bar -->
          <div class="mt-2.5 px-2 py-1 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-espresso-800">
            <div class="flex flex-wrap items-center gap-3">
              <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-butter-400 border border-espresso-900 inline-block"></span> カフェ・ロースタリー</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-matcha-400 border border-espresso-900 inline-block"></span> コワーキング</span>
              <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-berry-400 border border-espresso-900 inline-block"></span> あなたの現在地</span>
            </div>
            <span class="text-[11px] text-espresso-700">ピンをタップするとボトムシートで混雑インフォグラフィックが開きます✨</span>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- ================= PLAYFUL INFOGRAPHIC FEATURE SECTION ================= -->
  <section id="nomad-insights-section" class="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 pb-20">
    <div class="bg-oat-200/80 border-2 border-espresso-900 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_0_#2E2018]">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-full bg-oat-50 border border-espresso-900 text-xs font-black mb-2">📈 LIVE NOMAD TELEMETRY</span>
          <h2 class="text-xl sm:text-2xl font-black text-espresso-900">今日のノマド快適トレンド図鑑</h2>
          <p class="text-xs sm:text-sm text-espresso-700 mt-0.5">PCワーカーみんなのチェックインから算出したリアルタイム傾向アニメーション</p>
        </div>
        <button id="replay-infographic-btn" type="button" class="tactile-btn self-start md:self-auto px-4 py-2 rounded-2xl bg-oat-50 border-2 border-espresso-900 text-xs font-black shadow-[0_3px_0_#2E2018] hover:bg-butter-300">
          <i class="fa-solid fa-play mr-1 text-berry-500"></i> グラフをもう一度アニメーション再生
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Infographic Card 1: Golden Hours Timeline -->
        <article class="bg-oat-50 border-2 border-espresso-900 rounded-3xl p-5 shadow-[0_4px_0_#2E2018]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-black text-espresso-900">⏰ 狙い目の空席ゴールデンタイム</h3>
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-matcha-400/30 text-espresso-900">14:00 - 15:30</span>
          </div>
          <div id="global-hourly-bars" class="h-32 flex items-end justify-between gap-2 pt-4 px-1">
            <!-- Populated dynamically with animated bars -->
          </div>
          <p class="text-xs text-espresso-700 mt-3 leading-relaxed">ランチ後の14時台はカフェ勢が入れ替わる穴場タイム！窓際のコンセント席確保率が<strong>78%</strong>にアップします。</p>
        </article>

        <!-- Infographic Card 2: Work Style Breakdown -->
        <article class="bg-oat-50 border-2 border-espresso-900 rounded-3xl p-5 shadow-[0_4px_0_#2E2018]">
          <h3 class="text-sm font-black text-espresso-900 mb-3">🎧 今の周辺ワーカーの過ごし方比率</h3>
          <div class="space-y-3" id="worker-mode-bars">
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>💻 もくもくコーディング・執筆</span>
                <span class="font-mono">48%</span>
              </div>
              <div class="h-3 rounded-full bg-oat-200 overflow-hidden border border-espresso-900/20">
                <div class="info-progress-bar h-full bg-espresso-800 rounded-full" data-target="48%" style="width: 0%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>🎨 デザイン・iPadイラスト制作</span>
                <span class="font-mono">31%</span>
              </div>
              <div class="h-3 rounded-full bg-oat-200 overflow-hidden border border-espresso-900/20">
                <div class="info-progress-bar h-full bg-berry-400 rounded-full" data-target="31%" style="width: 0%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>🗣️ オンラインMTG・ブレスト</span>
                <span class="font-mono">21%</span>
              </div>
              <div class="h-3 rounded-full bg-oat-200 overflow-hidden border border-espresso-900/20">
                <div class="info-progress-bar h-full bg-matcha-500 rounded-full" data-target="21%" style="width: 0%"></div>
              </div>
            </div>
          </div>
          <p class="text-xs text-espresso-700 mt-3.5">急なZoomが入った時は「🎧 Web会議OK」フィルターをONにすると防音ブース付き店舗が即座に見つかります。</p>
        </article>

        <!-- Infographic Card 3: Interactive Coffee Pomodoro Mini Widget -->
        <article class="bg-oat-50 border-2 border-espresso-900 rounded-3xl p-5 shadow-[0_4px_0_#2E2018] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-black text-espresso-900">⏳ 珈琲ポモドーロ集中タイマー</h3>
              <span class="text-[11px] font-bold text-berry-500">遊び心ギミック</span>
            </div>
            <p class="text-xs text-espresso-700">お気に入りの席についたら25分集中スタート！完了するとビーンズが貯まります。</p>
          </div>
          <div class="my-3 py-3 px-4 rounded-2xl bg-oat-100 border-2 border-espresso-900/15 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl" id="pomo-cup-emoji">☕</span>
              <div>
                <div id="pomo-timer-display" class="font-mono font-bold text-2xl text-espresso-900">25:00</div>
                <div id="pomo-status-text" class="text-[11px] font-bold text-espresso-700">スタンバイ中・深呼吸しよう</div>
              </div>
            </div>
            <div class="flex gap-1.5">
              <button id="pomo-toggle-btn" type="button" class="tactile-btn px-3.5 py-2 rounded-xl bg-butter-300 border-2 border-espresso-900 text-xs font-black">開始</button>
              <button id="pomo-reset-btn" type="button" class="tactile-btn px-2.5 py-2 rounded-xl bg-white border-2 border-espresso-900 text-xs font-bold" aria-label="タイマーリセット"><i class="fa-solid fa-rotate-left"></i></button>
            </div>
          </div>
          <div class="text-[11px] font-bold text-espresso-700 flex items-center justify-between">
            <span>獲得ご褒美スタンプ:</span>
            <span id="pomo-stamps">☕ ☕ 🥐 ✨</span>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ================= DRAGGABLE BOTTOM SHEET (Spot Detail + Animated Infographic) ================= -->
  <div id="bottom-sheet-backdrop" class="fixed inset-0 bg-espresso-900/35 backdrop-blur-[2px] z-[1200] opacity-0 pointer-events-none transition-opacity duration-300"></div>

  <aside
    id="spot-bottom-sheet"
    role="dialog"
    aria-modal="true"
    aria-labelledby="bs-spot-title"
    class="fixed left-0 right-0 bottom-0 z-[1300] max-w-3xl mx-auto bg-oat-50 border-t-4 border-x-2 border-espresso-900 rounded-t-[32px] shadow-[0_-12px_40px_rgba(46,32,24,0.22)] translate-y-full transition-transform duration-300 ease-out max-h-[88vh] flex flex-col"
  >
    <!-- Drag Handle Bar -->
    <div id="bs-drag-handle" class="pt-3 pb-2 px-6 cursor-grab active:cursor-grabbing flex flex-col items-center shrink-0 touch-none">
      <div class="w-14 h-1.5 rounded-full bg-espresso-900/25 mb-1.5"></div>
      <div class="w-full flex items-center justify-between">
        <span class="text-[11px] font-bold text-espresso-700" id="bs-sheet-hint">↕ ドラッグでサイズ切替・下スワイプで閉じる</span>
        <div class="flex items-center gap-2">
          <button id="bs-expand-btn" type="button" class="px-2.5 py-1 rounded-full bg-oat-200 text-[11px] font-black text-espresso-800 hover:bg-butter-300">全画面でじっくり見る</button>
          <button id="bs-close-btn" type="button" class="w-8 h-8 rounded-full bg-oat-200 border border-espresso-900/30 flex items-center justify-center text-espresso-900 hover:bg-berry-400 hover:text-white transition-colors" aria-label="シートを閉じる">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Sheet Scrollable Body -->
    <div id="bs-content" class="px-5 sm:px-7 pb-8 overflow-y-auto flex-1 space-y-5">
      <!-- Dynamically populated when a spot or map pin is selected -->
    </div>
  </aside>

  <!-- ================= FOOTER ================= -->
  <footer class="relative z-10 border-t-2 border-espresso-900/10 bg-oat-200/60 py-8 px-4 sm:px-6">
    <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-espresso-700 font-medium">
      <div class="flex items-center gap-2">
        <span class="text-lg">☕</span>
        <strong class="text-espresso-900 font-display text-sm">NomaLoft</strong>
        <span>— Crafted with warm oat milk & playful micro-interactions for PC Nomads.</span>
      </div>
      <div class="flex items-center gap-4">
        <span>ショートカット: <kbd class="px-1.5 py-0.5 bg-oat-50 border border-espresso-900/30 rounded font-mono">/</kbd> 検索</span>
        <span>Map © OpenStreetMap & CARTO</span>
      </div>
    </div>
  </footer>

  <!-- App Logic -->
  <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
