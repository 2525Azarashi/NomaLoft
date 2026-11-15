/* =====================================================================
   NomaLoft KANSAI — Landscape Spatial Web Application (app.js)
   - Kansai First (Kitahama / Umeda & Nakazakicho / Horie / Kyoto / Kobe)
   - 100% Free OpenStreetMap Tile Layer + Live Overpass API Overlay
   - Strictly ZERO Default Unicode Emojis (100% Custom Line-Art SVGs)
   - Full Motion Suite:
     1. Kinetic Typography (Split-Flap Stagger + Editorial Wave)
     2. UI/UX Micro-Animations (Tactile Cursor, SVG Bean Confetti, Ticket Stub)
     3. Infographic Animation (Radial Arcs, Count-up, Pentagon Radar, Hourly Bars)
     4. Pull to Refresh (V60 Hand-Drip Line-Art Animation)
     5. Skeleton Screen (Warm Washi Linen Shimmer)
     6. Toast Notification (Spring Stack + Progress + Undo)
     7. Draggable Bottom Sheet (Map-Stage Dossier with Snap & Swipe Close)
     8. Swipe Action (Right = Bookmark Passbook, Left = Stamp Check-in)
     9. Auto Complete (Match Highlight + Keyboard Up/Down/Enter)
   ===================================================================== */

(function () {
  'use strict';

  // --- Bespoke 1.6px Architectural Line-Art SVG Icon Library (Zero Emojis) ---
  const SVG = {
    cup: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10v5a5 5 0 0 1-10 0V7z"/><path d="M14 8h1.8a2.2 2.2 0 0 1 0 4.4H14"/><path d="M7 4.2c0-1 .8-1.4.8-2.2M10.5 4.2c0-1 .8-1.4.8-2.2"/></svg>`,
    desk: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="12" height="7.5" rx="1.5"/><path d="M2.5 14h15M5 14v3.5M15 14v3.5M10 11.5V14"/></svg>`,
    pin: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17.5s-5.5-4.6-5.5-9a5.5 5.5 0 1 1 11 0c0 4.4-5.5 9-5.5 9z"/><circle cx="10" cy="8.5" r="1.8"/></svg>`,
    plug: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 3.5v4M12.5 3.5v4M5.5 7.5h9v3a4.5 4.5 0 0 1-9 0v-3zM10 15v2.5"/></svg>`,
    bolt: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2.5L4.8 11h4.7l-.8 6.5L15.2 9h-4.7l.5-6.5z"/></svg>`,
    mic: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="7.5" y="3" width="5" height="8.5" rx="2.5"/><path d="M5 10a5 5 0 0 0 10 0M10 15v2.5M7.5 17.5h5"/></svg>`,
    book: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 4.5h5a2 2 0 0 1 2 2v10a1.5 1.5 0 0 0-1.5-1.5h-5.5v-10.5zM16.5 4.5h-5a2 2 0 0 0-2 2v10a1.5 1.5 0 0 1 1.5-1.5h5.5v-10.5z"/></svg>`,
    monitor: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="3.5" width="15" height="10" rx="1.5"/><path d="M7 16.5h6M10 13.5v3"/></svg>`,
    bookmark: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3.5h9a1 1 0 0 1 1 1v12.5L10 13.8l-5.5 3.2V4.5a1 1 0 0 1 1-1z"/></svg>`,
    bookmarkFilled: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M5.5 3.5h9a1 1 0 0 1 1 1v12.5L10 13.8l-5.5 3.2V4.5a1 1 0 0 1 1-1z"/></svg>`,
    stamp: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.2"/><path d="M7.2 10.2l2 2 3.8-4"/></svg>`,
    route: `<svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="15" r="2"/><circle cx="15" cy="5" r="2"/><path d="M7 15h3.5a2.5 2.5 0 0 0 0-5h-1a2.5 2.5 0 0 1 0-5H13"/></svg>`,
    beanParticle: `<svg viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="4.5" ry="6" transform="rotate(-25 8 8)" fill="#C06044" stroke="#221B17" stroke-width="1.3"/><path d="M6 3.5c1.5 2.5.8 6.2 4 9" stroke="#FCF9F4" stroke-width="1.1" stroke-linecap="round"/></svg>`,
    starParticle: `<svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.6 6.4L14.5 8L9.6 9.6L8 14.5L6.4 9.6L1.5 8L6.4 6.4Z" fill="#D4B267" stroke="#221B17" stroke-width="1.1"/></svg>`,
    leafParticle: `<svg viewBox="0 0 16 16" fill="none"><path d="M3 13C3 6.5 7.5 3 13 3C13 8.5 9.5 13 3 13Z" fill="#6C8F73" stroke="#221B17" stroke-width="1.2"/></svg>`
  };

  // --- Application State (Default: Osaka Kitahama / Nakanoshima) ---
  const state = {
    lat: 34.6918,
    lng: 135.5064,
    areaId: 'kitahama',
    areaLabel: '大阪・北浜 / 中之島',
    category: 'all',
    filter: '',
    query: '',
    sort: 'distance',
    jitterSeed: 0,
    spots: [],
    selectedSpotId: null,
    savedIds: new Set(['spot-kitahama-river', 'spot-kyoto-machiya']),
    savedOnlyMode: false,
    checkedInIds: new Set(),
    beans: 45,
    washiMapTone: true,
    walkRingVisible: true,
    osmLiveActive: false,
    osmNodes: [],
    autocompleteItems: [],
    acActiveIndex: -1,
    sheetExpanded: false,
    ambienceOn: false,
    audioCtx: null,
    ambienceNodes: [],
    pomoSeconds: 25 * 60,
    pomoRunning: false,
    pomoInterval: null
  };

  const KANSAI_AREA_COORDS = {
    kitahama: { lat: 34.6918, lng: 135.5064, label: '大阪・北浜 / 中之島', zoom: 15 },
    umeda: { lat: 34.7055, lng: 135.5025, label: '大阪・梅田 / 中崎町', zoom: 15 },
    horie: { lat: 34.6738, lng: 135.4945, label: '大阪・南船場 / 堀江', zoom: 15 },
    kyoto: { lat: 35.0088, lng: 135.7652, label: '京都・烏丸御池 / 河原町', zoom: 15 },
    kobe: { lat: 34.6881, lng: 135.1918, label: '神戸・旧居留地 / 元町', zoom: 15 }
  };

  // --- Leaflet Map References ---
  let map = null;
  let userMarker = null;
  let walkCircle = null;
  let spotLayer = null;
  let osmLiveLayer = null;

  // --- DOM Elements ---
  const el = {
    toastContainer: document.getElementById('toast-container'),
    kineticWord: document.getElementById('kinetic-rotating-word'),
    waveText: document.querySelector('.kinetic-wave-text'),
    areaCaption: document.getElementById('current-area-caption'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    acDropdown: document.getElementById('autocomplete-dropdown'),
    acList: document.getElementById('autocomplete-list'),
    acCount: document.getElementById('ac-count'),
    locateMeBtn: document.getElementById('locate-me-btn'),
    statWifi: document.getElementById('stat-avg-wifi'),
    statWifiLabel: document.getElementById('stat-avg-wifi-label'),
    statPower: document.getElementById('stat-avg-power'),
    statSeats: document.getElementById('stat-open-seats'),
    ringWifi: document.getElementById('ring-wifi'),
    ringPower: document.getElementById('ring-power'),
    ringSeats: document.getElementById('ring-seats'),
    hudSparkBars: document.getElementById('hud-spark-bars'),
    skeletonList: document.getElementById('skeleton-list'),
    cardsList: document.getElementById('spots-cards-list'),
    spotCountNum: document.getElementById('spot-count-num'),
    scrollContainer: document.getElementById('spot-scroll-container'),
    ptrIndicator: document.getElementById('ptr-indicator'),
    ptrText: document.getElementById('ptr-text'),
    ptrDripperSvg: document.getElementById('ptr-dripper-svg'),
    savedBadge: document.getElementById('saved-count-badge'),
    beanPoints: document.getElementById('bean-points'),
    coordsReadout: document.getElementById('coords-readout'),
    mapContainer: document.getElementById('nomaloft-map'),
    bsBackdrop: document.getElementById('bottom-sheet-backdrop'),
    bottomSheet: document.getElementById('spot-bottom-sheet'),
    bsDragHandle: document.getElementById('bs-drag-handle'),
    bsCodeLabel: document.getElementById('bs-code-label'),
    bsContent: document.getElementById('bs-content'),
    bsCloseBtn: document.getElementById('bs-close-btn'),
    bsExpandBtn: document.getElementById('bs-expand-btn'),
    sortSelect: document.getElementById('sort-select')
  };

  // =========================================================
  // 1. KINETIC TYPOGRAPHY (Editorial Split-Flap + Hover Wave)
  // =========================================================
  const kineticPhrases = [
    { text: '全席コンセントの', tint: 'rgba(234, 210, 150, 0.55)' },
    { text: '土佐堀川と鴨川の', tint: 'rgba(188, 212, 192, 0.52)' },
    { text: '防音ブース完備の', tint: 'rgba(232, 196, 182, 0.52)' },
    { text: '町家と長屋ロフトの', tint: 'rgba(224, 210, 190, 0.65)' },
    { text: '実測300Mbps超の', tint: 'rgba(234, 210, 150, 0.55)' }
  ];
  let kineticIndex = 0;

  function setKineticPhrase(str) {
    if (!el.kineticWord) return;
    el.kineticWord.innerHTML = '';
    Array.from(str).forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'kinetic-char';
      s.style.animationDelay = `${i * 32}ms`;
      s.textContent = ch;
      el.kineticWord.appendChild(s);
    });
  }

  function initKineticTypography() {
    if (el.waveText) {
      const raw = el.waveText.textContent || '';
      el.waveText.innerHTML = Array.from(raw)
        .map((ch, idx) => `<span class="kinetic-wave-char" style="animation-delay:${idx * 38}ms">${ch}</span>`)
        .join('');
    }
    setKineticPhrase(kineticPhrases[0].text);

    setInterval(() => {
      if (!el.kineticWord) return;
      el.kineticWord.querySelectorAll('.kinetic-char').forEach((node, i) => {
        node.style.animationDelay = `${i * 15}ms`;
        node.classList.add('char-leave');
      });

      setTimeout(() => {
        kineticIndex = (kineticIndex + 1) % kineticPhrases.length;
        const next = kineticPhrases[kineticIndex];
        const slot = el.kineticWord.closest('.kinetic-slot');
        if (slot) slot.style.backgroundColor = next.tint;
        setKineticPhrase(next.text);
      }, 220);
    }, 3600);
  }

  // =========================================================
  // 2. TOAST NOTIFICATION & CUSTOM VECTOR CONFETTI
  // =========================================================
  function showToast({ iconSvg = SVG.cup, title, message = '', actionLabel = '', onAction = null, accent = 'sumi', duration = 3600 }) {
    if (!el.toastContainer) return;

    const borderAccent =
      accent === 'roast' ? 'border-l-4 border-l-roast-500' : accent === 'moss' ? 'border-l-4 border-l-moss-500' : 'border-l-4 border-l-brass-500';

    const node = document.createElement('div');
    node.className = `craft-toast bg-washi-50/98 backdrop-blur-md border border-sumi-900 ${borderAccent} rounded-xl p-3 shadow-[0_8px_24px_rgba(34,27,23,0.16)] flex items-start gap-2.5 relative overflow-hidden`;

    node.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-washi-200/80 border border-sumi-900/20 flex items-center justify-center text-sumi-900 shrink-0 mt-0.5">
        ${iconSvg}
      </div>
      <div class="flex-1 min-w-0 pr-1">
        <div class="text-xs font-bold text-sumi-900 leading-snug">${title}</div>
        ${message ? `<p class="text-[11px] text-sumi-600 mt-0.5 leading-relaxed">${message}</p>` : ''}
        ${
          actionLabel
            ? `<button type="button" class="toast-undo-btn mt-1.5 px-2.5 py-0.5 rounded bg-sumi-900 text-washi-50 font-mono text-[10px] font-bold hover:bg-roast-500 transition-colors">${actionLabel}</button>`
            : ''
        }
      </div>
      <button type="button" class="toast-dismiss text-sumi-600 hover:text-sumi-900 p-0.5" aria-label="閉じる">
        <svg viewBox="0 0 14 14" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l8 8M11 3l-8 8"/></svg>
      </button>
      <div class="toast-progress absolute bottom-0 left-0 h-[2px] bg-sumi-900/40 transition-all ease-linear" style="width:100%; transition-duration:${duration}ms"></div>
    `;

    el.toastContainer.appendChild(node);
    requestAnimationFrame(() => {
      const bar = node.querySelector('.toast-progress');
      if (bar) bar.style.width = '0%';
    });

    const close = () => {
      if (!node.isConnected) return;
      node.classList.add('toast-out');
      setTimeout(() => node.remove(), 230);
    };

    const timer = setTimeout(close, duration);
    node.querySelector('.toast-dismiss')?.addEventListener('click', () => {
      clearTimeout(timer);
      close();
    });

    if (actionLabel && typeof onAction === 'function') {
      node.querySelector('.toast-undo-btn')?.addEventListener('click', () => {
        clearTimeout(timer);
        onAction();
        close();
      });
    }
  }

  // Vector Confetti (Zero Emojis — Pure SVG Beans, Stars, Leaves)
  function spawnVectorParticles(x, y) {
    const shapes = [SVG.beanParticle, SVG.starParticle, SVG.leafParticle];
    for (let i = 0; i < 8; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'svg-particle';
      wrap.innerHTML = shapes[i % shapes.length];
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.35;
      const dist = 36 + Math.random() * 44;
      wrap.style.left = `${x - 7}px`;
      wrap.style.top = `${y - 7}px`;
      wrap.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      wrap.style.setProperty('--dy', `${Math.sin(angle) * dist - 18}px`);
      wrap.style.setProperty('--dr', `${(Math.random() - 0.5) * 110}deg`);
      document.body.appendChild(wrap);
      setTimeout(() => wrap.remove(), 900);
    }
  }

  // =========================================================
  // 3. INFOGRAPHIC ANIMATION (Radial Arcs, Sparkbars, Pentagon Radar)
  // =========================================================
  function animateNumber(targetEl, toVal, duration = 750) {
    if (!targetEl) return;
    const fromVal = parseInt(targetEl.textContent || '0', 10) || 0;
    const start = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      targetEl.textContent = String(Math.round(fromVal + (toVal - fromVal) * ease));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setArcProgress(circleEl, pct) {
    if (!circleEl) return;
    const circum = 2 * Math.PI * 17.5; // ~109.95
    const clamped = Math.max(0, Math.min(100, pct));
    circleEl.style.strokeDashoffset = String(circum * (1 - clamped / 100));
  }

  function updateHudInfographics(summary) {
    if (!summary) return;
    animateNumber(el.statWifi, summary.avgWifi);
    animateNumber(el.statWifiLabel, summary.avgWifi);
    animateNumber(el.statPower, summary.avgPower);
    animateNumber(el.statSeats, summary.totalOpenSeats);

    setArcProgress(el.ringWifi, Math.min(100, (summary.avgWifi / 550) * 100));
    setArcProgress(el.ringPower, summary.avgPower);
    setArcProgress(el.ringSeats, Math.min(100, (summary.totalOpenSeats / 115) * 100));
  }

  function initHudSparkBars() {
    if (!el.hudSparkBars) return;
    const curve = [68, 52, 38, 74, 56, 66, 82]; // openness %
    el.hudSparkBars.innerHTML = curve
      .map(
        (v, idx) => `
      <div class="w-2 h-7 bg-washi-200 rounded-sm flex items-end overflow-hidden" title="${8 + idx * 2}:00 空席ゆとり ${v}%">
        <div class="spark-bar w-full ${idx === 3 ? 'bg-moss-500' : 'bg-sumi-700'}" data-h="${v}%" style="height:0%"></div>
      </div>
    `
      )
      .join('');

    setTimeout(() => {
      el.hudSparkBars.querySelectorAll('.spark-bar').forEach((b, i) => {
        setTimeout(() => {
          b.style.height = b.getAttribute('data-h') || '50%';
        }, i * 65);
      });
    }, 180);
  }

  // Generate SVG Pentagon Radar Chart for Bottom Sheet Infographic
  function buildPentagonRadarSVG(spot) {
    const metrics = [
      { label: 'Wi-Fi', val: spot.wifiStability },
      { label: '電源率', val: spot.outletRatio },
      { label: '静寂性', val: spot.quietness },
      { label: '椅子快適', val: spot.chairComfort },
      { label: '珈琲品質', val: spot.coffeeScore }
    ];
    const cx = 95;
    const cy = 92;
    const maxR = 60;

    const pointAt = (idx, pct) => {
      const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
      const r = (pct / 100) * maxR;
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    };

    const gridRings = [35, 70, 100]
      .map((g) => {
        const pts = [0, 1, 2, 3, 4].map((i) => pointAt(i, g)).join(' ');
        return `<polygon points="${pts}" fill="none" stroke="#DCD0BC" stroke-width="1"/>`;
      })
      .join('');

    const axes = [0, 1, 2, 3, 4]
      .map((i) => `<line x1="${cx}" y1="${cy}" x2="${pointAt(i, 100).split(',')[0]}" y2="${pointAt(i, 100).split(',')[1]}" stroke="#DCD0BC" stroke-width="1"/>`)
      .join('');

    const zeroPoly = [0, 1, 2, 3, 4].map(() => `${cx},${cy}`).join(' ');
    const targetPoly = metrics.map((m, i) => pointAt(i, m.val)).join(' ');

    const labels = metrics
      .map((m, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const lx = cx + Math.cos(angle) * (maxR + 20);
        const ly = cy + Math.sin(angle) * (maxR + 16);
        return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="9.5" font-weight="700" fill="#352C26">${m.label}</text>`;
      })
      .join('');

    return `
      <svg viewBox="0 0 190 182" class="w-full max-w-[205px] mx-auto overflow-visible">
        ${gridRings}
        ${axes}
        <polygon id="bs-radar-poly" points="${zeroPoly}" data-target-points="${targetPoly}" fill="rgba(192, 96, 68, 0.24)" stroke="#C06044" stroke-width="2" class="radar-polygon"/>
        ${labels}
      </svg>
    `;
  }

  // =========================================================
  // 4. FREE OPENSTREETMAP + OVERPASS REAL CAFE LAYER
  // =========================================================
  function initMap() {
    if (typeof L === 'undefined') return;

    map = L.map('nomaloft-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([state.lat, state.lng], 15);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 100% Free Official OpenStreetMap Standard Tile Server (No API Key Required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true
    }).addTo(map);

    spotLayer = L.layerGroup().addTo(map);
    osmLiveLayer = L.layerGroup().addTo(map);

    map.on('moveend', () => {
      if (!map || !el.coordsReadout) return;
      const c = map.getCenter();
      el.coordsReadout.textContent = `${c.lat.toFixed(4)}N, ${c.lng.toFixed(4)}E`;
    });

    renderOriginBeacon();
  }

  function renderOriginBeacon() {
    if (!map) return;
    if (userMarker) map.removeLayer(userMarker);
    if (walkCircle) map.removeLayer(walkCircle);

    const beaconIcon = L.divIcon({
      className: 'origin-beacon-wrapper',
      html: `<div class="gps-beacon" title="基準現在地"><div class="gps-beacon-ring"></div><div class="gps-beacon-core"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    userMarker = L.marker([state.lat, state.lng], { icon: beaconIcon, zIndexOffset: 900 }).addTo(map);

    if (state.walkRingVisible) {
      walkCircle = L.circle([state.lat, state.lng], {
        radius: 650,
        color: '#C06044',
        weight: 1.4,
        dashArray: '5 5',
        fillColor: '#EAD296',
        fillOpacity: 0.1
      }).addTo(map);
    }
  }

  function renderMapPins(visibleSpots) {
    if (!map || !spotLayer) return;
    spotLayer.clearLayers();

    visibleSpots.forEach((spot) => {
      const isCowork = spot.category === 'coworking';
      const isActive = spot.id === state.selectedSpotId;

      const pinIcon = L.divIcon({
        className: 'noma-craft-marker',
        html: `
          <div class="craft-pin ${isCowork ? 'craft-pin-cowork' : 'craft-pin-cafe'} ${isActive ? 'is-active' : ''}" data-pin-id="${spot.id}">
            <div class="craft-pin-body">
              <span class="craft-pin-dot"></span>
              <span class="font-mono text-[10px] font-bold">${spot.wifiMbps}M</span>
              <span class="text-[10px] font-bold opacity-80">空${spot.seatsAvailable}</span>
            </div>
            <div class="craft-pin-stem"></div>
          </div>
        `,
        iconSize: [108, 34],
        iconAnchor: [54, 32]
      });

      const m = L.marker([spot.lat, spot.lng], { icon: pinIcon }).addTo(spotLayer);
      m.on('click', () => {
        selectSpot(spot.id, { openSheet: true, fly: true });
      });
    });
  }

  async function toggleOsmLiveCafes() {
    const btn = document.getElementById('osm-live-btn');
    const label = document.getElementById('osm-live-label');
    if (!map || !osmLiveLayer) return;

    if (state.osmLiveActive) {
      state.osmLiveActive = false;
      osmLiveLayer.clearLayers();
      btn?.classList.remove('bg-sumi-900', 'text-washi-50');
      if (label) label.textContent = 'OSM周辺カフェ重畳';
      showToast({ iconSvg: SVG.pin, title: 'OpenStreetMap実在ピン重畳をオフにしました' });
      return;
    }

    if (label) label.textContent = 'OSM取得中...';
    try {
      const center = map.getCenter();
      let nodes = [];

      // Try browser-direct free OpenStreetMap Overpass API first (CORS enabled, zero API key)
      const q = `[out:json][timeout:6];(node["amenity"="cafe"](around:900,${center.lat},${center.lng});node["amenity"="coworking_space"](around:900,${center.lat},${center.lng}););out body 18;`;
      try {
        const directRes = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(q)}`
        });
        if (directRes.ok) {
          const oj = await directRes.json();
          nodes = (oj.elements || [])
            .filter((el) => el.tags && (el.tags['name:ja'] || el.tags.name))
            .slice(0, 16)
            .map((el) => ({
              id: `osm-${el.id}`,
              name: el.tags['name:ja'] || el.tags.name || 'Cafe',
              lat: el.lat,
              lng: el.lon,
              openingHours: el.tags.opening_hours || '営業時間情報なし'
            }));
        }
      } catch (_) {}

      // Fallback to Hono edge proxy if needed
      if (!nodes.length) {
        const res = await fetch(`/api/osm-nearby?lat=${center.lat}&lng=${center.lng}&radius=950`);
        const data = await res.json();
        nodes = data.osmNodes || [];
      }

      osmLiveLayer.clearLayers();
      nodes.forEach((n) => {
        const icon = L.divIcon({
          className: 'osm-node-pin',
          html: `<div class="osm-live-pin"><span class="w-1.5 h-1.5 rounded-full bg-moss-500"></span><span>${n.name.slice(0, 12)}</span></div>`,
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });
        const marker = L.marker([n.lat, n.lng], { icon }).addTo(osmLiveLayer);
        marker.on('click', () => {
          showToast({
            iconSvg: SVG.cup,
            title: `OSM実在スポット: ${n.name}`,
            message: `OpenStreetMap登録データ / ${n.openingHours}`,
            accent: 'moss'
          });
        });
      });

      state.osmLiveActive = true;
      btn?.classList.add('bg-sumi-900', 'text-washi-50');
      if (label) label.textContent = `OSM重畳中 (${nodes.length})`;
      showToast({
        iconSvg: SVG.pin,
        title: `OpenStreetMapから周辺のカフェ ${nodes.length}件を取得しました`,
        message: '緑破線のサブピンがOSMライブ登録店舗です',
        accent: 'moss'
      });
    } catch (_) {
      if (label) label.textContent = 'OSM周辺カフェ重畳';
      showToast({ iconSvg: SVG.pin, title: 'OSMサーバーが一時混雑しています', accent: 'roast' });
    }
  }

  // =========================================================
  // 5. SKELETON SCREEN + FETCH SPOTS + SWIPE CARDS
  // =========================================================
  function setSkeleton(visible) {
    if (!el.skeletonList || !el.cardsList) return;
    el.skeletonList.classList.toggle('hidden', !visible);
    el.cardsList.classList.toggle('hidden', visible);
  }

  async function loadSpots({ showSkeleton = true, minSkeletonMs = 360 } = {}) {
    if (showSkeleton) setSkeleton(true);
    const start = performance.now();

    try {
      const qs = new URLSearchParams({
        lat: String(state.lat),
        lng: String(state.lng),
        category: state.category,
        filter: state.filter,
        q: state.query,
        sort: state.sort,
        jitter: String(state.jitterSeed)
      });

      const res = await fetch(`/api/spots?${qs.toString()}`);
      const data = await res.json();

      const elapsed = performance.now() - start;
      if (showSkeleton && elapsed < minSkeletonMs) {
        await new Promise((r) => setTimeout(r, minSkeletonMs - elapsed));
      }

      state.spots = data.spots || [];
      renderDeckAndMap(data.summary);
      setSkeleton(false);
    } catch (_) {
      setSkeleton(false);
      showToast({ iconSvg: SVG.cup, title: 'データの取得に失敗しました', accent: 'roast' });
    }
  }

  function getDisplayedSpots() {
    if (state.savedOnlyMode) {
      return state.spots.filter((s) => state.savedIds.has(s.id));
    }
    return state.spots;
  }

  function renderDeckAndMap(summary) {
    const list = getDisplayedSpots();
    if (el.spotCountNum) el.spotCountNum.textContent = String(list.length);

    renderSpotCards(list);
    renderMapPins(list);
    if (summary) updateHudInfographics(summary);
  }

  function renderSpotCards(list) {
    if (!el.cardsList) return;

    if (list.length === 0) {
      el.cardsList.innerHTML = `
        <div class="rounded-2xl border border-dashed border-sumi-900/30 bg-washi-50 p-6 text-center space-y-2.5">
          <div class="w-9 h-9 rounded-full bg-washi-200 mx-auto flex items-center justify-center text-sumi-700">${SVG.cup}</div>
          <p class="text-xs font-bold text-sumi-900">該当するワークスポットがありません</p>
          <p class="text-[11px] text-sumi-600">検索条件またはエリアを変更してお試しください。</p>
          <button id="empty-reset-btn" type="button" class="craft-btn px-3 py-1.5 rounded-lg bg-sumi-900 text-washi-50 text-[11px] font-bold">条件をすべて解除</button>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', resetFilters);
      return;
    }

    el.cardsList.innerHTML = list
      .map((spot, idx) => {
        const isSaved = state.savedIds.has(spot.id);
        const isSelected = spot.id === state.selectedSpotId;
        const statusDot =
          spot.crowdLevel <= 35 ? 'bg-moss-500' : spot.crowdLevel <= 58 ? 'bg-brass-500' : 'bg-roast-500';
        const statusText =
          spot.crowdLevel <= 35 ? `空席ゆとり (${spot.seatsAvailable}席)` : `残り ${spot.seatsAvailable}席`;

        return `
        <article class="swipe-card-shell card-stagger-in" style="animation-delay:${idx * 45}ms" data-spot-id="${spot.id}">
          <!-- Swipe Action Reveal Background -->
          <div class="swipe-reveal-layer swipe-reveal-bookmark" data-swipe-bg>
            <span class="inline-flex items-center gap-1.5">${SVG.bookmarkFilled} BOOKMARK</span>
            <span class="inline-flex items-center gap-1.5">CHECK-IN ${SVG.stamp}</span>
          </div>

          <!-- Foreground Index Card -->
          <div class="spot-index-card p-3 ${isSelected ? 'is-selected' : ''}" data-card-fg="${spot.id}">
            <div class="flex gap-3">
              <!-- Architectural Vignette -->
              <div class="relative w-24 h-20 rounded-xl overflow-hidden border border-sumi-900/20 bg-washi-200 shrink-0">
                <img src="${spot.imageUrl}" alt="${spot.name}" loading="lazy" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-sumi-900/85 text-washi-50 font-mono text-[9px] font-bold">
                  ${spot.walkMinFromHere}m歩 / ${spot.distanceMeters >= 1000 ? (spot.distanceMeters / 1000).toFixed(1) + 'km' : spot.distanceMeters + 'm'}
                </span>
              </div>

              <!-- Editorial Metadata -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span class="font-mono text-[9px] tracking-wider uppercase text-sumi-600">${spot.code} · ${spot.categoryLabel}</span>
                  <button
                    type="button"
                    data-bookmark-btn="${spot.id}"
                    class="w-6 h-6 rounded-md flex items-center justify-center ${
                      isSaved ? 'text-roast-500 bg-roast-400/15' : 'text-sumi-600 hover:bg-washi-200'
                    } transition-colors shrink-0"
                    aria-label="ブックマーク保存"
                  >
                    ${isSaved ? SVG.bookmarkFilled : SVG.bookmark}
                  </button>
                </div>

                <h2 class="text-[13px] font-bold text-sumi-900 truncate mt-0.5">${spot.name}</h2>
                <p class="text-[11px] text-sumi-600 truncate">${spot.station} 徒歩${spot.walkMinutes}分 · ${spot.priceRange}</p>
                <p class="text-[11px] text-sumi-800 line-clamp-1 mt-1">${spot.catchcopy}</p>
              </div>
            </div>

            <!-- Precision Telemetry Footer -->
            <div class="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-sumi-900/10 text-[10px] font-medium text-sumi-800">
              <div class="px-2 py-1 rounded-md bg-washi-100 flex items-center justify-center gap-1 font-mono font-bold">
                <span class="text-moss-500">${SVG.bolt}</span>
                <span>${spot.wifiMbps} Mbps</span>
              </div>
              <div class="px-2 py-1 rounded-md bg-washi-100 flex items-center justify-center gap-1">
                <span class="text-roast-500">${SVG.plug}</span>
                <span>電源 <strong class="font-mono">${spot.outletRatio}%</strong></span>
              </div>
              <div class="px-2 py-1 rounded-md bg-washi-100 flex items-center justify-center gap-1.5 truncate">
                <span class="w-1.5 h-1.5 rounded-full ${statusDot} shrink-0"></span>
                <span class="truncate">${statusText}</span>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    bindSwipeAndClickCards();
  }

  // =========================================================
  // 6. SWIPE ACTION GESTURES ON SPOT CARDS
  // =========================================================
  function bindSwipeAndClickCards() {
    document.querySelectorAll('[data-bookmark-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-bookmark-btn');
        if (id) toggleBookmark(id, e.clientX, e.clientY);
      });
    });

    document.querySelectorAll('.spot-index-card').forEach((card) => {
      const spotId = card.getAttribute('data-card-fg');
      const bg = card.parentElement?.querySelector('[data-swipe-bg]');
      let startX = 0;
      let startY = 0;
      let dx = 0;
      let active = false;
      let moved = false;

      const down = (x, y, target) => {
        if (target.closest('button')) return;
        startX = x;
        startY = y;
        dx = 0;
        active = true;
        moved = false;
        card.classList.add('is-dragging');
      };

      const move = (x, y) => {
        if (!active) return;
        const curDx = x - startX;
        const curDy = y - startY;

        if (!moved && Math.abs(curDy) > Math.abs(curDx) && Math.abs(curDy) > 9) {
          active = false;
          card.classList.remove('is-dragging');
          card.style.transform = '';
          return;
        }

        if (Math.abs(curDx) > 9) {
          moved = true;
          dx = Math.max(-120, Math.min(120, curDx));
          card.style.transform = `translateX(${dx}px)`;
          if (bg) {
            bg.className = `swipe-reveal-layer ${dx > 0 ? 'swipe-reveal-bookmark' : 'swipe-reveal-stamp'}`;
          }
        }
      };

      const up = () => {
        if (!active) return;
        active = false;
        card.classList.remove('is-dragging');

        if (dx > 72 && spotId) {
          const r = card.getBoundingClientRect();
          toggleBookmark(spotId, r.left + 50, r.top + 30);
        } else if (dx < -72 && spotId) {
          const r = card.getBoundingClientRect();
          recordCheckIn(spotId, r.right - 50, r.top + 30);
          selectSpot(spotId, { openSheet: true, fly: true });
        } else if (!moved && spotId) {
          selectSpot(spotId, { openSheet: true, fly: true });
        }
        card.style.transform = '';
      };

      card.addEventListener('mousedown', (e) => down(e.clientX, e.clientY, e.target));
      window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
      window.addEventListener('mouseup', up);

      card.addEventListener('touchstart', (e) => down(e.touches[0].clientX, e.touches[0].clientY, e.target), { passive: true });
      card.addEventListener('touchmove', (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
      card.addEventListener('touchend', up);
    });
  }

  function toggleBookmark(spotId, x, y) {
    const spot = state.spots.find((s) => s.id === spotId);
    const existed = state.savedIds.has(spotId);

    if (existed) {
      state.savedIds.delete(spotId);
      showToast({
        iconSvg: SVG.bookmark,
        title: 'ブックマークを解除しました',
        message: spot ? spot.name : '',
        actionLabel: 'UNDO',
        onAction: () => {
          state.savedIds.add(spotId);
          syncSavedCounter();
          renderDeckAndMap();
        }
      });
    } else {
      state.savedIds.add(spotId);
      if (x && y) spawnVectorParticles(x, y);
      showToast({
        iconSvg: SVG.bookmarkFilled,
        title: '関西ワークパスポートに保存しました',
        message: spot ? spot.name : '',
        accent: 'roast'
      });
    }

    syncSavedCounter();
    renderDeckAndMap();
  }

  function syncSavedCounter() {
    if (el.savedBadge) el.savedBadge.textContent = String(state.savedIds.size);
    const icon = document.getElementById('rail-bookmark-svg');
    if (icon) {
      icon.classList.add('scale-125');
      setTimeout(() => icon.classList.remove('scale-125'), 260);
    }
  }

  async function recordCheckIn(spotId, x, y) {
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotId })
      });
      const data = await res.json();
      state.checkedInIds.add(spotId);
      state.beans += data.beansEarned || 15;
      animateNumber(el.beanPoints, state.beans, 500);
      if (x && y) spawnVectorParticles(x, y);
      showToast({
        iconSvg: SVG.stamp,
        title: 'チェックイン・スタンプを押印しました',
        message: data.message,
        accent: 'moss'
      });
    } catch (_) {}
  }

  // =========================================================
  // 7. PULL TO REFRESH (V60 Hand-Drip Pour-Over Animation)
  // =========================================================
  function initPullToRefresh() {
    const scroller = el.scrollContainer;
    const ptr = el.ptrIndicator;
    if (!scroller || !ptr) return;

    let startY = 0;
    let pulling = false;
    let dist = 0;
    const triggerDist = 60;

    const begin = (y) => {
      if (scroller.scrollTop > 2) return;
      startY = y;
      pulling = true;
      dist = 0;
      ptr.classList.remove('ptr-snap', 'drip-active');
    };

    const drag = (y) => {
      if (!pulling) return;
      const diff = y - startY;
      if (diff <= 0) {
        dist = 0;
        ptr.style.height = '0px';
        return;
      }
      dist = Math.min(92, Math.pow(diff, 0.8) * 1.5);
      ptr.style.height = `${dist}px`;
      if (el.ptrText) {
        el.ptrText.textContent =
          dist >= triggerDist ? '離して関西エリアの最新空席を抽出' : '下に引いて最新ステータスをハンドドリップ...';
      }
    };

    const release = async () => {
      if (!pulling) return;
      pulling = false;
      ptr.classList.add('ptr-snap');

      if (dist >= triggerDist) {
        ptr.style.height = '48px';
        ptr.classList.add('drip-active');
        if (el.ptrText) el.ptrText.textContent = '空席・回線テレメトリを更新中...';
        state.jitterSeed += 1;
        await loadSpots({ showSkeleton: true, minSkeletonMs: 480 });
        ptr.classList.remove('drip-active');
        ptr.style.height = '0px';
        showToast({
          iconSvg: SVG.cup,
          title: '最新の空席・実測Wi-Fi状況を更新しました',
          message: `${state.areaLabel} 周辺のリアルタイム集計`,
          accent: 'moss'
        });
      } else {
        ptr.style.height = '0px';
      }
      dist = 0;
    };

    scroller.addEventListener('touchstart', (e) => begin(e.touches[0].clientY), { passive: true });
    scroller.addEventListener('touchmove', (e) => drag(e.touches[0].clientY), { passive: true });
    scroller.addEventListener('touchend', release);

    scroller.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, .spot-index-card')) return;
      begin(e.clientY);
    });
    window.addEventListener('mousemove', (e) => drag(e.clientY));
    window.addEventListener('mouseup', release);
  }

  // =========================================================
  // 8. DRAGGABLE BOTTOM SHEET + INFOGRAPHIC DOSSIER
  // =========================================================
  function selectSpot(spotId, { openSheet = true, fly = true } = {}) {
    state.selectedSpotId = spotId;
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot) return;

    document.querySelectorAll('.spot-index-card').forEach((c) => {
      c.classList.toggle('is-selected', c.getAttribute('data-card-fg') === spotId);
    });
    document.querySelectorAll('.craft-pin').forEach((p) => {
      p.classList.toggle('is-active', p.getAttribute('data-pin-id') === spotId);
    });

    if (fly && map) {
      // Offset latitude slightly south when sheet opens so pin stays clearly visible above sheet in landscape
      const latOffset = openSheet ? -0.0022 : 0;
      map.flyTo([spot.lat + latOffset, spot.lng], 15, { duration: 0.6 });
    }

    if (openSheet) renderAndOpenBottomSheet(spot);
  }

  function renderAndOpenBottomSheet(spot) {
    if (!el.bottomSheet || !el.bsContent || !el.bsBackdrop) return;
    const isSaved = state.savedIds.has(spot.id);
    const isStamped = state.checkedInIds.has(spot.id);
    if (el.bsCodeLabel) el.bsCodeLabel.textContent = `ARCHIVE DOSSIER · ${spot.code} · ${spot.nameEn}`;

    el.bsContent.innerHTML = `
      <!-- Top Architectural Header Row -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-4 relative h-36 md:h-40 rounded-2xl overflow-hidden border border-sumi-900/25 bg-washi-200">
          <img src="${spot.imageUrl}" alt="${spot.name}" class="w-full h-full object-cover" />
          <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-washi-50/95 border border-sumi-900/30 font-mono text-[9px] font-bold tracking-wider">
            ${spot.badge}
          </span>
        </div>

        <div class="md:col-span-8 space-y-2">
          <div class="flex flex-wrap items-center gap-2 text-[11px]">
            <span class="px-2 py-0.5 rounded bg-washi-200 font-bold text-sumi-800">${spot.categoryLabel}</span>
            <span class="text-sumi-600 font-medium">${spot.station} 徒歩${spot.walkMinutes}分（現在地から ${spot.distanceMeters}m）</span>
            <span class="font-mono text-[10px] text-moss-500 font-bold">OPEN ${spot.openHours}</span>
          </div>

          <h2 id="bs-spot-title" class="text-lg sm:text-xl font-bold text-sumi-900 tracking-tight">${spot.name}</h2>
          <p class="text-xs text-sumi-700 leading-relaxed">${spot.description}</p>

          <!-- Perforated Ticket Check-in + Bookmark + Route -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button id="bs-stamp-btn" type="button" class="craft-btn inline-flex items-center rounded-xl overflow-hidden border border-sumi-900 ${
              isStamped ? 'bg-moss-500 text-washi-50' : 'bg-sumi-900 text-washi-50 hover:bg-roast-500'
            } text-xs font-bold transition-colors">
              <span class="px-3.5 py-2 flex items-center gap-1.5">
                ${SVG.stamp}
                <span>${isStamped ? 'チェックイン記録済' : 'チェックイン記録'}</span>
              </span>
              <span class="ticket-stub px-2.5 py-2 font-mono text-[10px] opacity-90">+15</span>
            </button>

            <button id="bs-bookmark-btn" type="button" class="craft-btn px-3.5 py-2 rounded-xl border border-sumi-900 ${
              isSaved ? 'bg-brass-300/70 text-sumi-900' : 'bg-washi-50 text-sumi-900 hover:bg-washi-200'
            } text-xs font-bold inline-flex items-center gap-1.5">
              ${isSaved ? SVG.bookmarkFilled : SVG.bookmark}
              <span>${isSaved ? '保存済み' : 'パスポートに保存'}</span>
            </button>

            <a
              href="https://www.openstreetmap.org/directions?from=${state.lat}%2C${state.lng}&to=${spot.lat}%2C${spot.lng}#map=16/${spot.lat}/${spot.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="craft-btn px-3 py-2 rounded-xl border border-sumi-900/35 bg-washi-100 hover:bg-washi-200 text-xs font-bold text-sumi-800 inline-flex items-center gap-1.5"
            >
              ${SVG.route}
              <span>OSMルート確認</span>
            </a>
          </div>
        </div>
      </div>

      <!-- ANIMATED INFOGRAPHIC SUITE (Pentagon Radar + 4 Precision Bars + Hourly Chart) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-washi-100 border border-sumi-900/15 rounded-2xl p-4">

        <!-- Left: Pentagon Radar Infographic -->
        <div class="md:col-span-4 bg-washi-50 rounded-xl p-3 border border-sumi-900/10 flex flex-col items-center justify-center">
          <div class="w-full flex items-center justify-between text-[10px] font-mono text-sumi-600 mb-1">
            <span>RADAR SPEC</span>
            <span class="font-bold text-sumi-900">SCORE ${spot.nomadScore}/100</span>
          </div>
          ${buildPentagonRadarSVG(spot)}
        </div>

        <!-- Center: 4 Precision Horizontal Telemetry Meters -->
        <div class="md:col-span-4 bg-washi-50 rounded-xl p-3.5 border border-sumi-900/10 flex flex-col justify-between space-y-2.5">
          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>実測回線 (${spot.wifiMbps} Mbps)</span>
              <span class="font-mono text-moss-500">${spot.wifiStability}%</span>
            </div>
            <div class="h-2 rounded-full bg-washi-200 overflow-hidden">
              <div class="bs-meter-bar h-full bg-moss-500 rounded-full" data-w="${spot.wifiStability}%" style="width:0%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>AC・USB電源カバー率</span>
              <span class="font-mono text-roast-500">${spot.outletRatio}%</span>
            </div>
            <div class="h-2 rounded-full bg-washi-200 overflow-hidden">
              <div class="bs-meter-bar h-full bg-roast-500 rounded-full" data-w="${spot.outletRatio}%" style="width:0%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>チェア・机奥行き快適度</span>
              <span class="font-mono">${spot.chairComfort}</span>
            </div>
            <div class="h-2 rounded-full bg-washi-200 overflow-hidden">
              <div class="bs-meter-bar h-full bg-brass-500 rounded-full" data-w="${spot.chairComfort}%" style="width:0%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] font-bold mb-1">
              <span>静寂・集中環境指数</span>
              <span class="font-mono">${spot.quietness}</span>
            </div>
            <div class="h-2 rounded-full bg-washi-200 overflow-hidden">
              <div class="bs-meter-bar h-full bg-sumi-800 rounded-full" data-w="${spot.quietness}%" style="width:0%"></div>
            </div>
          </div>
        </div>

        <!-- Right: Hourly Openness Bar Infographic -->
        <div class="md:col-span-4 bg-washi-50 rounded-xl p-3.5 border border-sumi-900/10 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-sumi-900">時間帯別の空席ゆとり率</span>
            <span class="font-mono text-[10px] text-roast-500 font-bold">残${spot.seatsAvailable}/${spot.totalSeats}席</span>
          </div>
          <div class="h-28 flex items-end justify-between gap-1.5 pt-3">
            ${spot.hourlyStats
              .map((h) => {
                const openPct = 100 - h.crowd;
                return `
                <div class="flex-1 flex flex-col items-center h-full justify-end">
                  <span class="font-mono text-[9px] text-sumi-600 mb-0.5">${openPct}</span>
                  <div class="w-full h-16 bg-washi-200/80 rounded-t flex items-end overflow-hidden">
                    <div class="bs-hourly-bar w-full rounded-t ${
                      openPct >= 65 ? 'bg-moss-500' : 'bg-sumi-700'
                    }" data-h="${openPct}%" style="height:0%"></div>
                  </div>
                  <span class="font-mono text-[9px] text-sumi-700 mt-1">${h.hour.replace('h', '')}</span>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>

      <!-- Pairing Coffee & Call Policy + Field Notes -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div class="md:col-span-5 bg-washi-50 border border-sumi-900/15 rounded-xl p-3 flex items-center gap-3">
          <img src="${spot.subImageUrl}" alt="${spot.signatureDrink}" class="w-14 h-14 rounded-lg object-cover border border-sumi-900/20 shrink-0" />
          <div class="min-w-0">
            <span class="font-mono text-[9px] uppercase tracking-wider text-roast-500 font-bold">SIGNATURE PAIRING</span>
            <div class="text-xs font-bold text-sumi-900 truncate">${spot.signatureDrink}</div>
            <div class="font-mono text-[11px] text-sumi-600">${spot.signaturePrice} · ${spot.callLabel}</div>
          </div>
        </div>

        <div class="md:col-span-7 bg-washi-50 border border-sumi-900/15 rounded-xl p-3 space-y-2">
          <div class="flex flex-wrap gap-1">
            ${spot.tags.map((t) => `<span class="px-2 py-0.5 rounded bg-washi-200/70 text-[10px] font-medium text-sumi-800">#${t}</span>`).join('')}
          </div>
          ${spot.reviews
            .slice(0, 1)
            .map(
              (r) => `
            <div class="flex items-start gap-2 pt-1 border-t border-sumi-900/10">
              <span class="w-6 h-6 rounded-full bg-sumi-900 text-washi-50 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">${r.initials}</span>
              <p class="text-[11px] text-sumi-700 leading-snug"><strong class="text-sumi-900">${r.author} (${r.role}):</strong> ${r.comment}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    state.sheetExpanded = false;
    el.bottomSheet.style.maxHeight = '62%';
    if (el.bsExpandBtn) el.bsExpandBtn.textContent = '拡大表示';
    el.bsBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    el.bottomSheet.classList.remove('translate-y-full');
    el.bottomSheet.style.transform = 'translateY(0px)';

    // Trigger Infographic Animations inside Bottom Sheet
    setTimeout(() => {
      const poly = document.getElementById('bs-radar-poly');
      if (poly) {
        poly.setAttribute('points', poly.getAttribute('data-target-points') || '');
      }
      el.bsContent.querySelectorAll('.bs-meter-bar').forEach((b) => {
        b.style.width = b.getAttribute('data-w') || '80%';
      });
      el.bsContent.querySelectorAll('.bs-hourly-bar').forEach((b, i) => {
        setTimeout(() => {
          b.style.height = b.getAttribute('data-h') || '50%';
        }, i * 55);
      });
    }, 80);

    document.getElementById('bs-stamp-btn')?.addEventListener('click', (e) => {
      recordCheckIn(spot.id, e.clientX, e.clientY);
      renderAndOpenBottomSheet(spot);
    });
    document.getElementById('bs-bookmark-btn')?.addEventListener('click', (e) => {
      toggleBookmark(spot.id, e.clientX, e.clientY);
      renderAndOpenBottomSheet(spot);
    });
  }

  function closeBottomSheet() {
    if (!el.bottomSheet || !el.bsBackdrop) return;
    el.bsBackdrop.classList.add('opacity-0', 'pointer-events-none');
    el.bottomSheet.style.transform = '';
    el.bottomSheet.classList.add('translate-y-full');
  }

  function initBottomSheetDrag() {
    el.bsCloseBtn?.addEventListener('click', closeBottomSheet);
    el.bsBackdrop?.addEventListener('click', closeBottomSheet);

    el.bsExpandBtn?.addEventListener('click', () => {
      if (!el.bottomSheet) return;
      state.sheetExpanded = !state.sheetExpanded;
      el.bottomSheet.style.maxHeight = state.sheetExpanded ? '90%' : '62%';
      el.bsExpandBtn.textContent = state.sheetExpanded ? '標準サイズ' : '拡大表示';
    });

    const handle = el.bsDragHandle;
    if (!handle || !el.bottomSheet) return;

    let startY = 0;
    let dy = 0;
    let dragging = false;

    const start = (y) => {
      startY = y;
      dy = 0;
      dragging = true;
      el.bottomSheet.style.transition = 'none';
    };
    const move = (y) => {
      if (!dragging) return;
      dy = y - startY;
      if (dy > 0) {
        el.bottomSheet.style.transform = `translateY(${dy}px)`;
      } else if (dy < -35) {
        state.sheetExpanded = true;
        el.bottomSheet.style.maxHeight = '90%';
        if (el.bsExpandBtn) el.bsExpandBtn.textContent = '標準サイズ';
      }
    };
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.bottomSheet.style.transition = '';
      if (dy > 95) {
        closeBottomSheet();
      } else {
        el.bottomSheet.style.transform = 'translateY(0px)';
      }
    };

    handle.addEventListener('touchstart', (e) => start(e.touches[0].clientY), { passive: true });
    handle.addEventListener('touchmove', (e) => move(e.touches[0].clientY), { passive: true });
    handle.addEventListener('touchend', end);

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      start(e.clientY);
    });
    window.addEventListener('mousemove', (e) => move(e.clientY));
    window.addEventListener('mouseup', end);
  }

  // =========================================================
  // 9. AUTO COMPLETE SEARCH
  // =========================================================
  let acTimer = null;

  function highlightQuery(str, q) {
    if (!q) return str;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return str.replace(new RegExp(`(${esc})`, 'gi'), '<mark class="bg-brass-300 text-sumi-900 px-0.5 rounded font-bold">$1</mark>');
  }

  async function fetchAutocomplete(q) {
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      state.autocompleteItems = data.suggestions || [];
      state.acActiveIndex = -1;
      renderAutocomplete(q);
    } catch (_) {}
  }

  function renderAutocomplete(q) {
    if (!el.acDropdown || !el.acList) return;
    if (!state.autocompleteItems.length) {
      el.acDropdown.classList.add('hidden');
      el.searchInput?.setAttribute('aria-expanded', 'false');
      return;
    }

    if (el.acCount) el.acCount.textContent = `${state.autocompleteItems.length}`;

    el.acList.innerHTML = state.autocompleteItems
      .map((item, idx) => {
        const iconMarkup = SVG[item.iconType] || SVG.cup;
        return `
        <li
          role="option"
          data-ac-idx="${idx}"
          class="ac-row px-3 py-2 flex items-center gap-2.5 cursor-pointer transition-colors ${
            idx === state.acActiveIndex ? 'bg-brass-300/60' : 'hover:bg-washi-200/70'
          }"
        >
          <span class="w-7 h-7 rounded-lg bg-washi-100 border border-sumi-900/15 flex items-center justify-center text-sumi-800 shrink-0">
            ${iconMarkup}
          </span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-sumi-900 truncate">${highlightQuery(item.label, q)}</div>
            <div class="text-[10px] text-sumi-600 truncate">${item.sub}</div>
          </div>
          <span class="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-washi-200 text-sumi-700 shrink-0">
            ${item.type === 'spot' ? 'OPEN' : item.type === 'area' ? 'JUMP' : 'TAG'}
          </span>
        </li>
      `;
      })
      .join('');

    el.acDropdown.classList.remove('hidden');
    el.searchInput?.setAttribute('aria-expanded', 'true');

    el.acList.querySelectorAll('.ac-row').forEach((li) => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const i = parseInt(li.getAttribute('data-ac-idx') || '0', 10);
        chooseAutocompleteItem(state.autocompleteItems[i]);
      });
    });
  }

  function chooseAutocompleteItem(item) {
    if (!item) return;
    el.acDropdown?.classList.add('hidden');
    el.searchInput?.setAttribute('aria-expanded', 'false');

    if (item.type === 'spot' && item.spotId) {
      state.query = '';
      if (el.searchInput) el.searchInput.value = item.label;
      el.clearSearchBtn?.classList.remove('hidden');
      loadSpots({ showSkeleton: false }).then(() => {
        selectSpot(item.spotId, { openSheet: true, fly: true });
      });
      return;
    }

    if (item.type === 'area' && item.areaId && KANSAI_AREA_COORDS[item.areaId]) {
      jumpToKansaiArea(item.areaId);
      return;
    }

    state.query = item.query;
    if (el.searchInput) el.searchInput.value = item.query;
    el.clearSearchBtn?.classList.remove('hidden');
    loadSpots({ showSkeleton: true });
  }

  function initAutocomplete() {
    if (!el.searchInput) return;

    el.searchInput.addEventListener('focus', () => {
      fetchAutocomplete(el.searchInput.value.trim());
    });

    el.searchInput.addEventListener('input', () => {
      const val = el.searchInput.value.trim();
      el.clearSearchBtn?.classList.toggle('hidden', !val);
      clearTimeout(acTimer);
      acTimer = setTimeout(() => {
        state.query = val;
        fetchAutocomplete(val);
        loadSpots({ showSkeleton: false });
      }, 150);
    });

    el.searchInput.addEventListener('keydown', (e) => {
      const len = state.autocompleteItems.length;
      if (e.key === 'ArrowDown' && len > 0) {
        e.preventDefault();
        state.acActiveIndex = (state.acActiveIndex + 1) % len;
        renderAutocomplete(el.searchInput.value.trim());
      } else if (e.key === 'ArrowUp' && len > 0) {
        e.preventDefault();
        state.acActiveIndex = (state.acActiveIndex - 1 + len) % len;
        renderAutocomplete(el.searchInput.value.trim());
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.acActiveIndex >= 0 && state.autocompleteItems[state.acActiveIndex]) {
          chooseAutocompleteItem(state.autocompleteItems[state.acActiveIndex]);
        } else {
          state.query = el.searchInput.value.trim();
          el.acDropdown?.classList.add('hidden');
          loadSpots({ showSkeleton: true });
        }
      } else if (e.key === 'Escape') {
        el.acDropdown?.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#autocomplete-wrapper')) {
        el.acDropdown?.classList.add('hidden');
      }
    });

    el.clearSearchBtn?.addEventListener('click', () => {
      el.searchInput.value = '';
      state.query = '';
      el.clearSearchBtn.classList.add('hidden');
      loadSpots({ showSkeleton: true });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
      }
    });
  }

  // =========================================================
  // 10. KANSAI RAIL, FILTERS, AMBIENCE SYNTH, TIMER & CURSOR
  // =========================================================
  function jumpToKansaiArea(areaId) {
    const target = KANSAI_AREA_COORDS[areaId];
    if (!target) return;

    state.areaId = areaId;
    state.lat = target.lat;
    state.lng = target.lng;
    state.areaLabel = target.label;
    state.savedOnlyMode = false;

    if (el.areaCaption) el.areaCaption.textContent = `${target.label} — 徒歩圏フィールドノート`;

    document.querySelectorAll('.rail-area-btn').forEach((btn) => {
      const active = btn.getAttribute('data-area') === areaId;
      btn.className = `rail-area-btn group w-12 py-2 rounded-xl border flex flex-col items-center gap-0.5 transition-all ${
        active
          ? 'border-sumi-900 bg-sumi-900 text-washi-50'
          : 'border-transparent hover:border-sumi-900/30 bg-washi-50/70 text-sumi-800'
      }`;
    });

    closeBottomSheet();
    renderOriginBeacon();
    if (map) map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.75 });
    loadSpots({ showSkeleton: true });

    showToast({
      iconSvg: SVG.pin,
      title: `${target.label} へ移動しました`,
      message: '基準座標からの徒歩距離順で再計算しています'
    });
  }

  function resetFilters() {
    state.category = 'all';
    state.filter = '';
    state.query = '';
    state.savedOnlyMode = false;
    if (el.searchInput) el.searchInput.value = '';
    el.clearSearchBtn?.classList.add('hidden');

    document.querySelectorAll('.cat-pill').forEach((b) => {
      const on = b.getAttribute('data-cat') === 'all';
      b.className = `cat-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
        on ? 'border-sumi-900 bg-sumi-900 text-washi-50' : 'border-sumi-900/25 bg-washi-50 text-sumi-800 hover:border-sumi-900'
      }`;
    });
    document.querySelectorAll('.cond-pill').forEach((b) => {
      b.classList.remove('bg-brass-300/75', 'border-sumi-900', 'font-bold');
      b.classList.add('bg-washi-100', 'border-sumi-900/20');
    });

    loadSpots({ showSkeleton: true });
  }

  function initControls() {
    // Kansai Rail Buttons
    document.querySelectorAll('.rail-area-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-area');
        if (id) jumpToKansaiArea(id);
      });
    });

    // Category Pills
    document.querySelectorAll('.cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.savedOnlyMode = false;
        state.category = btn.getAttribute('data-cat') || 'all';
        document.querySelectorAll('.cat-pill').forEach((b) => {
          const on = b === btn;
          b.className = `cat-pill shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
            on ? 'border-sumi-900 bg-sumi-900 text-washi-50' : 'border-sumi-900/25 bg-washi-50 text-sumi-800 hover:border-sumi-900'
          }`;
        });
        loadSpots({ showSkeleton: true });
      });
    });

    // Condition Pills
    document.querySelectorAll('.cond-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter') || '';
        state.filter = state.filter === f ? '' : f;
        document.querySelectorAll('.cond-pill').forEach((b) => {
          const on = b.getAttribute('data-filter') === state.filter;
          b.classList.toggle('bg-brass-300/75', on);
          b.classList.toggle('border-sumi-900', on);
          b.classList.toggle('font-bold', on);
          b.classList.toggle('bg-washi-100', !on);
          b.classList.toggle('border-sumi-900/20', !on);
        });
        loadSpots({ showSkeleton: true });
      });
    });

    // Sort Select
    el.sortSelect?.addEventListener('change', () => {
      state.sort = el.sortSelect.value;
      loadSpots({ showSkeleton: true, minSkeletonMs: 280 });
    });

    // Deck Manual Refresh
    document.getElementById('deck-refresh-btn')?.addEventListener('click', async () => {
      const icon = document.getElementById('deck-refresh-svg');
      icon?.classList.add('rotate-180');
      state.jitterSeed += 1;
      await loadSpots({ showSkeleton: true, minSkeletonMs: 440 });
      setTimeout(() => icon?.classList.remove('rotate-180'), 450);
      showToast({ iconSvg: SVG.cup, title: '関西スポットの空席・回線状況を更新しました', accent: 'moss' });
    });

    // GPS Locate Me (Falls back gracefully to Osaka Umeda/Kitahama if outside Kansai or denied)
    el.locateMeBtn?.addEventListener('click', () => {
      if (!navigator.geolocation) {
        jumpToKansaiArea('kitahama');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.lat = pos.coords.latitude;
          state.lng = pos.coords.longitude;
          state.areaLabel = 'GPS現在地周辺';
          if (el.areaCaption) el.areaCaption.textContent = 'GPS測位完了 — 現在地から近い順に表示中';
          renderOriginBeacon();
          if (map) map.flyTo([state.lat, state.lng], 14, { duration: 0.8 });
          loadSpots({ showSkeleton: true });
          showToast({ iconSvg: SVG.pin, title: '現在地座標を取得しました', accent: 'moss' });
        },
        () => {
          // Graceful fallback to Osaka Nakanoshima / Umeda midpoint
          state.lat = 34.6985;
          state.lng = 135.5028;
          state.areaLabel = '大阪・中之島〜梅田中間（デモ現在地）';
          if (el.areaCaption) el.areaCaption.textContent = '大阪・中之島〜梅田 — デモ基準座標でスキャン中';
          renderOriginBeacon();
          if (map) map.flyTo([state.lat, state.lng], 14, { duration: 0.7 });
          loadSpots({ showSkeleton: true });
          showToast({
            iconSvg: SVG.pin,
            title: '大阪キタ（中之島・梅田）を基準地に設定しました',
            message: '位置情報オフ環境でも全機能をお使いいただけます'
          });
        },
        { timeout: 4500 }
      );
    });

    // Map Tone Switcher (Warm Washi vs Standard Raw OpenStreetMap)
    document.getElementById('map-tone-btn')?.addEventListener('click', () => {
      state.washiMapTone = !state.washiMapTone;
      el.mapContainer?.classList.toggle('washi-map-filter', state.washiMapTone);
      el.mapContainer?.classList.toggle('raw-osm-filter', !state.washiMapTone);
      const lbl = document.getElementById('map-tone-label');
      if (lbl) lbl.textContent = state.washiMapTone ? '和紙マップ' : '標準OSM';
      showToast({
        iconSvg: SVG.pin,
        title: state.washiMapTone ? '和紙トーン地図に切り替えました' : '標準OpenStreetMap配色に切り替えました'
      });
    });

    // 650m Walk Circle Toggle
    document.getElementById('walk-ring-btn')?.addEventListener('click', (e) => {
      state.walkRingVisible = !state.walkRingVisible;
      e.currentTarget.classList.toggle('bg-brass-300/70', state.walkRingVisible);
      renderOriginBeacon();
    });

    // Live OSM Overpass Button
    document.getElementById('osm-live-btn')?.addEventListener('click', toggleOsmLiveCafes);

    // Saved Passbook Toggle
    document.getElementById('saved-filter-btn')?.addEventListener('click', (e) => {
      state.savedOnlyMode = !state.savedOnlyMode;
      e.currentTarget.classList.toggle('bg-roast-500', state.savedOnlyMode);
      e.currentTarget.classList.toggle('text-washi-50', state.savedOnlyMode);
      renderDeckAndMap();
      showToast({
        iconSvg: SVG.bookmarkFilled,
        title: state.savedOnlyMode ? `保存済みスポット (${state.savedIds.size}件) を表示中` : '全スポット表示に戻しました',
        accent: 'roast'
      });
    });

    // Playful Roast Recommendation Diagnosis on Brand Cup Click
    document.getElementById('brand-roast-fortune-btn')?.addEventListener('click', (e) => {
      const notes = [
        '本日のおすすめ席: 北浜のリバーサイド東向きカウンター。浅煎りエチオピアと相性抜群の集中日和です。',
        '本日のおすすめ席: 京都・烏丸御池の坪庭が見える杉一枚板デスク。設計や執筆が深く進む一日。',
        '本日のおすすめ席: 中崎町の木造長屋2階ロフト。静かな午後にアイデアがまとまる予感。'
      ];
      const msg = notes[Math.floor(Math.random() * notes.length)];
      spawnVectorParticles(e.clientX, e.clientY);
      showToast({
        iconSvg: SVG.cup,
        title: '本日の関西ワークロフト診断',
        message: msg,
        duration: 4600
      });
    });

    // Portrait hint dismiss
    document.getElementById('dismiss-portrait-hint')?.addEventListener('click', () => {
      document.getElementById('portrait-hint')?.remove();
    });
  }

  // Web Audio API Warm Cafe Room Murmur
  function initAmbienceSynth() {
    const btn = document.getElementById('ambience-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!state.ambienceOn) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!state.audioCtx) state.audioCtx = new AC();
        const ctx = state.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const len = 2 * ctx.sampleRate;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const out = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          out[i] = (last + 0.02 * w) / 1.02;
          last = out[i];
          out[i] *= 0.16;
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 380;

        const gain = ctx.createGain();
        gain.gain.value = 0.16;

        src.connect(lp);
        lp.connect(gain);
        gain.connect(ctx.destination);
        src.start(0);

        state.ambienceNodes = [src, gain];
        state.ambienceOn = true;
        btn.classList.add('bg-sumi-900', 'text-washi-50');
        showToast({
          iconSvg: SVG.cup,
          title: '喫茶室の環境音アンビエントを再生中',
          message: '穏やかなローパス・ルームノイズで集中をサポートします',
          accent: 'moss'
        });
      } else {
        state.ambienceNodes.forEach((n) => {
          try {
            if (n.stop) n.stop();
            n.disconnect();
          } catch (_) {}
        });
        state.ambienceNodes = [];
        state.ambienceOn = false;
        btn.classList.remove('bg-sumi-900', 'text-washi-50');
        showToast({ iconSvg: SVG.cup, title: '環境音アンビエントを停止しました' });
      }
    });
  }

  // 25-Min Focus Timer Drawer
  function initFocusTimer() {
    const drawer = document.getElementById('pomo-drawer');
    const openBtn = document.getElementById('pomo-popover-btn');
    const closeBtn = document.getElementById('pomo-close-btn');
    const toggleBtn = document.getElementById('pomo-toggle-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');
    const display = document.getElementById('pomo-timer-display');
    const status = document.getElementById('pomo-status-text');

    const drawClock = () => {
      const m = String(Math.floor(state.pomoSeconds / 60)).padStart(2, '0');
      const s = String(state.pomoSeconds % 60).padStart(2, '0');
      if (display) display.textContent = `${m}:${s}`;
    };

    openBtn?.addEventListener('click', () => {
      drawer?.classList.toggle('hidden');
    });
    closeBtn?.addEventListener('click', () => {
      drawer?.classList.add('hidden');
    });

    toggleBtn?.addEventListener('click', () => {
      state.pomoRunning = !state.pomoRunning;
      if (state.pomoRunning) {
        toggleBtn.textContent = 'PAUSE';
        if (status) status.textContent = 'BREWING FOCUS...';
        state.pomoInterval = setInterval(() => {
          if (state.pomoSeconds > 0) {
            state.pomoSeconds -= 1;
            drawClock();
          } else {
            clearInterval(state.pomoInterval);
            state.pomoRunning = false;
            toggleBtn.textContent = 'START';
            state.beans += 25;
            animateNumber(el.beanPoints, state.beans);
            showToast({
              iconSvg: SVG.stamp,
              title: '25分間の集中セッションが完了しました',
              message: 'Roast Stamp +25 を記録しました',
              accent: 'moss'
            });
          }
        }, 1000);
      } else {
        clearInterval(state.pomoInterval);
        toggleBtn.textContent = 'RESUME';
        if (status) status.textContent = 'PAUSED';
      }
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(state.pomoInterval);
      state.pomoRunning = false;
      state.pomoSeconds = 25 * 60;
      drawClock();
      if (toggleBtn) toggleBtn.textContent = 'START';
      if (status) status.textContent = 'ROAST FOCUS TIMER';
    });
  }

  // Subtle Tactile Cursor Follower (Desktop Only, Zero Emojis)
  function initCraftCursor() {
    const cur = document.getElementById('craft-cursor');
    if (!cur || window.matchMedia('(pointer: coarse)').matches) return;

    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cur.classList.remove('opacity-0');

      const onCard = e.target.closest('.spot-index-card');
      const onPin = e.target.closest('.craft-pin');

      if (onCard) {
        cur.textContent = 'SWIPE';
        cur.style.width = '46px';
        cur.style.height = '22px';
        cur.style.borderRadius = '999px';
        cur.style.backgroundColor = 'rgba(234, 210, 150, 0.85)';
      } else if (onPin) {
        cur.textContent = 'OPEN';
        cur.style.width = '42px';
        cur.style.height = '22px';
        cur.style.borderRadius = '999px';
        cur.style.backgroundColor = 'rgba(252, 249, 244, 0.92)';
      } else {
        cur.textContent = '';
        cur.style.width = '22px';
        cur.style.height = '22px';
        cur.style.borderRadius = '999px';
        cur.style.backgroundColor = 'rgba(212, 178, 103, 0.18)';
      }
    });

    function step() {
      cx += (tx - cx) * 0.24;
      cy += (ty - cy) * 0.24;
      cur.style.transform = `translate3d(${cx - cur.offsetWidth / 2}px, ${cy - cur.offsetHeight / 2}px, 0)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // =========================================================
  // BOOTSTRAP
  // =========================================================
  document.addEventListener('DOMContentLoaded', async () => {
    initKineticTypography();
    initCraftCursor();
    initMap();
    initHudSparkBars();
    initAutocomplete();
    initPullToRefresh();
    initBottomSheetDrag();
    initControls();
    initAmbienceSynth();
    initFocusTimer();

    await loadSpots({ showSkeleton: true, minSkeletonMs: 520 });

    setTimeout(() => {
      showToast({
        iconSvg: SVG.cup,
        title: 'NomaLoft KANSAI — 大阪・京都・神戸フィールド版',
        message: '左レールで街を切替、カードの左右スワイプやピン選択で詳細図鑑が開きます。'
      });
    }, 600);
  });
})();
