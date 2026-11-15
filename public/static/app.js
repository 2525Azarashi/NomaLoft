/* =========================================================================
   NomaLoft — Kansai Cafe & Coworking Power / Wi-Fi / Official SNS Explorer
   Full-Bleed Free OpenStreetMap · Zero Default Emojis · High-Craft UI/UX
   ========================================================================= */

(function () {
  'use strict';

  // --- Clean Inline SVG Icons (Zero Default Emojis) ---
  const ICONS = {
    plug: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 2.5v3.2M11.5 2.5v3.2M4.5 5.7h9v2.8a4.5 4.5 0 0 1-9 0V5.7zM9 13v2.8"/></svg>`,
    wifi: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 6.8a10.5 10.5 0 0 1 13.6 0M5 9.8a6.5 6.5 0 0 1 8 0M8.8 13h.4"/></svg>`,
    off: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="4" x2="14" y2="14"/><circle cx="9" cy="9" r="6.5"/></svg>`,
    globe: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="9" r="6.8"/><path d="M2.4 9h13.2M9 2.2c2 2.1 2 11.5 0 13.6M9 2.2c-2 2.1-2 11.5 0 13.6"/></svg>`,
    insta: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="13" height="13" rx="3.8"/><circle cx="9" cy="9" r="3"/><circle cx="12.8" cy="5.2" r="0.7" fill="currentColor"/></svg>`,
    xLogo: `<svg viewBox="0 0 18 18" class="w-3 h-3 shrink-0" fill="currentColor"><path d="M13.8 2.5h2.3l-5 5.7 5.9 7.3h-4.6l-3.6-4.7-4.1 4.7H2.4l5.4-6.1L2.1 2.5h4.7l3.2 4.3 3.8-4.3zm-.8 11.7h1.3L6 3.8H4.6l8.4 10.4z"/></svg>`,
    route: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="3,9 15,3 9,15 8,10 3,9"/></svg>`,
    bookmark: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4.5 3h9a1 1 0 0 1 1 1v11.5L9 12.4l-5.5 3.1V4a1 1 0 0 1 1-1z"/></svg>`,
    bookmarkFill: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="currentColor"><path d="M4.5 3h9a1 1 0 0 1 1 1v11.5L9 12.4l-5.5 3.1V4a1 1 0 0 1 1-1z"/></svg>`,
    ext: `<svg viewBox="0 0 14 14" class="w-2.5 h-2.5 shrink-0 opacity-70" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3H11v5.5M11 3L4.5 9.5"/></svg>`,
    bean: `<svg viewBox="0 0 14 14" fill="none"><ellipse cx="7" cy="7" rx="4" ry="5.5" transform="rotate(-28 7 7)" fill="#CA6B3E" stroke="#211813" stroke-width="1.2"/><path d="M5.2 3c1.3 2.2.7 5.5 3.6 8" stroke="#FFFDFA" stroke-width="1" stroke-linecap="round"/></svg>`,
    spark: `<svg viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5Z" fill="#F2D283" stroke="#211813" stroke-width="1"/></svg>`
  };

  // --- Application State ---
  const state = {
    lat: 34.6922,
    lng: 135.5045,
    region: 'all',
    category: 'all',
    powerOnly: false,
    wifiOnly: false,
    savedOnly: false,
    query: '',
    sort: 'distance',
    verifiedSpots: [],
    osmSpots: [], // Dynamically fetched real Kansai street cafes from OpenStreetMap Overpass
    osmLoadedCenters: [],
    selectedId: null,
    savedIds: new Set(['kth-brooklyn-kitahama', 'umd-onthe-umeda', 'kyt-fabcafe-kyoto']),
    cafeMapTone: true,
    acItems: [],
    acIndex: -1,
    sheetFull: false,
    mobileListHidden: false
  };

  const REGION_PRESETS = {
    all: { lat: 34.702, lng: 135.502, zoom: 12 },
    umeda: { lat: 34.7042, lng: 135.4992, zoom: 15 },
    kitahama: { lat: 34.6898, lng: 135.5038, zoom: 15 },
    shinsaibashi: { lat: 34.6708, lng: 135.4992, zoom: 15 },
    tennoji: { lat: 34.6476, lng: 135.5145, zoom: 15 },
    kyoto: { lat: 35.0048, lng: 135.7635, zoom: 14 },
    kobe: { lat: 34.6902, lng: 135.1915, zoom: 15 },
    hanshin: { lat: 34.7415, lng: 135.3485, zoom: 13 },
    nara: { lat: 34.6838, lng: 135.8185, zoom: 14 }
  };

  // --- Map Instances ---
  let map = null;
  let originMarker = null;
  let pinsLayer = null;

  // --- DOM References ---
  const dom = {
    mapEl: document.getElementById('nomaloft-map'),
    explorerIsland: document.getElementById('explorer-island'),
    kineticWord: document.getElementById('kinetic-word'),
    mascotEyes: document.getElementById('mascot-eyes'),
    totalSpotsPill: document.getElementById('total-spots-pill'),
    listResultCount: document.getElementById('list-result-count'),
    hudPowerPct: document.getElementById('hud-power-pct'),
    hudWifiPct: document.getElementById('hud-wifi-pct'),
    hudRingPower: document.getElementById('hud-ring-power'),
    hudRingWifi: document.getElementById('hud-ring-wifi'),
    searchInput: document.getElementById('search-input'),
    clearQBtn: document.getElementById('clear-q-btn'),
    acPanel: document.getElementById('ac-panel'),
    acList: document.getElementById('ac-list'),
    togglePowerBtn: document.getElementById('toggle-power-btn'),
    toggleWifiBtn: document.getElementById('toggle-wifi-btn'),
    savedOnlyBtn: document.getElementById('saved-only-btn'),
    savedCount: document.getElementById('saved-count'),
    sortSelect: document.getElementById('sort-select'),
    ptrBar: document.getElementById('ptr-bar'),
    ptrLabel: document.getElementById('ptr-label'),
    cardsScroller: document.getElementById('cards-scroller'),
    skeletonWrap: document.getElementById('skeleton-wrap'),
    cardsList: document.getElementById('cards-list'),
    bottomSheet: document.getElementById('spot-bottom-sheet'),
    bsHandle: document.getElementById('bs-handle'),
    bsAreaTag: document.getElementById('bs-area-tag'),
    bsSizeBtn: document.getElementById('bs-size-btn'),
    bsCloseBtn: document.getElementById('bs-close-btn'),
    bsBody: document.getElementById('bs-body'),
    toastStack: document.getElementById('toast-stack'),
    osmExpandBtn: document.getElementById('osm-expand-btn'),
    osmBtnLabel: document.getElementById('osm-btn-label')
  };

  // --- Utility: Haversine Distance ---
  function calcMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const rad = (d) => (d * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLng = rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function formatDist(m) {
    return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
  }

  // =========================================================================
  // 1. KINETIC TYPOGRAPHY + EYE-TRACKING CUP MICRO-INTERACTION
  // =========================================================================
  const kineticWords = ['コンセント有無', '無料Wi-Fi有無', '公式サイト・SNS', '全席電源デスク'];
  let kIdx = 0;

  function renderKineticWord(text) {
    if (!dom.kineticWord) return;
    dom.kineticWord.innerHTML = '';
    Array.from(text).forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'k-letter';
      span.style.animationDelay = `${i * 28}ms`;
      span.textContent = ch;
      dom.kineticWord.appendChild(span);
    });
  }

  function initKineticAndMascot() {
    renderKineticWord(kineticWords[0]);
    setInterval(() => {
      if (!dom.kineticWord) return;
      dom.kineticWord.querySelectorAll('.k-letter').forEach((el, i) => {
        el.style.animationDelay = `${i * 14}ms`;
        el.classList.add('k-out');
      });
      setTimeout(() => {
        kIdx = (kIdx + 1) % kineticWords.length;
        renderKineticWord(kineticWords[kIdx]);
      }, 190);
    }, 3400);

    // Subtle Eye-Tracking Mascot Pupils
    window.addEventListener('mousemove', (e) => {
      if (!dom.mascotEyes) return;
      const rect = dom.mascotEyes.getBoundingClientRect();
      const dx = Math.max(-2.2, Math.min(2.2, (e.clientX - rect.left) / 140));
      const dy = Math.max(-1.8, Math.min(1.8, (e.clientY - rect.top) / 140));
      dom.mascotEyes.setAttribute('transform', `translate(${dx.toFixed(2)}, ${dy.toFixed(2)})`);
    });

    document.getElementById('mascot-cup-btn')?.addEventListener('click', (e) => {
      burstParticles(e.clientX, e.clientY);
      showToast({
        title: `現在 ${getAllCombinedSpots().length}軒の関西カフェ・コワーキングを収録中`,
        sub: '右上の「+ 周辺の街カフェも読込」でさらに実在店を追加できます'
      });
    });
  }

  // =========================================================================
  // 2. TOAST NOTIFICATION + VECTOR SPARKLE BURST
  // =========================================================================
  function showToast({ title, sub = '', undoLabel = '', onUndo = null, duration = 3200 }) {
    if (!dom.toastStack) return;
    const item = document.createElement('div');
    item.className =
      'toast-pill glass-island-solid rounded-2xl px-4 py-2.5 flex items-center gap-3 text-xs shadow-xl relative overflow-hidden';

    item.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-caramel-500 shrink-0"></span>
      <div class="min-w-0 flex-1">
        <div class="font-bold text-moka-900 truncate">${title}</div>
        ${sub ? `<div class="text-[11px] text-moka-500 truncate">${sub}</div>` : ''}
      </div>
      ${
        undoLabel
          ? `<button type="button" class="toast-undo shrink-0 px-2.5 py-1 rounded-lg bg-moka-900 text-cream-50 text-[10px] font-bold hover:bg-caramel-500 transition-colors">${undoLabel}</button>`
          : ''
      }
      <div class="toast-bar absolute bottom-0 left-0 h-[2px] bg-caramel-500/60 transition-all ease-linear" style="width:100%; transition-duration:${duration}ms"></div>
    `;

    dom.toastStack.appendChild(item);
    requestAnimationFrame(() => {
      const b = item.querySelector('.toast-bar');
      if (b) b.style.width = '0%';
    });

    const dismiss = () => {
      if (!item.isConnected) return;
      item.classList.add('leaving');
      setTimeout(() => item.remove(), 200);
    };

    const t = setTimeout(dismiss, duration);
    if (undoLabel && typeof onUndo === 'function') {
      item.querySelector('.toast-undo')?.addEventListener('click', () => {
        clearTimeout(t);
        onUndo();
        dismiss();
      });
    }
  }

  function burstParticles(x, y) {
    for (let i = 0; i < 7; i++) {
      const p = document.createElement('div');
      p.className = 'v-spark';
      p.innerHTML = i % 2 === 0 ? ICONS.bean : ICONS.spark;
      const ang = (Math.PI * 2 * i) / 7;
      const r = 28 + Math.random() * 34;
      p.style.left = `${x - 6}px`;
      p.style.top = `${y - 6}px`;
      p.style.setProperty('--tx', `${Math.cos(ang) * r}px`);
      p.style.setProperty('--ty', `${Math.sin(ang) * r - 12}px`);
      p.style.setProperty('--tr', `${(Math.random() - 0.5) * 90}deg`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 820);
    }
  }

  // =========================================================================
  // 3. INFOGRAPHIC RINGS & COUNTERS
  // =========================================================================
  function animateInt(el, target, ms = 600) {
    if (!el) return;
    const from = parseInt(el.textContent || '0', 10) || 0;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / ms);
      const ease = 1 - (1 - p) ** 3;
      el.textContent = String(Math.round(from + (target - from) * ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setSmallRing(circleEl, pct) {
    if (!circleEl) return;
    const c = 2 * Math.PI * 12; // ~75.4
    circleEl.style.strokeDashoffset = String(c * (1 - Math.max(0, Math.min(100, pct)) / 100));
  }

  function refreshTopInfographic(filteredList) {
    const total = filteredList.length;
    const pCount = filteredList.filter((s) => s.power === 'yes_all' || s.power === 'yes_part').length;
    const wCount = filteredList.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg').length;
    const pPct = total ? Math.round((pCount / total) * 100) : 0;
    const wPct = total ? Math.round((wCount / total) * 100) : 0;

    animateInt(dom.hudPowerPct, pPct);
    animateInt(dom.hudWifiPct, wPct);
    setSmallRing(dom.hudRingPower, pPct);
    setSmallRing(dom.hudRingWifi, wPct);

    const allTotal = getAllCombinedSpots().length;
    if (dom.totalSpotsPill) dom.totalSpotsPill.textContent = `${allTotal}軒`;
    if (dom.listResultCount) dom.listResultCount.textContent = String(total);
  }

  // =========================================================================
  // 4. FREE OPENSTREETMAP + LIVE OVERPASS STREET-CAFE ENGINE
  // =========================================================================
  function initMap() {
    if (typeof L === 'undefined') return;
    map = L.map('nomaloft-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([state.lat, state.lng], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 100% Free Official OpenStreetMap Standard Tile Layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true
    }).addTo(map);

    pinsLayer = L.layerGroup().addTo(map);
    drawOriginMarker();
  }

  function drawOriginMarker() {
    if (!map) return;
    if (originMarker) map.removeLayer(originMarker);
    const icon = L.divIcon({
      className: 'origin-marker',
      html: `<div class="origin-dot-wrap" title="基準地点"><div class="origin-pulse"></div><div class="origin-core"></div></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    originMarker = L.marker([state.lat, state.lng], { icon, zIndexOffset: 900 }).addTo(map);
  }

  // Fetch real Kansai cafes & coworking spaces from OpenStreetMap Overpass API directly in browser
  async function loadOsmCafesAround(lat, lng, radiusMeters = 1800, silent = false) {
    // Avoid re-fetching very close center
    const already = state.osmLoadedCenters.some((c) => calcMeters(c.lat, c.lng, lat, lng) < 700);
    if (already && silent) return;

    if (dom.osmBtnLabel) dom.osmBtnLabel.textContent = '周辺カフェ取得中...';

    const query = `[out:json][timeout:8];(node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});node["amenity"="coworking_space"](around:${radiusMeters},${lat},${lng}););out body 75;`;

    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });
      if (!res.ok) throw new Error('overpass_busy');
      const json = await res.json();

      const existingIds = new Set(state.osmSpots.map((s) => s.id));
      const verifiedCoords = state.verifiedSpots.map((s) => ({ lat: s.lat, lng: s.lng }));

      let added = 0;
      (json.elements || []).forEach((el) => {
        const tags = el.tags || {};
        const rawName = tags['name:ja'] || tags.name;
        if (!rawName) return;

        // Skip if within 45m of an already verified spot to prevent duplicate pin overlap
        const nearVerified = verifiedCoords.some((v) => calcMeters(v.lat, v.lng, el.lat, el.lon) < 45);
        if (nearVerified) return;

        const id = `osm-${el.id}`;
        if (existingIds.has(id)) return;

        // Parse OSM power / wifi / official / SNS tags
        const hasSocket =
          tags.socket === 'yes' ||
          tags['socket:type_a'] ||
          tags['socket:usb'] ||
          tags.power_supply === 'yes';
        const noSocket = tags.socket === 'no';
        const power = hasSocket ? 'yes_part' : noSocket ? 'no' : 'unknown';
        const powerDetail = hasSocket
          ? 'あり（OpenStreetMap登録情報）'
          : noSocket
          ? 'なし（OSM情報）'
          : '情報未登録（公式サイト・SNSで要確認）';

        const wlan =
          tags.internet_access === 'wlan' ||
          tags.internet_access === 'yes' ||
          tags.wifi === 'yes' ||
          tags.wifi === 'free';
        const noWlan = tags.internet_access === 'no' || tags.wifi === 'no';
        const wifi = wlan ? 'yes_free' : noWlan ? 'no' : 'unknown';
        const wifiDetail = wlan
          ? 'あり（OpenStreetMap Wi-Fi登録済）'
          : noWlan
          ? 'なし（OSM情報）'
          : '情報未登録（公式サイト・SNSで要確認）';

        const website = tags.website || tags['contact:website'] || '';
        const igRaw = tags['contact:instagram'] || tags.instagram || '';
        const igUrl = igRaw
          ? igRaw.startsWith('http')
            ? igRaw
            : `https://www.instagram.com/${igRaw.replace(/^@/, '')}/`
          : `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(rawName)}`;

        const xRaw = tags['contact:twitter'] || tags.twitter || '';
        const xUrl = xRaw
          ? xRaw.startsWith('http')
            ? xRaw
            : `https://x.com/${xRaw.replace(/^@/, '')}`
          : `https://x.com/search?q=${encodeURIComponent(rawName + ' カフェ')}`;

        const officialUrl =
          website || `https://www.google.com/search?q=${encodeURIComponent(rawName + ' 公式 カフェ')}`;

        state.osmSpots.push({
          id,
          name: rawName,
          areaId: state.region === 'all' ? 'kitahama' : state.region,
          areaLabel: tags['addr:ward'] || tags['addr:city'] || '関西エリア（OSM実在店舗）',
          station: tags['addr:suburb'] || 'マップ座標登録スポット',
          walkMin: 5,
          lat: el.lat,
          lng: el.lon,
          category: tags.amenity === 'coworking_space' ? 'coworking' : 'cafe',
          categoryLabel: tags.amenity === 'coworking_space' ? 'コワーキング（OSM）' : '街カフェ（OSM）',
          power,
          powerDetail,
          wifi,
          wifiDetail,
          wifiSpeedEst: wlan ? 150 : 90,
          quietScore: 78,
          deskScore: 78,
          openHours: tags.opening_hours || '公式・SNSにて確認',
          priceHint: tags.brand ? `${tags.brand}` : '実在カフェ',
          officialUrl,
          instagramUrl: igUrl,
          instagramHandle: igRaw ? `@${igRaw.replace(/^@/, '')}` : 'Instagram検索',
          xUrl,
          note: website
            ? 'OpenStreetMapに登録されている実在店舗です。公式サイト・SNSから最新情報を確認できます。'
            : 'OpenStreetMapに登録されている実在カフェです。ボタンから公式情報・SNS投稿を検索できます。',
          source: 'osm'
        });
        existingIds.add(id);
        added += 1;
      });

      state.osmLoadedCenters.push({ lat, lng });
      if (dom.osmBtnLabel) dom.osmBtnLabel.textContent = `+ 街カフェ追加 (${state.osmSpots.length}軒読込済)`;

      applyClientFiltersAndRender();

      if (!silent) {
        showToast({
          title:
            added > 0
              ? `周辺の街カフェ ${added}軒を追加しました（合計 ${getAllCombinedSpots().length}軒）`
              : 'この周辺の実在カフェはすべて表示済みです',
          sub: '地図を動かして再度押すと別エリアも読み込めます'
        });
      }
    } catch (_) {
      if (dom.osmBtnLabel) dom.osmBtnLabel.textContent = '+ 周辺の街カフェも読込';
      if (!silent) {
        showToast({ title: 'OpenStreetMapが一時混雑しています。少し待ってお試しください' });
      }
    }
  }

  // =========================================================================
  // 5. UNIFIED FILTERING, SORTING, SKELETON & RENDERING
  // =========================================================================
  function getAllCombinedSpots() {
    const merged = [...state.verifiedSpots, ...state.osmSpots];
    return merged.map((s) => {
      const distanceMeters = calcMeters(state.lat, state.lng, s.lat, s.lng);
      const pScore = s.power === 'yes_all' ? 100 : s.power === 'yes_part' ? 80 : s.power === 'unknown' ? 45 : 20;
      const wScore = s.wifi === 'yes_free' ? 95 : s.wifi === 'yes_reg' ? 75 : s.wifi === 'unknown' ? 45 : 15;
      const workIndex = Math.round(pScore * 0.32 + wScore * 0.32 + (s.deskScore || 80) * 0.2 + (s.quietScore || 80) * 0.16);
      return {
        ...s,
        distanceMeters,
        workIndex
      };
    });
  }

  function getFilteredSpots() {
    let list = getAllCombinedSpots();

    if (state.savedOnly) {
      list = list.filter((s) => state.savedIds.has(s.id));
    } else if (state.region !== 'all') {
      const preset = REGION_PRESETS[state.region];
      list = list.filter((s) => {
        if (s.areaId === state.region) return true;
        if (s.source === 'osm' && preset) {
          return calcMeters(preset.lat, preset.lng, s.lat, s.lng) <= 5500;
        }
        return false;
      });
    }

    if (state.category === 'coworking') {
      list = list.filter((s) => s.category === 'coworking');
    } else if (state.category === 'cafe') {
      list = list.filter((s) => s.category !== 'coworking');
    }

    if (state.powerOnly) {
      list = list.filter((s) => s.power === 'yes_all' || s.power === 'yes_part');
    }

    if (state.wifiOnly) {
      list = list.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg');
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((s) =>
        `${s.name} ${s.areaLabel} ${s.station} ${s.categoryLabel} ${s.powerDetail} ${s.wifiDetail} ${s.note}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (state.sort === 'distance') {
      list.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else if (state.sort === 'score') {
      list.sort((a, b) => b.workIndex - a.workIndex);
    } else if (state.sort === 'speed') {
      list.sort((a, b) => (b.wifiSpeedEst || 0) - (a.wifiSpeedEst || 0));
    }

    return list;
  }

  function showSkeleton(on) {
    dom.skeletonWrap?.classList.toggle('hidden', !on);
    dom.cardsList?.classList.toggle('hidden', on);
  }

  async function initialFetchSpots() {
    showSkeleton(true);
    try {
      const res = await fetch(`/api/spots?lat=${state.lat}&lng=${state.lng}`);
      const data = await res.json();
      state.verifiedSpots = data.spots || [];
      await new Promise((r) => setTimeout(r, 320));
      applyClientFiltersAndRender();
      showSkeleton(false);

      // Automatically enrich Osaka Kitahama/Umeda surroundings silently from free OSM Overpass!
      loadOsmCafesAround(state.lat, state.lng, 1600, true);
    } catch (_) {
      showSkeleton(false);
    }
  }

  function applyClientFiltersAndRender() {
    const filtered = getFilteredSpots();
    refreshTopInfographic(filtered);
    renderCards(filtered);
    renderMapMarkers(filtered);
  }

  // Helper badges for Power & Wi-Fi (Crystal clear at a glance!)
  function powerBadgeHTML(spot) {
    if (spot.power === 'yes_all') {
      return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF1E8] text-[#B55428] border border-[#E2875A]/35 text-[11px] font-extrabold">${ICONS.plug}<span>コンセント: 全席あり</span></span>`;
    }
    if (spot.power === 'yes_part') {
      return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF6EE] text-[#CA6B3E] border border-[#E2875A]/25 text-[11px] font-bold">${ICONS.plug}<span>コンセント: あり</span></span>`;
    }
    if (spot.power === 'no') {
      return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-200/70 text-moka-500 text-[11px] font-medium">${ICONS.off}<span>コンセント: なし</span></span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-200/50 text-moka-500 text-[11px] font-medium">${ICONS.plug}<span>電源: 要確認</span></span>`;
  }

  function wifiBadgeHTML(spot) {
    if (spot.wifi === 'yes_free' || spot.wifi === 'yes_reg') {
      return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EEF7F0] text-[#366341] border border-[#6FA07A]/35 text-[11px] font-extrabold">${ICONS.wifi}<span>Wi-Fi: あり</span></span>`;
    }
    if (spot.wifi === 'no') {
      return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-200/70 text-moka-500 text-[11px] font-medium">${ICONS.off}<span>Wi-Fi: なし</span></span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cream-200/50 text-moka-500 text-[11px] font-medium">${ICONS.wifi}<span>Wi-Fi: 要確認</span></span>`;
  }

  function renderCards(list) {
    if (!dom.cardsList) return;

    if (list.length === 0) {
      dom.cardsList.innerHTML = `
        <div class="rounded-2xl bg-cream-50/90 p-6 text-center space-y-2.5 border border-moka-900/8">
          <p class="text-xs font-bold text-moka-900">条件に一致するスポットがありません</p>
          <button id="reset-filters-btn" type="button" class="px-3.5 py-1.5 rounded-xl bg-moka-900 text-cream-50 text-xs font-bold">絞り込みを解除</button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', resetAllFilters);
      return;
    }

    // Render top 90 in scrollable list for buttery 60fps DOM performance
    const slice = list.slice(0, 95);

    dom.cardsList.innerHTML = slice
      .map((spot, i) => {
        const saved = state.savedIds.has(spot.id);
        const active = spot.id === state.selectedId;
        const igHref =
          spot.instagramUrl ||
          `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(spot.name)}`;
        const xHref =
          spot.xUrl || `https://x.com/search?q=${encodeURIComponent(spot.name)}`;

        return `
        <article class="swipe-wrap card-pop" style="animation-delay:${Math.min(i * 22, 260)}ms" data-wrap-id="${spot.id}">
          <div class="swipe-underlay mode-save" data-underlay>
            <span class="inline-flex items-center gap-1.5">${ICONS.bookmarkFill} 保存切替</span>
            <span class="inline-flex items-center gap-1.5">詳細・公式情報 ${ICONS.globe}</span>
          </div>

          <div class="cafe-card p-3.5 ${active ? 'active-card' : ''}" data-card-id="${spot.id}">
            <!-- Row 1: Category + Area + Distance + Bookmark -->
            <div class="flex items-center justify-between gap-2 text-[10.5px] font-bold text-moka-500">
              <div class="flex items-center gap-1.5 truncate">
                <span class="px-2 py-0.5 rounded-md ${
                  spot.category === 'coworking' ? 'bg-[#E6F3EA] text-[#366341]' : 'bg-cream-200/80 text-moka-800'
                } font-extrabold shrink-0">${spot.categoryLabel}</span>
                <span class="truncate">${spot.areaLabel}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="font-mono text-[10.5px] text-moka-700">${formatDist(spot.distanceMeters)}</span>
                <button type="button" data-save-btn="${spot.id}" class="w-6 h-6 rounded-lg flex items-center justify-center ${
                  saved ? 'text-caramel-500 bg-caramel-400/15' : 'text-moka-500 hover:bg-cream-200'
                } transition-colors" aria-label="ブックマーク">
                  ${saved ? ICONS.bookmarkFill : ICONS.bookmark}
                </button>
              </div>
            </div>

            <!-- Row 2: Store Name & Station -->
            <h2 class="text-[13.5px] font-black text-moka-900 leading-snug mt-1">${spot.name}</h2>
            <p class="text-[11px] text-moka-500 truncate mt-0.5">${spot.station} · ${spot.openHours}</p>

            <!-- Row 3: POWER & WI-FI YES/NO MATRIX (Core User Need!) -->
            <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
              ${powerBadgeHTML(spot)}
              ${wifiBadgeHTML(spot)}
            </div>

            <!-- Row 4: Direct 1-Tap Official Site & SNS Links -->
            <div class="mt-2.5 pt-2 border-t border-moka-900/6 flex items-center justify-between gap-1.5">
              <div class="flex items-center gap-1.5">
                <a href="${spot.officialUrl}" target="_blank" rel="noopener noreferrer" data-ext-link class="px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-honey-200 text-[10.5px] font-bold text-moka-800 inline-flex items-center gap-1 transition-colors">
                  ${ICONS.globe}<span>公式サイト</span>${ICONS.ext}
                </a>
                <a href="${igHref}" target="_blank" rel="noopener noreferrer" data-ext-link class="px-2 py-1 rounded-lg bg-cream-100 hover:bg-[#FCE9E5] text-[10.5px] font-bold text-moka-800 inline-flex items-center gap-1 transition-colors" title="Instagramで雰囲気・最新営業情報を確認">
                  ${ICONS.insta}<span>Instagram</span>
                </a>
                <a href="${xHref}" target="_blank" rel="noopener noreferrer" data-ext-link class="w-6 h-6 rounded-lg bg-cream-100 hover:bg-cream-200 text-moka-800 inline-flex items-center justify-center transition-colors" title="X（旧Twitter）の口コミ・空席投稿を検索">
                  ${ICONS.xLogo}
                </a>
              </div>
              <span class="text-[10.5px] font-bold text-caramel-500">詳細 ›</span>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    bindCardInteractions();
  }

  function renderMapMarkers(list) {
    if (!map || !pinsLayer) return;
    pinsLayer.clearLayers();

    // Show up to 140 markers smoothly
    list.slice(0, 140).forEach((spot) => {
      const isSelected = spot.id === state.selectedId;
      const isCowork = spot.category === 'coworking';
      const isOsm = spot.source === 'osm';
      const hasP = spot.power === 'yes_all' || spot.power === 'yes_part';
      const hasW = spot.wifi === 'yes_free' || spot.wifi === 'yes_reg';

      const shortName = spot.name.length > 10 ? spot.name.slice(0, 9) + '…' : spot.name;

      const statusDots = `
        ${hasP ? '<span class="w-2 h-2 rounded-full bg-[#CA6B3E]" title="コンセントあり"></span>' : ''}
        ${hasW ? '<span class="w-2 h-2 rounded-full bg-[#497E56]" title="Wi-Fiあり"></span>' : ''}
      `;

      const icon = L.divIcon({
        className: 'noma-pin-icon',
        html: `
          <div class="map-pin-capsule ${isCowork ? 'pin-cowork' : ''} ${isOsm ? 'pin-osm' : ''} ${isSelected ? 'pin-selected' : ''}" data-pin="${spot.id}">
            <div class="map-pin-head">
              ${statusDots}
              <span>${shortName}</span>
            </div>
            <div class="map-pin-tip"></div>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 30]
      });

      const m = L.marker([spot.lat, spot.lng], {
        icon,
        zIndexOffset: isSelected ? 800 : isOsm ? 100 : 400
      }).addTo(pinsLayer);

      m.on('click', () => {
        focusSpot(spot.id, { pan: true, openSheet: true });
      });
    });
  }

  // =========================================================================
  // 6. SWIPE ACTION + CARD CLICK + BOOKMARK
  // =========================================================================
  function bindCardInteractions() {
    // External links shouldn't trigger card open
    document.querySelectorAll('[data-ext-link]').forEach((a) => {
      a.addEventListener('click', (e) => e.stopPropagation());
    });

    document.querySelectorAll('[data-save-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-save-btn');
        if (id) toggleSave(id, e.clientX, e.clientY);
      });
    });

    document.querySelectorAll('.cafe-card').forEach((card) => {
      const id = card.getAttribute('data-card-id');
      const underlay = card.parentElement?.querySelector('[data-underlay]');
      let sx = 0;
      let sy = 0;
      let dx = 0;
      let active = false;
      let moved = false;

      const onDown = (x, y, target) => {
        if (target.closest('button, a')) return;
        sx = x;
        sy = y;
        dx = 0;
        active = true;
        moved = false;
        card.classList.add('dragging');
      };

      const onMove = (x, y) => {
        if (!active) return;
        const cx = x - sx;
        const cy = y - sy;
        if (!moved && Math.abs(cy) > Math.abs(cx) && Math.abs(cy) > 9) {
          active = false;
          card.classList.remove('dragging');
          card.style.transform = '';
          return;
        }
        if (Math.abs(cx) > 9) {
          moved = true;
          dx = Math.max(-115, Math.min(115, cx));
          card.style.transform = `translateX(${dx}px)`;
          if (underlay) {
            underlay.className = `swipe-underlay ${dx > 0 ? 'mode-save' : 'mode-open'}`;
          }
        }
      };

      const onUp = () => {
        if (!active) return;
        active = false;
        card.classList.remove('dragging');

        if (dx > 68 && id) {
          const r = card.getBoundingClientRect();
          toggleSave(id, r.left + 48, r.top + 28);
        } else if (dx < -68 && id) {
          focusSpot(id, { pan: true, openSheet: true });
        } else if (!moved && id) {
          focusSpot(id, { pan: true, openSheet: true });
        }
        card.style.transform = '';
      };

      card.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY, e.target));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onUp);

      card.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX, e.touches[0].clientY, e.target), { passive: true });
      card.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
      card.addEventListener('touchend', onUp);
    });
  }

  function toggleSave(spotId, x, y) {
    const all = getAllCombinedSpots();
    const spot = all.find((s) => s.id === spotId);
    const was = state.savedIds.has(spotId);

    if (was) {
      state.savedIds.delete(spotId);
      showToast({
        title: '保存リストから外しました',
        sub: spot ? spot.name : '',
        undoLabel: '元に戻す',
        onUndo: () => {
          state.savedIds.add(spotId);
          updateSavedBadge();
          applyClientFiltersAndRender();
        }
      });
    } else {
      state.savedIds.add(spotId);
      if (x && y) burstParticles(x, y);
      showToast({
        title: '保存リストに追加しました',
        sub: spot ? spot.name : ''
      });
    }
    updateSavedBadge();
    applyClientFiltersAndRender();
  }

  function updateSavedBadge() {
    if (dom.savedCount) dom.savedCount.textContent = String(state.savedIds.size);
  }

  // =========================================================================
  // 7. BOTTOM SHEET (Official Website, Instagram, X, Power/Wi-Fi Detail & Infographic)
  // =========================================================================
  function focusSpot(spotId, { pan = true, openSheet = true } = {}) {
    state.selectedId = spotId;
    const spot = getAllCombinedSpots().find((s) => s.id === spotId);
    if (!spot) return;

    document.querySelectorAll('.cafe-card').forEach((c) => {
      c.classList.toggle('active-card', c.getAttribute('data-card-id') === spotId);
    });
    document.querySelectorAll('.map-pin-capsule').forEach((p) => {
      p.classList.toggle('pin-selected', p.getAttribute('data-pin') === spotId);
    });

    if (pan && map) {
      const latOffset = openSheet ? -0.0025 : 0;
      map.flyTo([spot.lat + latOffset, spot.lng], Math.max(map.getZoom(), 15), { duration: 0.55 });
    }

    if (openSheet) renderBottomSheet(spot);
  }

  function renderBottomSheet(spot) {
    if (!dom.bottomSheet || !dom.bsBody) return;
    if (dom.bsAreaTag) dom.bsAreaTag.textContent = `${spot.areaLabel} · ${spot.categoryLabel}`;

    const saved = state.savedIds.has(spot.id);
    const igHref =
      spot.instagramUrl ||
      `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(spot.name)}`;
    const xHref =
      spot.xUrl || `https://x.com/search?q=${encodeURIComponent(spot.name + ' 電源 OR Wi-Fi')}`;
    const gmapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}&query_place_id=${spot.lat},${spot.lng}`;
    const photo = spot.photoUrl || 'https://sspark.genspark.ai/i/81znq8BwVCgoGXQl?width=900';

    // Hourly openness pattern for infographic animation
    const hourly = [78, 62, 42, 72, 58, 66, 84];
    const hoursLabel = ['8時', '10時', '12時', '14時', '16時', '18時', '20時'];
    const pMeter = spot.power === 'yes_all' ? 100 : spot.power === 'yes_part' ? 76 : 12;
    const wMeter = spot.wifi === 'yes_free' ? 94 : spot.wifi === 'yes_reg' ? 75 : 12;

    dom.bsBody.innerHTML = `
      <!-- Top Summary + Official & SNS Primary Action Bar -->
      <div class="flex flex-col md:flex-row gap-4 items-start">
        <img src="${photo}" alt="${spot.name}" class="w-full md:w-36 h-32 rounded-2xl object-cover border border-moka-900/10 shrink-0" />

        <div class="flex-1 min-w-0 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 id="bs-title" class="text-lg sm:text-xl font-black text-moka-900 leading-tight">${spot.name}</h2>
              <p class="text-xs text-moka-500 font-bold mt-0.5">${spot.station} · 営業時間 ${spot.openHours} · 目安 ${spot.priceHint}</p>
            </div>
            <button id="bs-save-btn" type="button" class="shrink-0 px-3 py-2 rounded-xl border ${
              saved ? 'bg-caramel-500 text-white border-caramel-500' : 'bg-cream-100 text-moka-800 border-moka-900/15'
            } text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
              ${saved ? ICONS.bookmarkFill : ICONS.bookmark}
              <span>${saved ? '保存済み' : '保存する'}</span>
            </button>
          </div>

          <p class="text-xs text-moka-700 leading-relaxed">${spot.note}</p>

          <!-- Prominent Official Website / Instagram / X / Google Maps Links -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <a href="${spot.officialUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-moka-900 hover:bg-caramel-500 text-cream-50 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm">
              ${ICONS.globe}
              <span>公式サイトを見る</span>
              ${ICONS.ext}
            </a>

            <a href="${igHref}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-[#FDF0ED] hover:bg-[#FADCD5] border border-[#E2875A]/30 text-moka-900 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
              ${ICONS.insta}
              <span>Instagram (${spot.instagramHandle || '投稿検索'})</span>
              ${ICONS.ext}
            </a>

            <a href="${xHref}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-moka-900/12 text-moka-900 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
              ${ICONS.xLogo}
              <span>X 最新口コミ</span>
              ${ICONS.ext}
            </a>

            <a href="${gmapHref}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-cream-100 hover:bg-honey-200 border border-moka-900/12 text-moka-900 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
              ${ICONS.route}
              <span>Googleマップ経路</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Clear Power & Wi-Fi Spec Box + Animated Infographic Bars -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">

        <!-- Left: Explicit Power & Wi-Fi Details -->
        <div class="md:col-span-5 grid grid-cols-1 gap-2">
          <div class="rounded-2xl bg-[#FFF6F0] border border-[#E2875A]/30 p-3 flex items-start gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#CA6B3E] text-white flex items-center justify-center shrink-0 mt-0.5">${ICONS.plug}</div>
            <div>
              <div class="text-[11px] font-bold text-[#B55428]">コンセント・電源設備</div>
              <div class="text-xs font-black text-moka-900 mt-0.5">${spot.powerDetail}</div>
            </div>
          </div>

          <div class="rounded-2xl bg-[#F1F8F3] border border-[#6FA07A]/35 p-3 flex items-start gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#497E56] text-white flex items-center justify-center shrink-0 mt-0.5">${ICONS.wifi}</div>
            <div>
              <div class="text-[11px] font-bold text-[#366341]">Wi-Fi・通信環境</div>
              <div class="text-xs font-black text-moka-900 mt-0.5">${spot.wifiDetail}</div>
            </div>
          </div>
        </div>

        <!-- Center: Animated Work Spec Infographic Meters -->
        <div class="md:col-span-4 rounded-2xl bg-cream-100/80 border border-moka-900/8 p-3.5 flex flex-col justify-between space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-moka-700">
            <span>作業環境スコア</span>
            <span class="font-mono text-moka-900">${spot.workIndex} / 100</span>
          </div>
          <div>
            <div class="flex justify-between text-[10.5px] font-bold mb-0.5"><span>電源確保しやすさ</span><span class="font-mono">${pMeter}%</span></div>
            <div class="h-1.5 rounded-full bg-cream-200 overflow-hidden"><div class="meter-fill h-full bg-caramel-500 rounded-full" data-w="${pMeter}%" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10.5px] font-bold mb-0.5"><span>通信・Wi-Fi快適度</span><span class="font-mono">${wMeter}%</span></div>
            <div class="h-1.5 rounded-full bg-cream-200 overflow-hidden"><div class="meter-fill h-full bg-sage-500 rounded-full" data-w="${wMeter}%" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[10.5px] font-bold mb-0.5"><span>机の広さ・落ち着き</span><span class="font-mono">${spot.deskScore || 82}%</span></div>
            <div class="h-1.5 rounded-full bg-cream-200 overflow-hidden"><div class="meter-fill h-full bg-moka-800 rounded-full" data-w="${spot.deskScore || 82}%" style="width:0%"></div></div>
          </div>
        </div>

        <!-- Right: Animated Hourly Seat Comfort Chart -->
        <div class="md:col-span-3 rounded-2xl bg-cream-100/80 border border-moka-900/8 p-3.5 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-moka-700">時間帯別の座りやすさ傾向</div>
          <div class="h-20 flex items-end justify-between gap-1 pt-2">
            ${hourly
              .map(
                (v, idx) => `
              <div class="flex-1 flex flex-col items-center h-full justify-end">
                <div class="w-full h-14 bg-cream-200/80 rounded-t flex items-end overflow-hidden">
                  <div class="crowd-bar w-full rounded-t ${v >= 70 ? 'bg-sage-500' : 'bg-caramel-400'}" data-h="${v}%" style="height:0%"></div>
                </div>
                <span class="text-[9px] font-mono text-moka-500 mt-1">${hoursLabel[idx].replace('時', '')}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    state.sheetFull = false;
    dom.bottomSheet.style.maxHeight = '64vh';
    if (dom.bsSizeBtn) dom.bsSizeBtn.textContent = '拡大';
    dom.bottomSheet.classList.remove('translate-y-[120%]');
    dom.bottomSheet.style.transform = 'translateY(0px)';

    // Trigger Infographic Bar Animations
    setTimeout(() => {
      dom.bsBody.querySelectorAll('.meter-fill').forEach((el) => {
        el.style.width = el.getAttribute('data-w') || '75%';
      });
      dom.bsBody.querySelectorAll('.crowd-bar').forEach((el, i) => {
        setTimeout(() => {
          el.style.height = el.getAttribute('data-h') || '60%';
        }, i * 45);
      });
    }, 60);

    document.getElementById('bs-save-btn')?.addEventListener('click', (e) => {
      toggleSave(spot.id, e.clientX, e.clientY);
      renderBottomSheet(spot);
    });
  }

  function closeSheet() {
    if (!dom.bottomSheet) return;
    dom.bottomSheet.style.transform = '';
    dom.bottomSheet.classList.add('translate-y-[120%]');
  }

  function initBottomSheetGestures() {
    dom.bsCloseBtn?.addEventListener('click', closeSheet);
    dom.bsSizeBtn?.addEventListener('click', () => {
      if (!dom.bottomSheet) return;
      state.sheetFull = !state.sheetFull;
      dom.bottomSheet.style.maxHeight = state.sheetFull ? '88vh' : '64vh';
      dom.bsSizeBtn.textContent = state.sheetFull ? '標準' : '拡大';
    });

    const h = dom.bsHandle;
    if (!h || !dom.bottomSheet) return;
    let sy = 0;
    let dy = 0;
    let drag = false;

    const down = (y) => {
      sy = y;
      dy = 0;
      drag = true;
      dom.bottomSheet.style.transition = 'none';
    };
    const move = (y) => {
      if (!drag) return;
      dy = y - sy;
      if (dy > 0) dom.bottomSheet.style.transform = `translateY(${dy}px)`;
      else if (dy < -30) {
        state.sheetFull = true;
        dom.bottomSheet.style.maxHeight = '88vh';
      }
    };
    const up = () => {
      if (!drag) return;
      drag = false;
      dom.bottomSheet.style.transition = '';
      if (dy > 85) closeSheet();
      else dom.bottomSheet.style.transform = 'translateY(0px)';
    };

    h.addEventListener('touchstart', (e) => down(e.touches[0].clientY), { passive: true });
    h.addEventListener('touchmove', (e) => move(e.touches[0].clientY), { passive: true });
    h.addEventListener('touchend', up);
    h.addEventListener('mousedown', (e) => {
      if (!e.target.closest('button')) down(e.clientY);
    });
    window.addEventListener('mousemove', (e) => move(e.clientY));
    window.addEventListener('mouseup', up);
  }

  // =========================================================================
  // 8. PULL TO REFRESH (Re-scans Map Center + Loads Nearby OSM Cafes)
  // =========================================================================
  function initPullToRefresh() {
    const scroller = dom.cardsScroller;
    const bar = dom.ptrBar;
    if (!scroller || !bar) return;

    let sy = 0;
    let pulling = false;
    let dist = 0;

    const start = (y) => {
      if (scroller.scrollTop > 2) return;
      sy = y;
      pulling = true;
      dist = 0;
      bar.classList.remove('releasing');
    };
    const move = (y) => {
      if (!pulling) return;
      const d = y - sy;
      if (d <= 0) {
        dist = 0;
        bar.style.height = '0px';
        return;
      }
      dist = Math.min(76, Math.pow(d, 0.8) * 1.4);
      bar.style.height = `${dist}px`;
      if (dom.ptrLabel) {
        dom.ptrLabel.textContent =
          dist >= 52 ? '離して現在の地図中心から再スキャン' : '引っ張って現在マップ周辺のカフェを再スキャン';
      }
    };
    const end = async () => {
      if (!pulling) return;
      pulling = false;
      bar.classList.add('releasing');
      if (dist >= 52 && map) {
        bar.style.height = '42px';
        if (dom.ptrLabel) dom.ptrLabel.textContent = '周辺の街カフェを更新中...';
        const c = map.getCenter();
        state.lat = c.lat;
        state.lng = c.lng;
        drawOriginMarker();
        await loadOsmCafesAround(c.lat, c.lng, 1600, false);
        applyClientFiltersAndRender();
      }
      bar.style.height = '0px';
      dist = 0;
    };

    scroller.addEventListener('touchstart', (e) => start(e.touches[0].clientY), { passive: true });
    scroller.addEventListener('touchmove', (e) => move(e.touches[0].clientY), { passive: true });
    scroller.addEventListener('touchend', end);
    scroller.addEventListener('mousedown', (e) => {
      if (!e.target.closest('button, a, .cafe-card')) start(e.clientY);
    });
    window.addEventListener('mousemove', (e) => move(e.clientY));
    window.addEventListener('mouseup', end);
  }

  // =========================================================================
  // 9. AUTO COMPLETE SEARCH
  // =========================================================================
  let acDebounce = null;

  function highlightText(txt, q) {
    if (!q) return txt;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return txt.replace(new RegExp(`(${esc})`, 'gi'), '<mark class="bg-honey-300 text-moka-900 rounded px-0.5">$1</mark>');
  }

  async function refreshAutocomplete(q) {
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      state.acItems = data.items || [];
      state.acIndex = -1;
      drawAutocomplete(q);
    } catch (_) {}
  }

  function drawAutocomplete(q) {
    if (!dom.acPanel || !dom.acList) return;
    if (!state.acItems.length) {
      dom.acPanel.classList.add('hidden');
      return;
    }

    dom.acList.innerHTML = state.acItems
      .map(
        (it, idx) => `
      <li role="option" data-ac="${idx}" class="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer text-xs transition-colors ${
        idx === state.acIndex ? 'bg-honey-200/70' : 'hover:bg-cream-200/60'
      }">
        <div class="min-w-0">
          <div class="font-bold text-moka-900 truncate">${highlightText(it.label, q)}</div>
          <div class="text-[10.5px] text-moka-500 truncate">${it.sub}</div>
        </div>
        <span class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-md bg-cream-200/80 text-moka-700">
          ${it.kind === 'spot' ? '店舗' : it.kind === 'area' ? '移動' : '絞込'}
        </span>
      </li>
    `
      )
      .join('');

    dom.acPanel.classList.remove('hidden');

    dom.acList.querySelectorAll('[data-ac]').forEach((li) => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const idx = parseInt(li.getAttribute('data-ac') || '0', 10);
        pickAutocomplete(state.acItems[idx]);
      });
    });
  }

  function pickAutocomplete(item) {
    if (!item) return;
    dom.acPanel?.classList.add('hidden');

    if (item.kind === 'spot' && item.spotId) {
      state.region = 'all';
      syncRegionPills();
      state.query = '';
      if (dom.searchInput) dom.searchInput.value = item.label;
      dom.clearQBtn?.classList.remove('hidden');
      applyClientFiltersAndRender();
      focusSpot(item.spotId, { pan: true, openSheet: true });
      return;
    }

    if (item.kind === 'area' && item.areaId) {
      switchRegion(item.areaId);
      return;
    }

    state.query = item.query;
    if (dom.searchInput) dom.searchInput.value = item.query;
    dom.clearQBtn?.classList.remove('hidden');
    applyClientFiltersAndRender();
  }

  function initAutocomplete() {
    if (!dom.searchInput) return;

    dom.searchInput.addEventListener('focus', () => {
      refreshAutocomplete(dom.searchInput.value.trim());
    });

    dom.searchInput.addEventListener('input', () => {
      const v = dom.searchInput.value.trim();
      dom.clearQBtn?.classList.toggle('hidden', !v);
      clearTimeout(acDebounce);
      acDebounce = setTimeout(() => {
        state.query = v;
        refreshAutocomplete(v);
        applyClientFiltersAndRender();
      }, 130);
    });

    dom.searchInput.addEventListener('keydown', (e) => {
      const len = state.acItems.length;
      if (e.key === 'ArrowDown' && len) {
        e.preventDefault();
        state.acIndex = (state.acIndex + 1) % len;
        drawAutocomplete(dom.searchInput.value.trim());
      } else if (e.key === 'ArrowUp' && len) {
        e.preventDefault();
        state.acIndex = (state.acIndex - 1 + len) % len;
        drawAutocomplete(dom.searchInput.value.trim());
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.acIndex >= 0 && state.acItems[state.acIndex]) {
          pickAutocomplete(state.acItems[state.acIndex]);
        } else {
          dom.acPanel?.classList.add('hidden');
          state.query = dom.searchInput.value.trim();
          applyClientFiltersAndRender();
        }
      } else if (e.key === 'Escape') {
        dom.acPanel?.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#ac-container')) dom.acPanel?.classList.add('hidden');
    });

    dom.clearQBtn?.addEventListener('click', () => {
      dom.searchInput.value = '';
      state.query = '';
      dom.clearQBtn.classList.add('hidden');
      applyClientFiltersAndRender();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        dom.searchInput.focus();
      }
    });
  }

  // =========================================================================
  // 10. REGION TABS, TACTILE SWITCHES & GPS
  // =========================================================================
  function syncRegionPills() {
    document.querySelectorAll('.region-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-region') === state.region);
    });
  }

  function switchRegion(regionId) {
    const preset = REGION_PRESETS[regionId] || REGION_PRESETS.all;
    state.region = regionId;
    state.savedOnly = false;
    dom.savedOnlyBtn?.classList.remove('bg-moka-900', 'text-cream-50');
    if (regionId !== 'all') {
      state.lat = preset.lat;
      state.lng = preset.lng;
      drawOriginMarker();
    }
    syncRegionPills();
    closeSheet();

    showSkeleton(true);
    if (map) map.flyTo([preset.lat, preset.lng], preset.zoom, { duration: 0.65 });
    setTimeout(() => {
      applyClientFiltersAndRender();
      showSkeleton(false);
      if (regionId !== 'all') {
        loadOsmCafesAround(preset.lat, preset.lng, 1600, true);
      }
    }, 240);
  }

  function resetAllFilters() {
    state.region = 'all';
    state.category = 'all';
    state.powerOnly = false;
    state.wifiOnly = false;
    state.savedOnly = false;
    state.query = '';
    if (dom.searchInput) dom.searchInput.value = '';
    dom.clearQBtn?.classList.add('hidden');
    dom.togglePowerBtn?.classList.remove('is-on-power');
    dom.toggleWifiBtn?.classList.remove('is-on-wifi');
    document.querySelectorAll('.cat-chip').forEach((c) => c.classList.remove('is-active'));
    syncRegionPills();
    applyClientFiltersAndRender();
  }

  function initButtons() {
    document.querySelectorAll('.region-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = btn.getAttribute('data-region') || 'all';
        switchRegion(r);
      });
    });

    dom.togglePowerBtn?.addEventListener('click', () => {
      state.powerOnly = !state.powerOnly;
      dom.togglePowerBtn.classList.toggle('is-on-power', state.powerOnly);
      dom.togglePowerBtn.setAttribute('aria-pressed', String(state.powerOnly));
      applyClientFiltersAndRender();
      showToast({
        title: state.powerOnly ? 'コンセントがある店舗のみに絞り込みました' : 'コンセント絞り込みを解除しました'
      });
    });

    dom.toggleWifiBtn?.addEventListener('click', () => {
      state.wifiOnly = !state.wifiOnly;
      dom.toggleWifiBtn.classList.toggle('is-on-wifi', state.wifiOnly);
      dom.toggleWifiBtn.setAttribute('aria-pressed', String(state.wifiOnly));
      applyClientFiltersAndRender();
      showToast({
        title: state.wifiOnly ? 'Wi-Fiがある店舗のみに絞り込みました' : 'Wi-Fi絞り込みを解除しました'
      });
    });

    document.querySelectorAll('.cat-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const c = chip.getAttribute('data-cat') || 'all';
        state.category = state.category === c ? 'all' : c;
        document.querySelectorAll('.cat-chip').forEach((el) => {
          el.classList.toggle('is-active', el.getAttribute('data-cat') === state.category);
        });
        applyClientFiltersAndRender();
      });
    });

    dom.sortSelect?.addEventListener('change', () => {
      state.sort = dom.sortSelect.value;
      applyClientFiltersAndRender();
    });

    dom.savedOnlyBtn?.addEventListener('click', () => {
      state.savedOnly = !state.savedOnly;
      dom.savedOnlyBtn.classList.toggle('bg-moka-900', state.savedOnly);
      dom.savedOnlyBtn.classList.toggle('text-cream-50', state.savedOnly);
      applyClientFiltersAndRender();
      showToast({
        title: state.savedOnly ? `保存済み ${state.savedIds.size}軒を表示中` : '全スポット表示に戻しました'
      });
    });

    document.getElementById('gps-btn')?.addEventListener('click', () => {
      if (!navigator.geolocation) {
        switchRegion('umeda');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.lat = pos.coords.latitude;
          state.lng = pos.coords.longitude;
          state.region = 'all';
          syncRegionPills();
          drawOriginMarker();
          if (map) map.flyTo([state.lat, state.lng], 15, { duration: 0.7 });
          applyClientFiltersAndRender();
          loadOsmCafesAround(state.lat, state.lng, 1500, true);
          showToast({ title: '現在地から近い順に並べ替えました' });
        },
        () => {
          state.lat = 34.7025;
          state.lng = 135.4988;
          drawOriginMarker();
          if (map) map.flyTo([state.lat, state.lng], 15, { duration: 0.65 });
          applyClientFiltersAndRender();
          showToast({ title: '大阪・梅田周辺を基準位置に設定しました' });
        },
        { timeout: 4500 }
      );
    });

    dom.osmExpandBtn?.addEventListener('click', () => {
      if (!map) return;
      const c = map.getCenter();
      loadOsmCafesAround(c.lat, c.lng, 2200, false);
    });

    document.getElementById('map-style-btn')?.addEventListener('click', () => {
      state.cafeMapTone = !state.cafeMapTone;
      dom.mapEl?.classList.toggle('cafe-map-tone', state.cafeMapTone);
      showToast({ title: state.cafeMapTone ? 'ラテベージュ地図トーンに変更' : '標準OpenStreetMap配色に変更' });
    });

    // Mobile list collapse toggle
    document.getElementById('mobile-sheet-toggle')?.addEventListener('click', () => {
      state.mobileListHidden = !state.mobileListHidden;
      dom.explorerIsland?.classList.toggle('translate-y-[82%]', state.mobileListHidden);
      const lbl = document.getElementById('mobile-toggle-label');
      if (lbl) lbl.textContent = state.mobileListHidden ? 'リストを開く' : '地図を広く見る';
    });
  }

  // =========================================================================
  // BOOTSTRAP
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    updateSavedBadge();
    initKineticAndMascot();
    initMap();
    initAutocomplete();
    initPullToRefresh();
    initBottomSheetGestures();
    initButtons();
    initialFetchSpots();
  });
})();
