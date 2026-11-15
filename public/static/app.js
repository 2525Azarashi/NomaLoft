/* =========================================================================
   NomaLoft — Improved UI/UX & Cute Warm Cafe Map Application (app.js)
   - Clustering Plugin: Leaflet.markercluster (v1.5.3)
   - Zero Default Unicode Emojis (100% Rounded Line-Art & Custom SVGs)
   ========================================================================= */

(function () {
  'use strict';

  // =========================================================================
  // 1. CUSTOM SVG ASSETS (Cup Mascot 4 Expressions, Mug/Bean Pins, Line Icons)
  // =========================================================================

  /**
   * Cup Mascot Character SVG ("コーヒー好きの小さな動物たちが営む街のカフェ" — Latte-ear Cup)
   * @param {'normal'|'happy'|'loading'|'sad'} mood
   */
  function getMascotSVG(mood = 'normal') {
    const steamMarkup =
      mood === 'loading'
        ? `<path class="sway-steam" d="M14 9 C13 6 16 5 15 2.2" stroke="#E67645" stroke-width="1.8" stroke-linecap="round" fill="none"/>
           <path class="sway-steam-delay" d="M21 9.5 C20 6.5 23 5.5 22 2.8" stroke="#D8A47F" stroke-width="1.8" stroke-linecap="round" fill="none"/>`
        : mood === 'sad'
        ? `<path d="M17.5 9.5 C17.5 7.8 18.5 7.2 18.2 6" stroke="#C5B4A5" stroke-width="1.5" stroke-linecap="round" fill="none"/>`
        : `<path class="sway-steam" d="M15 8.5 C14.2 6.2 16.5 5.2 15.8 3" stroke="#E67645" stroke-width="1.6" stroke-linecap="round" fill="none"/>
           <path class="sway-steam-delay" d="M20.8 9 C20 6.8 22.2 5.8 21.5 3.6" stroke="#D8A47F" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;

    // Simple dot eyes & tiny mouth per expression
    let faceMarkup = '';
    if (mood === 'happy') {
      faceMarkup = `
        <path d="M12.8 22.2 Q14.2 20.3 15.6 22.2" stroke="#36261C" stroke-width="1.7" stroke-linecap="round" fill="none"/>
        <path d="M20.4 22.2 Q21.8 20.3 23.2 22.2" stroke="#36261C" stroke-width="1.7" stroke-linecap="round" fill="none"/>
        <ellipse cx="11.5" cy="24.2" rx="1.7" ry="1" fill="#F4A4B8" opacity="0.75"/>
        <ellipse cx="24.5" cy="24.2" rx="1.7" ry="1" fill="#F4A4B8" opacity="0.75"/>
        <path d="M16.3 24.2 Q18 26.2 19.7 24.2" stroke="#36261C" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      `;
    } else if (mood === 'sad') {
      faceMarkup = `
        <line x1="12.5" y1="20.2" x2="15.2" y2="19.4" stroke="#36261C" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="23.5" y1="20.2" x2="20.8" y2="19.4" stroke="#36261C" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="14.2" cy="22.3" r="1.35" fill="#36261C"/>
        <circle cx="21.8" cy="22.3" r="1.35" fill="#36261C"/>
        <path d="M16.6 25.6 Q18 24.3 19.4 25.6" stroke="#36261C" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      `;
    } else {
      faceMarkup = `
        <circle cx="14.2" cy="22.2" r="1.45" fill="#36261C"/>
        <circle cx="21.8" cy="22.2" r="1.45" fill="#36261C"/>
        <ellipse cx="11.8" cy="24" rx="1.5" ry="0.95" fill="#F4A4B8" opacity="0.6"/>
        <ellipse cx="24.2" cy="24" rx="1.5" ry="0.95" fill="#F4A4B8" opacity="0.6"/>
        <path d="M16.8 24.2 Q18 25.4 19.2 24.2" stroke="#36261C" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      `;
    }

    return `
      <svg viewBox="0 0 38 36" class="w-full h-full overflow-visible">
        ${steamMarkup}
        <!-- Subtle Bear-Latte Foam Ears -->
        <circle cx="12" cy="13.2" r="3" fill="#F5DEC4" stroke="#36261C" stroke-width="1.6"/>
        <circle cx="24" cy="13.2" r="3" fill="#F5DEC4" stroke="#36261C" stroke-width="1.6"/>
        <!-- Cup Body -->
        <path d="M8 14.5 H28 V23.5 C28 28.8 23.5 32.5 18 32.5 C12.5 32.5 8 28.8 8 23.5 Z" fill="#FFFFFF" stroke="#36261C" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M28 17 H30.8 C32.9 17 34.2 18.5 34.2 20.4 C34.2 22.3 32.9 23.8 30.8 23.8 H28" fill="none" stroke="#36261C" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse cx="18" cy="14.6" rx="9.6" ry="2.2" fill="#E8C6A0" stroke="#36261C" stroke-width="1.4"/>
        ${faceMarkup}
      </svg>
    `;
  }

  // Rounded Line Icons & Map Pin Glyphs (Zero Default Emojis)
  const SVG = {
    mugIcon: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5h9.5v5.2a4.7 4.7 0 0 1-9.5 0V6.5z" fill="currentColor" fill-opacity="0.18"/><path d="M13.5 7.8h1.6a2.1 2.1 0 0 1 0 4.2h-1.6"/></svg>`,
    beanIcon: `<svg viewBox="0 0 20 20" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><ellipse cx="10" cy="10" rx="4.8" ry="6.6" transform="rotate(-25 10 10)"/><path d="M8 4.8c1.6 2.6.9 6.6 4 9.8"/></svg>`,
    clusterSteam: `<svg viewBox="0 0 20 10" class="w-3.5 h-2 text-[#E67645]" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 8.5c-.6-2 1.2-3 .6-5M11 8.5c-.6-2 1.2-3 .6-5M15.5 8.5c-.5-1.6 1-2.5.5-4"/></svg>`,
    floatHeart: `<svg viewBox="0 0 20 20" class="w-full h-full"><path d="M10 17.2s-6.5-4.1-6.5-8.6A3.7 3.7 0 0 1 10 6.2a3.7 3.7 0 0 1 6.5 2.4c0 4.5-6.5 8.6-6.5 8.6z" fill="#F48FB1" stroke="#FFFFFF" stroke-width="1.4"/></svg>`,
    plug: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 2.5v3.2M11.5 2.5v3.2M4.5 5.7h9v2.8a4.5 4.5 0 0 1-9 0V5.7zM9 13v2.8"/></svg>`,
    wifi: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.4 7a10.2 10.2 0 0 1 13.2 0M5.2 10a6.3 6.3 0 0 1 7.6 0M8.8 13h.4"/></svg>`,
    minus: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="6.3"/><line x1="6.2" y1="9" x2="11.8" y2="9"/></svg>`,
    globe: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="9" cy="9" r="6.6"/><path d="M2.6 9h12.8M9 2.4c2 2 2 11.2 0 13.2M9 2.4c-2 2-2 11.2 0 13.2"/></svg>`,
    insta: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="2.6" width="12.8" height="12.8" rx="3.8"/><circle cx="9" cy="9" r="2.9"/><circle cx="12.8" cy="5.2" r="0.7" fill="currentColor"/></svg>`,
    xLogo: `<svg viewBox="0 0 18 18" class="w-3 h-3 shrink-0" fill="currentColor"><path d="M13.6 2.8h2.2l-4.8 5.5 5.6 7h-4.4l-3.4-4.5-3.9 4.5H2.7l5.1-5.8L2.4 2.8h4.5l3.1 4.1 3.6-4.1zm-.8 11.2h1.2L6.2 4H4.9l7.9 10z"/></svg>`,
    route: `<svg viewBox="0 0 18 18" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3,9 15,3 9,15 8,10 3,9"/></svg>`,
    bookmark: `<svg viewBox="0 0 18 18" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3h9a1 1 0 0 1 1 1v11.5L9 12.4l-5.5 3.1V4a1 1 0 0 1 1-1z"/></svg>`,
    bookmarkFill: `<svg viewBox="0 0 18 18" class="w-4 h-4 shrink-0" fill="currentColor"><path d="M4.5 3h9a1 1 0 0 1 1 1v11.5L9 12.4l-5.5 3.1V4a1 1 0 0 1 1-1z"/></svg>`
  };

  // =========================================================================
  // 2. APPLICATION STATE
  // =========================================================================
  const state = {
    lat: 34.6935,
    lng: 135.5025,
    region: 'all',
    boundsFilterActive: false,
    currentBounds: null,
    powerOnly: false,
    wifiOnly: false,
    coworkOnly: false,
    savedOnly: false,
    query: '',
    sort: 'distance',
    spots: [],
    selectedId: null,
    hoveredId: null,
    savedIds: new Set(['kth-brooklyn-kitahama', 'umd-onthe-umeda', 'kyt-fabcafe-kyoto']),
    acItems: [],
    acIndex: -1,
    sheetExpanded: false,
    programmaticMove: false
  };

  const REGION_COORDS = {
    all: { lat: 34.715, lng: 135.505, zoom: 11 },
    imakoko: { lat: 34.6935, lng: 135.5025, zoom: 15 },
    umeda: { lat: 34.7042, lng: 135.4992, zoom: 15 },
    kitahama: { lat: 34.6898, lng: 135.5038, zoom: 15 },
    shinsaibashi: { lat: 34.6708, lng: 135.4992, zoom: 15 },
    tennoji: { lat: 34.6476, lng: 135.5145, zoom: 15 },
    kyoto: { lat: 35.0048, lng: 135.7635, zoom: 14 },
    kobe: { lat: 34.6902, lng: 135.1915, zoom: 15 },
    hanshin: { lat: 34.7415, lng: 135.3485, zoom: 13 },
    nara: { lat: 34.6838, lng: 135.8185, zoom: 14 }
  };

  // --- Map & Cluster Instances ---
  let map = null;
  let originMarker = null;
  let clusterGroup = null;
  const markerById = new Map();

  // --- DOM References ---
  const dom = {
    mapEl: document.getElementById('nomaloft-map'),
    headerMascotSvg: document.getElementById('header-mascot-svg'),
    loadingMascotSlot: document.getElementById('loading-mascot-slot'),
    ptrMascotSlot: document.getElementById('ptr-mascot-slot'),
    kineticConcept: document.getElementById('kinetic-concept'),
    searchInput: document.getElementById('search-input'),
    clearQBtn: document.getElementById('clear-q-btn'),
    acPanel: document.getElementById('ac-panel'),
    acList: document.getElementById('ac-list'),
    filterPowerBtn: document.getElementById('filter-power-btn'),
    filterWifiBtn: document.getElementById('filter-wifi-btn'),
    filterCoworkBtn: document.getElementById('filter-cowork-btn'),
    filterSavedBtn: document.getElementById('filter-saved-btn'),
    countPower: document.getElementById('count-power'),
    countWifi: document.getElementById('count-wifi'),
    countCowork: document.getElementById('count-cowork'),
    countSaved: document.getElementById('count-saved'),
    friendlyCountText: document.getElementById('friendly-count-text'),
    sortSelect: document.getElementById('sort-select'),
    ptrBar: document.getElementById('ptr-bar'),
    ptrLabel: document.getElementById('ptr-label'),
    cardsScroller: document.getElementById('cards-scroller'),
    skeletonWrap: document.getElementById('skeleton-wrap'),
    cardsList: document.getElementById('cards-list'),
    searchBoundsBtn: document.getElementById('search-this-bounds-btn'),
    boundsBtnText: document.getElementById('bounds-btn-text'),
    regionImakokoTab: document.getElementById('region-imakoko-tab'),
    bottomSheet: document.getElementById('spot-bottom-sheet'),
    bsHandle: document.getElementById('bs-handle'),
    bsAreaBadge: document.getElementById('bs-area-badge'),
    bsSizeBtn: document.getElementById('bs-size-btn'),
    bsCloseBtn: document.getElementById('bs-close-btn'),
    bsBody: document.getElementById('bs-body'),
    toastStack: document.getElementById('toast-stack')
  };

  // --- Helpers ---
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

  function getActiveBrandLogo() {
    const list = window.NOMALOFT_LOGOS || [];
    const savedId = localStorage.getItem('nomaloft_selected_logo');
    return list.find((l) => l.id === savedId) || list[0] || null;
  }

  function applySelectedBrandToHeader() {
    const logo = getActiveBrandLogo();
    if (!logo) return;
    const wmSlot = document.getElementById('header-wordmark-slot');
    if (wmSlot) wmSlot.innerHTML = logo.wordmarkSvg;
    if (dom.headerMascotSvg) dom.headerMascotSvg.innerHTML = logo.iconSvg;

    const iconLink = document.querySelector("link[rel~='icon']");
    if (iconLink) {
      iconLink.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(logo.iconSvg.trim());
    }
  }

  function setHeaderMascot(mood = 'normal') {
    if (!dom.headerMascotSvg) return;
    if (mood === 'normal') {
      const logo = getActiveBrandLogo();
      if (logo) {
        dom.headerMascotSvg.innerHTML = logo.iconSvg;
        return;
      }
    }
    dom.headerMascotSvg.innerHTML = getMascotSVG(mood);
  }

  // =========================================================================
  // 3. GENTLE KINETIC CONCEPT LINE & TOAST
  // =========================================================================
  const conceptPhrases = ['全席電源デスク', '無料Wi-Fiカフェ', '公式SNS・営業情報', 'ひとり作業しやすい席'];
  let conceptIdx = 0;

  function initHeaderAnimations() {
    applySelectedBrandToHeader();
    if (dom.loadingMascotSlot) dom.loadingMascotSlot.innerHTML = getMascotSVG('loading');
    if (dom.ptrMascotSlot) dom.ptrMascotSlot.innerHTML = getMascotSVG('loading');

    setInterval(() => {
      if (!dom.kineticConcept) return;
      conceptIdx = (conceptIdx + 1) % conceptPhrases.length;
      dom.kineticConcept.innerHTML = `<span class="k-word-in">${conceptPhrases[conceptIdx]}</span>`;
    }, 3800);

    // Click icon to quickly cycle through the 12 logo proposals live in the header!
    document.getElementById('header-mascot-btn')?.addEventListener('click', () => {
      const list = window.NOMALOFT_LOGOS || [];
      if (list.length > 0) {
        const cur = getActiveBrandLogo();
        const nextIdx = (list.findIndex((l) => l.id === cur?.id) + 1) % list.length;
        const nextLogo = list[nextIdx];
        localStorage.setItem('nomaloft_selected_logo', nextLogo.id);
        applySelectedBrandToHeader();
        showToast(`ロゴ案 ${nextLogo.num}「${nextLogo.title}」に着せ替えたよ`);
      } else {
        setHeaderMascot('happy');
        setTimeout(() => setHeaderMascot('normal'), 2200);
      }
    });
  }

  function showToast(message, undoLabel = '', onUndo = null) {
    if (!dom.toastStack) return;
    const pill = document.createElement('div');
    pill.className =
      'noma-toast-pill bg-white border border-[#E6D7C8] px-4 py-2.5 flex items-center gap-2.5 text-xs font-bold text-espresso';
    pill.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full bg-cafeorange shrink-0"></span>
      <span class="truncate">${message}</span>
      ${
        undoLabel
          ? `<button type="button" class="toast-undo-btn ml-1 px-2.5 py-1 rounded-full bg-espresso text-white text-[11px] font-bold hover:bg-cafeorange transition-colors shrink-0">${undoLabel}</button>`
          : ''
      }
    `;
    dom.toastStack.appendChild(pill);

    const remove = () => {
      if (!pill.isConnected) return;
      pill.style.opacity = '0';
      pill.style.transition = 'opacity 0.2s ease';
      setTimeout(() => pill.remove(), 200);
    };

    const timer = setTimeout(remove, 3000);
    if (undoLabel && typeof onUndo === 'function') {
      pill.querySelector('.toast-undo-btn')?.addEventListener('click', () => {
        clearTimeout(timer);
        onUndo();
        remove();
      });
    }
  }

  // =========================================================================
  // 4. MAP + LEAFLET.MARKERCLUSTER + MUG PINS & SMART LABELS
  // =========================================================================
  function initMap() {
    if (typeof L === 'undefined') return;

    map = L.map('nomaloft-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([REGION_COORDS.all.lat, REGION_COORDS.all.lng], REGION_COORDS.all.zoom);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Free OpenStreetMap Tile Layer (Slightly desaturated via .calm-cafe-tiles)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true
    }).addTo(map);

    // Initialize Leaflet.markercluster with Fluffy Steam Badge
    clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 46,
      disableClusteringAtZoom: 16,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        const sizeClass = count >= 20 ? 'cluster-lg' : '';
        const px = count >= 20 ? 50 : 44;
        return L.divIcon({
          html: `
            <div class="noma-cluster-badge ${sizeClass}" title="${count}軒のカフェが集まっています（タップで展開）">
              ${SVG.clusterSteam}
              <span class="noma-cluster-count">${count}</span>
            </div>
          `,
          className: 'noma-cluster-wrapper',
          iconSize: L.point(px, px)
        });
      }
    });

    map.addLayer(clusterGroup);
    updateZoomLabelClass();

    map.on('zoomend', () => {
      updateZoomLabelClass();
    });

    map.on('moveend', () => {
      if (state.programmaticMove) {
        state.programmaticMove = false;
        return;
      }
      // Show "この地図の範囲でさがす" contextual button when user pans/zooms manually
      if (map && dom.searchBoundsBtn) {
        const inViewCount = countSpotsInCurrentMapBounds();
        if (dom.boundsBtnText) {
          dom.boundsBtnText.textContent = `この地図の範囲でさがす（${inViewCount}軒）`;
        }
        dom.searchBoundsBtn.classList.remove('hidden');
      }
    });

    drawImakokoMarker();
  }

  function updateZoomLabelClass() {
    if (!map || !dom.mapEl) return;
    // Show all store name labels ONLY when zoomed in deeply (zoom >= 16)
    dom.mapEl.classList.toggle('zoom-labels-on', map.getZoom() >= 16);
  }

  function drawImakokoMarker() {
    if (!map) return;
    if (originMarker) map.removeLayer(originMarker);
    const icon = L.divIcon({
      className: 'imakoko-pin',
      html: `<div class="imakoko-dot" title="いまここ（基準位置）"><div class="imakoko-ring"></div><div class="imakoko-core"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    originMarker = L.marker([state.lat, state.lng], { icon, zIndexOffset: 950 }).addTo(map);
  }

  function buildPinHTML(spot, isSelected, isHovered, withHeart = false) {
    const hasPower = spot.power === 'yes_all' || spot.power === 'yes_part';
    const hasWifi = spot.wifi === 'yes_free' || spot.wifi === 'yes_reg';
    const isFull = hasPower && hasWifi;
    const isBean = !hasPower && hasWifi;

    const stateClasses = `${isFull ? 'mug-pin-full' : 'mug-pin-partial'} ${isSelected ? 'is-selected' : ''} ${
      isHovered ? 'is-hovered' : ''
    }`;

    return `
      <div class="mug-pin-wrap ${stateClasses}" data-pin-wrap="${spot.id}">
        <div class="mug-pin-label">${spot.name}</div>
        ${withHeart ? `<span class="pin-float-heart">${SVG.floatHeart}</span>` : ''}
        <div class="mug-pin-badge">
          ${isBean ? SVG.beanIcon : SVG.mugIcon}
        </div>
      </div>
    `;
  }

  function renderClusteredPins(list) {
    if (!map || !clusterGroup) return;
    clusterGroup.clearLayers();
    markerById.clear();

    list.forEach((spot) => {
      const isSelected = spot.id === state.selectedId;
      const isHovered = spot.id === state.hoveredId;

      const icon = L.divIcon({
        className: 'noma-mug-marker',
        html: buildPinHTML(spot, isSelected, isHovered, false),
        iconSize: [36, 36],
        iconAnchor: [18, 30]
      });

      const marker = L.marker([spot.lat, spot.lng], {
        icon,
        zIndexOffset: isSelected ? 900 : 100
      });

      // Map Pin Click -> Scroll List to Card + Hop Pin with Heart + Open Bottom Sheet
      marker.on('click', () => {
        selectCafe(spot.id, { fromMap: true, fromList: false });
      });

      markerById.set(spot.id, { marker, spot });
      clusterGroup.addLayer(marker);
    });
  }

  function refreshSinglePinVisual(spotId, withHeart = false) {
    const entry = markerById.get(spotId);
    if (!entry) return;
    const isSelected = spotId === state.selectedId;
    const isHovered = spotId === state.hoveredId;
    entry.marker.setIcon(
      L.divIcon({
        className: 'noma-mug-marker',
        html: buildPinHTML(entry.spot, isSelected, isHovered, withHeart),
        iconSize: [36, 36],
        iconAnchor: [18, 30]
      })
    );
    entry.marker.setZIndexOffset(isSelected ? 1000 : isHovered ? 850 : 100);
  }

  // =========================================================================
  // 5. FILTERING, COUNTS & LIST RENDERING
  // =========================================================================
  function getBaseRegionSpots() {
    let base = state.spots.map((s) => ({
      ...s,
      distanceMeters: calcMeters(state.lat, state.lng, s.lat, s.lng)
    }));

    if (state.boundsFilterActive && state.currentBounds) {
      base = base.filter((s) => state.currentBounds.contains([s.lat, s.lng]));
    } else if (state.region === 'imakoko') {
      base = base.filter((s) => s.distanceMeters <= 3000);
    } else if (state.region !== 'all') {
      base = base.filter((s) => s.areaId === state.region);
    }

    if (state.query) {
      const q = state.query.toLowerCase();
      base = base.filter((s) =>
        `${s.name} ${s.areaLabel} ${s.station} ${s.categoryLabel} ${s.powerDetail} ${s.wifiDetail} ${s.note}`
          .toLowerCase()
          .includes(q)
      );
    }

    return base;
  }

  function getFilteredSpots() {
    const base = getBaseRegionSpots();

    // Update Live Filter Pill Counts based on current area/search context
    if (dom.countPower) {
      dom.countPower.textContent = String(base.filter((s) => s.power === 'yes_all' || s.power === 'yes_part').length);
    }
    if (dom.countWifi) {
      dom.countWifi.textContent = String(base.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg').length);
    }
    if (dom.countCowork) {
      dom.countCowork.textContent = String(base.filter((s) => s.category === 'coworking').length);
    }
    if (dom.countSaved) {
      dom.countSaved.textContent = String(state.savedIds.size);
    }

    let list = base;
    if (state.savedOnly) {
      list = state.spots
        .map((s) => ({ ...s, distanceMeters: calcMeters(state.lat, state.lng, s.lat, s.lng) }))
        .filter((s) => state.savedIds.has(s.id));
    }
    if (state.powerOnly) {
      list = list.filter((s) => s.power === 'yes_all' || s.power === 'yes_part');
    }
    if (state.wifiOnly) {
      list = list.filter((s) => s.wifi === 'yes_free' || s.wifi === 'yes_reg');
    }
    if (state.coworkOnly) {
      list = list.filter((s) => s.category === 'coworking');
    }

    if (state.sort === 'distance') {
      list.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else if (state.sort === 'score') {
      list.sort((a, b) => (b.workIndex || 0) - (a.workIndex || 0));
    } else if (state.sort === 'speed') {
      list.sort((a, b) => (b.wifiSpeedEst || 0) - (a.wifiSpeedEst || 0));
    }

    return list;
  }

  function countSpotsInCurrentMapBounds() {
    if (!map) return 0;
    const b = map.getBounds();
    return state.spots.filter((s) => b.contains([s.lat, s.lng])).length;
  }

  function renderPowerChip(spot) {
    if (spot.power === 'yes_all') {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF0E6] text-[#C45322] text-xs font-bold">${SVG.plug}<span>全席コンセント</span></span>`;
    }
    if (spot.power === 'yes_part') {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF6EE] text-[#CC6233] text-xs font-bold">${SVG.plug}<span>コンセントあり</span></span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4ECE3] text-[#8E796A] text-xs font-medium">${SVG.minus}<span>電源なし</span></span>`;
  }

  function renderWifiChip(spot) {
    if (spot.wifi === 'yes_free' || spot.wifi === 'yes_reg') {
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint-light text-mint-ink text-xs font-bold">${SVG.wifi}<span>Wi-Fiあり</span></span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4ECE3] text-[#8E796A] text-xs font-medium">${SVG.minus}<span>Wi-Fiなし</span></span>`;
  }

  function updateAllViews() {
    const filtered = getFilteredSpots();

    // Friendly Count Text
    if (dom.friendlyCountText) {
      dom.friendlyCountText.textContent =
        filtered.length > 0 ? `${filtered.length}軒のカフェが見つかったよ` : '0軒（条件をゆるめてみてね）';
    }

    renderCardList(filtered);
    renderClusteredPins(filtered);
  }

  function renderCardList(list) {
    if (!dom.cardsList) return;

    // 0 Results -> Droopy Sad Cup Mascot ("見つからなかったよ…")
    if (list.length === 0) {
      setHeaderMascot('sad');
      dom.cardsList.innerHTML = `
        <div class="rounded-[24px] bg-white border border-[#E8DDD0] p-7 text-center space-y-3 shadow-sm">
          <div class="w-16 h-16 mx-auto">${getMascotSVG('sad')}</div>
          <p class="text-sm font-black text-espresso">見つからなかったよ…</p>
          <p class="text-xs text-latte leading-relaxed">別のエリアを選ぶか、絞りこみ条件をいちど解除してみてね。</p>
          <button id="empty-reset-btn" type="button" class="soft-press px-4 py-2 rounded-full bg-cafeorange text-white text-xs font-bold shadow-sm">
            すべてのカフェを表示する
          </button>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
      return;
    }

    setHeaderMascot('normal');

    dom.cardsList.innerHTML = list
      .map((spot, idx) => {
        const isSaved = state.savedIds.has(spot.id);
        const isActive = spot.id === state.selectedId;
        const igHref =
          spot.instagramUrl ||
          `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(spot.name)}`;
        const xHref = spot.xUrl || `https://x.com/search?q=${encodeURIComponent(spot.name)}`;

        return `
        <article class="card-swipe-container card-float-in" style="animation-delay:${Math.min(idx * 20, 220)}ms" id="card-item-${spot.id}">
          <!-- Swipe Background: Strictly hidden (opacity:0, visibility:hidden) until actively dragged -->
          <div class="card-swipe-bg swipe-bookmark" data-swipe-bg>
            <span>ブックマーク</span>
            <span>くわしく見る</span>
          </div>

          <!-- Single-Layer Opaque Cream-Gradient Card -->
          <div class="noma-card p-4 ${isActive ? 'is-active' : ''}" data-card-id="${spot.id}">
            <!-- Top Metadata -->
            <div class="flex items-center justify-between gap-2 text-xs">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="px-2.5 py-0.5 rounded-full ${
                  spot.category === 'coworking'
                    ? 'bg-mint-light text-mint-ink'
                    : 'bg-butter-light text-butter-ink'
                } font-bold shrink-0">${spot.categoryLabel}</span>
                <span class="text-latte font-medium truncate">${spot.areaLabel}</span>
              </div>
              <span class="font-mono text-xs font-bold text-latte shrink-0">${formatDist(spot.distanceMeters)}</span>
            </div>

            <!-- Store Name & Station -->
            <h2 class="text-[15px] font-black text-espresso leading-snug mt-1.5">${spot.name}</h2>
            <p class="text-xs text-latte truncate mt-0.5">${spot.station} · ${spot.openHours}</p>

            <!-- Power & Wi-Fi Badges -->
            <div class="flex flex-wrap items-center gap-1.5 mt-2.5">
              ${renderPowerChip(spot)}
              ${renderWifiChip(spot)}
            </div>

            <!-- Single Clean Action Row (Zero Overlapping Layers) -->
            <div class="mt-3 pt-2.5 border-t border-[#F1E7DC] flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <a href="${spot.officialUrl}" target="_blank" rel="noopener noreferrer" data-stop-prop class="soft-press px-2.5 py-1 rounded-full bg-milktea hover:bg-butter-light text-xs font-bold text-espresso inline-flex items-center gap-1">
                  ${SVG.globe}<span>公式</span>
                </a>
                <a href="${igHref}" target="_blank" rel="noopener noreferrer" data-stop-prop class="soft-press px-2.5 py-1 rounded-full bg-sakura-light/70 hover:bg-sakura-light text-xs font-bold text-sakura-ink inline-flex items-center gap-1">
                  ${SVG.insta}<span>SNS</span>
                </a>
                <a href="${xHref}" target="_blank" rel="noopener noreferrer" data-stop-prop class="soft-press w-7 h-7 rounded-full bg-milktea hover:bg-[#EDE2D4] text-espresso inline-flex items-center justify-center" title="X（口コミ）">
                  ${SVG.xLogo}
                </a>
              </div>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  data-bm-id="${spot.id}"
                  class="soft-press px-2.5 py-1 rounded-full border ${
                    isSaved
                      ? 'bg-sakura-light border-[#F4B8C8] text-sakura-ink'
                      : 'bg-white border-[#E8DDD0] text-latte hover:border-[#D5BFA9]'
                  } text-xs font-bold inline-flex items-center gap-1"
                  aria-label="ブックマーク"
                >
                  ${isSaved ? SVG.bookmarkFill : SVG.bookmark}
                  <span>ブックマーク</span>
                </button>

                <button
                  type="button"
                  data-detail-id="${spot.id}"
                  class="soft-press px-3 py-1 rounded-full bg-[#FFF2E8] hover:bg-cafeorange hover:text-white text-cafeorange text-xs font-bold transition-colors"
                >
                  くわしく見る
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    bindCardEvents();
  }

  // =========================================================================
  // 6. BIDIRECTIONAL MAP <-> LIST SYNC + HOVER + SWIPE
  // =========================================================================
  function bindCardEvents() {
    document.querySelectorAll('[data-stop-prop]').forEach((el) => {
      el.addEventListener('click', (e) => e.stopPropagation());
    });

    document.querySelectorAll('[data-bm-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-bm-id');
        btn.classList.add('bookmark-pop');
        if (id) toggleBookmark(id);
      });
    });

    document.querySelectorAll('[data-detail-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-detail-id');
        if (id) selectCafe(id, { fromMap: false, fromList: true });
      });
    });

    document.querySelectorAll('.noma-card').forEach((card) => {
      const spotId = card.getAttribute('data-card-id');
      const swipeBg = card.parentElement?.querySelector('[data-swipe-bg]');

      // Hover Sync: Highlight & show store name label on Map Pin!
      card.addEventListener('mouseenter', () => {
        if (!spotId || state.hoveredId === spotId) return;
        const prev = state.hoveredId;
        state.hoveredId = spotId;
        if (prev) refreshSinglePinVisual(prev, false);
        refreshSinglePinVisual(spotId, false);
      });

      card.addEventListener('mouseleave', () => {
        if (!spotId) return;
        state.hoveredId = null;
        refreshSinglePinVisual(spotId, false);
      });

      // Touch Swipe (Only reveals background while actively dragging horizontally)
      let sx = 0;
      let sy = 0;
      let dx = 0;
      let touching = false;
      let swiping = false;

      card.addEventListener(
        'touchstart',
        (e) => {
          if (e.target.closest('button, a')) return;
          sx = e.touches[0].clientX;
          sy = e.touches[0].clientY;
          dx = 0;
          touching = true;
          swiping = false;
        },
        { passive: true }
      );

      card.addEventListener(
        'touchmove',
        (e) => {
          if (!touching) return;
          const curX = e.touches[0].clientX - sx;
          const curY = e.touches[0].clientY - sy;
          if (!swiping && Math.abs(curY) > Math.abs(curX) && Math.abs(curY) > 10) {
            touching = false;
            return;
          }
          if (Math.abs(curX) > 16) {
            swiping = true;
            card.classList.add('is-dragging');
            dx = Math.max(-105, Math.min(105, curX));
            card.style.transform = `translateX(${dx}px)`;
            if (swipeBg) {
              swipeBg.className = `card-swipe-bg is-swiping ${dx > 0 ? 'swipe-bookmark' : 'swipe-detail'}`;
            }
          }
        },
        { passive: true }
      );

      card.addEventListener('touchend', () => {
        if (!touching) return;
        touching = false;
        card.classList.remove('is-dragging');
        card.style.transform = '';
        swipeBg?.classList.remove('is-swiping');

        if (swiping && spotId) {
          if (dx > 68) toggleBookmark(spotId);
          else if (dx < -68) selectCafe(spotId, { fromMap: false, fromList: true });
        }
      });

      // Normal Click on Card -> Center Map + Zoom out of cluster + Bounce Pin + Open Sheet
      card.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return;
        if (spotId) selectCafe(spotId, { fromMap: false, fromList: true });
      });
    });
  }

  function selectCafe(spotId, { fromMap = false, fromList = false } = {}) {
    const prevId = state.selectedId;
    state.selectedId = spotId;
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot) return;

    // Update Card Highlight
    document.querySelectorAll('.noma-card').forEach((c) => {
      c.classList.toggle('is-active', c.getAttribute('data-card-id') === spotId);
    });

    // If clicked from Map Pin -> Scroll Left List smoothly to bring card into view!
    if (fromMap) {
      const cardItem = document.getElementById(`card-item-${spotId}`);
      cardItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update Map Pin + Expand Cluster if needed + Hop with 1 Floating Heart
    if (prevId && prevId !== spotId) refreshSinglePinVisual(prevId, false);
    const entry = markerById.get(spotId);

    if (fromList && entry && clusterGroup && map) {
      state.programmaticMove = true;
      clusterGroup.zoomToShowLayer(entry.marker, () => {
        state.programmaticMove = true;
        map.panTo([spot.lat - 0.0018, spot.lng], { animate: true, duration: 0.35 });
        refreshSinglePinVisual(spotId, true);
      });
    } else {
      if (map) {
        state.programmaticMove = true;
        map.panTo([spot.lat - 0.0018, spot.lng], { animate: true, duration: 0.35 });
      }
      refreshSinglePinVisual(spotId, true);
    }

    openBottomSheet(spot);
  }

  function toggleBookmark(spotId) {
    const spot = state.spots.find((s) => s.id === spotId);
    const wasSaved = state.savedIds.has(spotId);

    if (wasSaved) {
      state.savedIds.delete(spotId);
      showToast(`「${spot ? spot.name : ''}」のブックマークを外したよ`, '元に戻す', () => {
        state.savedIds.add(spotId);
        setHeaderMascot('happy');
        updateAllViews();
      });
    } else {
      state.savedIds.add(spotId);
      // Cup character turns into smiling happy face!
      setHeaderMascot('happy');
      setTimeout(() => setHeaderMascot('normal'), 2400);
      showToast(`「${spot ? spot.name : ''}」をブックマークしたよ`);
    }

    updateAllViews();
  }

  // =========================================================================
  // 7. BOTTOM SHEET ("くわしく見る")
  // =========================================================================
  function openBottomSheet(spot) {
    if (!dom.bottomSheet || !dom.bsBody) return;
    if (dom.bsAreaBadge) dom.bsAreaBadge.textContent = `${spot.areaLabel} · ${spot.categoryLabel}`;

    const isSaved = state.savedIds.has(spot.id);
    const igHref =
      spot.instagramUrl ||
      `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(spot.name)}`;
    const xHref = spot.xUrl || `https://x.com/search?q=${encodeURIComponent(spot.name)}`;
    const gmapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}&query_place_id=${spot.lat},${spot.lng}`;
    const photo = spot.photoUrl || 'https://sspark.genspark.ai/i/81znq8BwVCgoGXQl?width=900';

    const pPct = spot.power === 'yes_all' ? 100 : spot.power === 'yes_part' ? 78 : 15;
    const wPct = spot.wifi === 'yes_free' ? 95 : spot.wifi === 'yes_reg' ? 75 : 15;
    const hourly = [76, 62, 44, 72, 58, 68, 84];
    const hrs = ['8', '10', '12', '14', '16', '18', '20'];

    dom.bsBody.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4 items-start">
        <img src="${photo}" alt="${spot.name}" class="w-full md:w-36 h-32 rounded-[20px] object-cover border border-[#EADFD3] shrink-0" />

        <div class="flex-1 min-w-0 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 id="bs-title" class="text-lg sm:text-xl font-black text-espresso leading-snug">${spot.name}</h2>
              <p class="text-xs font-bold text-latte mt-0.5">${spot.station} · ${spot.openHours} · ${spot.priceHint}</p>
            </div>
            <button id="bs-bm-btn" type="button" class="soft-press shrink-0 px-3.5 py-2 rounded-full border ${
              isSaved
                ? 'bg-sakura-light border-[#F4B8C8] text-sakura-ink'
                : 'bg-white border-[#E8DDD0] text-espresso'
            } text-xs font-bold inline-flex items-center gap-1.5">
              ${isSaved ? SVG.bookmarkFill : SVG.bookmark}
              <span>${isSaved ? 'ブックマーク中' : 'ブックマーク'}</span>
            </button>
          </div>

          <p class="text-xs text-latte leading-relaxed">${spot.note}</p>

          <!-- Official Website & SNS Links -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <a href="${spot.officialUrl}" target="_blank" rel="noopener noreferrer" class="soft-press px-4 py-2 rounded-full bg-cafeorange hover:bg-[#D66433] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm">
              ${SVG.globe}<span>公式サイト</span>
            </a>
            <a href="${igHref}" target="_blank" rel="noopener noreferrer" class="soft-press px-3.5 py-2 rounded-full bg-sakura-light hover:bg-[#F9D0DE] text-sakura-ink text-xs font-bold inline-flex items-center gap-1.5">
              ${SVG.insta}<span>Instagram (${spot.instagramHandle || '投稿を見る'})</span>
            </a>
            <a href="${xHref}" target="_blank" rel="noopener noreferrer" class="soft-press px-3.5 py-2 rounded-full bg-milktea hover:bg-[#EFE4D6] text-espresso text-xs font-bold inline-flex items-center gap-1.5">
              ${SVG.xLogo}<span>X の口コミ</span>
            </a>
            <a href="${gmapHref}" target="_blank" rel="noopener noreferrer" class="soft-press px-3.5 py-2 rounded-full bg-mint-light hover:bg-[#CDEBD9] text-mint-ink text-xs font-bold inline-flex items-center gap-1.5">
              ${SVG.route}<span>ここへ行く</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Power / Wi-Fi Details & Gentle Infographic -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
        <div class="md:col-span-5 space-y-2">
          <div class="rounded-[20px] bg-[#FFF7F0] border border-[#F3D9C6] p-3 flex items-start gap-2.5">
            <span class="w-8 h-8 rounded-full bg-cafeorange text-white flex items-center justify-center shrink-0">${SVG.plug}</span>
            <div>
              <div class="text-[11px] font-bold text-[#B8572B]">コンセント</div>
              <div class="text-xs font-black text-espresso mt-0.5">${spot.powerDetail}</div>
            </div>
          </div>
          <div class="rounded-[20px] bg-[#F2FAF5] border border-[#CBE8D6] p-3 flex items-start gap-2.5">
            <span class="w-8 h-8 rounded-full bg-[#4D946E] text-white flex items-center justify-center shrink-0">${SVG.wifi}</span>
            <div>
              <div class="text-[11px] font-bold text-mint-ink">Wi-Fi</div>
              <div class="text-xs font-black text-espresso mt-0.5">${spot.wifiDetail}</div>
            </div>
          </div>
        </div>

        <div class="md:col-span-4 rounded-[20px] bg-milktea/70 border border-[#ECE0D1] p-3.5 flex flex-col justify-between space-y-2">
          <div class="flex justify-between text-xs font-bold text-espresso">
            <span>作業のしやすさ</span>
            <span class="font-mono text-cafeorange">${spot.workIndex}点</span>
          </div>
          <div>
            <div class="flex justify-between text-[11px] font-bold text-latte mb-1"><span>電源の安心感</span><span>${pPct}%</span></div>
            <div class="h-2 rounded-full bg-white overflow-hidden"><div class="info-bar-fill h-full bg-cafeorange rounded-full" data-w="${pPct}%" style="width:0%"></div></div>
          </div>
          <div>
            <div class="flex justify-between text-[11px] font-bold text-latte mb-1"><span>Wi-Fi快適さ</span><span>${wPct}%</span></div>
            <div class="h-2 rounded-full bg-white overflow-hidden"><div class="info-bar-fill h-full bg-[#529973] rounded-full" data-w="${wPct}%" style="width:0%"></div></div>
          </div>
        </div>

        <div class="md:col-span-3 rounded-[20px] bg-milktea/70 border border-[#ECE0D1] p-3.5 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-latte">ゆとり時間帯の目安</div>
          <div class="h-20 flex items-end justify-between gap-1 pt-2">
            ${hourly
              .map(
                (v, i) => `
              <div class="flex-1 flex flex-col items-center h-full justify-end">
                <div class="w-full h-14 bg-white rounded-full flex items-end overflow-hidden p-[1px]">
                  <div class="info-col-fill w-full rounded-full ${v >= 70 ? 'bg-[#68B088]' : 'bg-[#F09A6E]'}" data-h="${v}%" style="height:0%"></div>
                </div>
                <span class="text-[9px] font-mono text-latte mt-1">${hrs[i]}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    state.sheetExpanded = false;
    dom.bottomSheet.style.maxHeight = '62%';
    if (dom.bsSizeBtn) dom.bsSizeBtn.textContent = '大きく見る';
    dom.bottomSheet.classList.remove('translate-y-[120%]');
    dom.bottomSheet.style.transform = 'translateY(0px)';

    setTimeout(() => {
      dom.bsBody.querySelectorAll('.info-bar-fill').forEach((b) => {
        b.style.width = b.getAttribute('data-w') || '80%';
      });
      dom.bsBody.querySelectorAll('.info-col-fill').forEach((b, idx) => {
        setTimeout(() => {
          b.style.height = b.getAttribute('data-h') || '60%';
        }, idx * 40);
      });
    }, 50);

    document.getElementById('bs-bm-btn')?.addEventListener('click', () => {
      toggleBookmark(spot.id);
      openBottomSheet(spot);
    });
  }

  function closeBottomSheet() {
    if (!dom.bottomSheet) return;
    dom.bottomSheet.style.transform = '';
    dom.bottomSheet.classList.add('translate-y-[120%]');
  }

  function initBottomSheetControls() {
    dom.bsCloseBtn?.addEventListener('click', closeBottomSheet);
    dom.bsSizeBtn?.addEventListener('click', () => {
      if (!dom.bottomSheet) return;
      state.sheetExpanded = !state.sheetExpanded;
      dom.bottomSheet.style.maxHeight = state.sheetExpanded ? '88%' : '62%';
      dom.bsSizeBtn.textContent = state.sheetExpanded ? 'もとの大きさ' : '大きく見る';
    });

    const h = dom.bsHandle;
    if (!h || !dom.bottomSheet) return;
    let sy = 0;
    let dy = 0;
    let dragging = false;

    const start = (y) => {
      sy = y;
      dy = 0;
      dragging = true;
      dom.bottomSheet.style.transition = 'none';
    };
    const move = (y) => {
      if (!dragging) return;
      dy = y - sy;
      if (dy > 0) dom.bottomSheet.style.transform = `translateY(${dy}px)`;
    };
    const end = () => {
      if (!dragging) return;
      dragging = false;
      dom.bottomSheet.style.transition = '';
      if (dy > 80) closeBottomSheet();
      else dom.bottomSheet.style.transform = 'translateY(0px)';
    };

    h.addEventListener('touchstart', (e) => start(e.touches[0].clientY), { passive: true });
    h.addEventListener('touchmove', (e) => move(e.touches[0].clientY), { passive: true });
    h.addEventListener('touchend', end);
    h.addEventListener('mousedown', (e) => {
      if (!e.target.closest('button')) start(e.clientY);
    });
    window.addEventListener('mousemove', (e) => move(e.clientY));
    window.addEventListener('mouseup', end);
  }

  // =========================================================================
  // 8. AUTO COMPLETE, PULL TO REFRESH, FILTERS & "いまここ"
  // =========================================================================
  let acTimer = null;

  function highlightMatch(txt, q) {
    if (!q) return txt;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return txt.replace(new RegExp(`(${esc})`, 'gi'), '<mark class="bg-butter-light text-espresso rounded px-0.5 font-black">$1</mark>');
  }

  async function fetchAutocomplete(q) {
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      state.acItems = data.items || [];
      state.acIndex = -1;
      renderAutocomplete(q);
    } catch (_) {}
  }

  function renderAutocomplete(q) {
    if (!dom.acPanel || !dom.acList) return;
    if (!state.acItems.length) {
      dom.acPanel.classList.add('hidden');
      return;
    }

    dom.acList.innerHTML = state.acItems
      .map(
        (it, i) => `
      <li role="option" data-ac-i="${i}" class="px-4 py-2.5 flex items-center justify-between gap-2 cursor-pointer text-xs transition-colors ${
        i === state.acIndex ? 'bg-[#FFF3E8]' : 'hover:bg-milktea/60'
      }">
        <div class="min-w-0">
          <div class="font-bold text-espresso truncate">${highlightMatch(it.label, q)}</div>
          <div class="text-[11px] text-latte truncate">${it.sub}</div>
        </div>
        <span class="shrink-0 px-2.5 py-0.5 rounded-full bg-milktea text-[10px] font-bold text-latte">
          ${it.kind === 'spot' ? 'お店' : it.kind === 'area' ? 'エリア' : '条件'}
        </span>
      </li>
    `
      )
      .join('');

    dom.acPanel.classList.remove('hidden');

    dom.acList.querySelectorAll('[data-ac-i]').forEach((li) => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const i = parseInt(li.getAttribute('data-ac-i') || '0', 10);
        applyAcItem(state.acItems[i]);
      });
    });
  }

  function applyAcItem(item) {
    if (!item) return;
    dom.acPanel?.classList.add('hidden');

    if (item.kind === 'spot' && item.spotId) {
      state.region = 'all';
      state.boundsFilterActive = false;
      syncAreaTabUI();
      state.query = '';
      if (dom.searchInput) dom.searchInput.value = item.label;
      dom.clearQBtn?.classList.remove('hidden');
      updateAllViews();
      selectCafe(item.spotId, { fromMap: false, fromList: true });
      return;
    }

    if (item.kind === 'area' && item.areaId) {
      selectAreaTab(item.areaId);
      return;
    }

    state.query = item.query;
    if (dom.searchInput) dom.searchInput.value = item.query;
    dom.clearQBtn?.classList.remove('hidden');
    updateAllViews();
  }

  function initSearchAndPTR() {
    dom.searchInput?.addEventListener('focus', () => {
      fetchAutocomplete(dom.searchInput.value.trim());
    });

    dom.searchInput?.addEventListener('input', () => {
      const v = dom.searchInput.value.trim();
      dom.clearQBtn?.classList.toggle('hidden', !v);
      clearTimeout(acTimer);
      acTimer = setTimeout(() => {
        state.query = v;
        fetchAutocomplete(v);
        updateAllViews();
      }, 140);
    });

    dom.searchInput?.addEventListener('keydown', (e) => {
      const len = state.acItems.length;
      if (e.key === 'ArrowDown' && len) {
        e.preventDefault();
        state.acIndex = (state.acIndex + 1) % len;
        renderAutocomplete(dom.searchInput.value.trim());
      } else if (e.key === 'ArrowUp' && len) {
        e.preventDefault();
        state.acIndex = (state.acIndex - 1 + len) % len;
        renderAutocomplete(dom.searchInput.value.trim());
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.acIndex >= 0 && state.acItems[state.acIndex]) {
          applyAcItem(state.acItems[state.acIndex]);
        } else {
          dom.acPanel?.classList.add('hidden');
          state.query = dom.searchInput.value.trim();
          updateAllViews();
        }
      } else if (e.key === 'Escape') {
        dom.acPanel?.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#ac-wrap')) dom.acPanel?.classList.add('hidden');
    });

    dom.clearQBtn?.addEventListener('click', () => {
      if (dom.searchInput) dom.searchInput.value = '';
      state.query = '';
      dom.clearQBtn.classList.add('hidden');
      updateAllViews();
    });

    // Pull to Refresh on Cards Scroller
    const scroller = dom.cardsScroller;
    const bar = dom.ptrBar;
    if (scroller && bar) {
      let sy = 0;
      let pulling = false;
      let dist = 0;

      scroller.addEventListener(
        'touchstart',
        (e) => {
          if (scroller.scrollTop <= 2) {
            sy = e.touches[0].clientY;
            pulling = true;
            dist = 0;
          }
        },
        { passive: true }
      );

      scroller.addEventListener(
        'touchmove',
        (e) => {
          if (!pulling) return;
          const d = e.touches[0].clientY - sy;
          if (d > 0) {
            dist = Math.min(68, d * 0.55);
            bar.style.height = `${dist}px`;
            if (dom.ptrLabel) {
              dom.ptrLabel.textContent = dist >= 48 ? '指をはなして更新するよ' : '引っ張ってこの周辺のカフェを更新…';
            }
          }
        },
        { passive: true }
      );

      scroller.addEventListener('touchend', () => {
        if (!pulling) return;
        pulling = false;
        if (dist >= 48 && map) {
          state.currentBounds = map.getBounds();
          state.boundsFilterActive = true;
          updateAllViews();
          showToast('表示中のマップ範囲でリストを更新したよ');
        }
        bar.style.height = '0px';
        dist = 0;
      });
    }
  }

  function syncAreaTabUI() {
    document.querySelectorAll('#area-tabs-nav [data-region]').forEach((btn) => {
      const r = btn.getAttribute('data-region');
      btn.classList.toggle('is-selected', !state.boundsFilterActive && r === state.region);
    });
  }

  function selectAreaTab(regionId) {
    const preset = REGION_COORDS[regionId] || REGION_COORDS.all;
    state.region = regionId;
    state.boundsFilterActive = false;
    state.savedOnly = false;
    dom.filterSavedBtn?.classList.remove('is-selected');
    dom.searchBoundsBtn?.classList.add('hidden');

    if (regionId !== 'all') {
      state.lat = preset.lat;
      state.lng = preset.lng;
      drawImakokoMarker();
    }

    syncAreaTabUI();
    closeBottomSheet();

    if (map) {
      state.programmaticMove = true;
      map.flyTo([preset.lat, preset.lng], preset.zoom, { duration: 0.6 });
    }
    updateAllViews();
  }

  function triggerImakoko() {
    const applyCoords = (lat, lng, msg) => {
      state.lat = lat;
      state.lng = lng;
      REGION_COORDS.imakoko = { lat, lng, zoom: 15 };
      dom.regionImakokoTab?.classList.remove('hidden');
      state.region = 'imakoko';
      state.boundsFilterActive = false;
      dom.searchBoundsBtn?.classList.add('hidden');
      syncAreaTabUI();
      drawImakokoMarker();
      if (map) {
        state.programmaticMove = true;
        map.flyTo([lat, lng], 15, { duration: 0.65 });
      }
      updateAllViews();
      showToast(msg);
    };

    if (!navigator.geolocation) {
      applyCoords(34.7025, 135.4988, '大阪・梅田周辺を「いまここ」に設定したよ');
      return;
    }

    setHeaderMascot('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHeaderMascot('happy');
        setTimeout(() => setHeaderMascot('normal'), 1800);
        applyCoords(pos.coords.latitude, pos.coords.longitude, 'いまここの近くにあるカフェを表示したよ');
      },
      () => {
        setHeaderMascot('normal');
        applyCoords(34.7025, 135.4988, '大阪・梅田周辺を「いまここ」に設定したよ');
      },
      { timeout: 4500 }
    );
  }

  function resetAllFilters() {
    state.region = 'all';
    state.boundsFilterActive = false;
    state.powerOnly = false;
    state.wifiOnly = false;
    state.coworkOnly = false;
    state.savedOnly = false;
    state.query = '';
    if (dom.searchInput) dom.searchInput.value = '';
    dom.clearQBtn?.classList.add('hidden');
    dom.searchBoundsBtn?.classList.add('hidden');

    [dom.filterPowerBtn, dom.filterWifiBtn, dom.filterCoworkBtn, dom.filterSavedBtn].forEach((b) => {
      b?.classList.remove('is-selected');
      b?.setAttribute('aria-pressed', 'false');
    });
    syncAreaTabUI();
    if (map) {
      state.programmaticMove = true;
      map.flyTo([REGION_COORDS.all.lat, REGION_COORDS.all.lng], REGION_COORDS.all.zoom, { duration: 0.6 });
    }
    updateAllViews();
  }

  function initButtons() {
    // Area Tabs
    document.querySelectorAll('#area-tabs-nav [data-region]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const r = btn.getAttribute('data-region') || 'all';
        selectAreaTab(r);
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    // Filter Pills (Selected = Solid Orange + White Text)
    const bindToggle = (btn, key) => {
      btn?.addEventListener('click', () => {
        state[key] = !state[key];
        btn.classList.toggle('is-selected', state[key]);
        btn.setAttribute('aria-pressed', String(state[key]));
        updateAllViews();
      });
    };

    bindToggle(dom.filterPowerBtn, 'powerOnly');
    bindToggle(dom.filterWifiBtn, 'wifiOnly');
    bindToggle(dom.filterCoworkBtn, 'coworkOnly');
    bindToggle(dom.filterSavedBtn, 'savedOnly');

    // "いまここ" Buttons (Header & Map Bottom-Right FAB)
    document.getElementById('imakoko-header-btn')?.addEventListener('click', triggerImakoko);
    document.getElementById('map-imakoko-fab')?.addEventListener('click', triggerImakoko);

    // Contextual "この地図の範囲でさがす" Button
    dom.searchBoundsBtn?.addEventListener('click', () => {
      if (!map) return;
      state.currentBounds = map.getBounds();
      state.boundsFilterActive = true;
      syncAreaTabUI();
      dom.searchBoundsBtn.classList.add('hidden');
      updateAllViews();
      showToast('いま見えている地図の範囲に絞りこんだよ');
    });

    // Sort Select
    dom.sortSelect?.addEventListener('change', () => {
      state.sort = dom.sortSelect.value;
      updateAllViews();
    });
  }

  // =========================================================================
  // 9. INITIAL BOOTSTRAP
  // =========================================================================
  async function bootstrap() {
    initHeaderAnimations();
    initMap();
    initSearchAndPTR();
    initBottomSheetControls();
    initButtons();

    try {
      const res = await fetch(`/api/spots?lat=${state.lat}&lng=${state.lng}`);
      const data = await res.json();
      state.spots = data.spots || [];
      await new Promise((r) => setTimeout(r, 260));
      dom.skeletonWrap?.classList.add('hidden');
      dom.cardsList?.classList.remove('hidden');
      updateAllViews();
    } catch (_) {
      dom.skeletonWrap?.classList.add('hidden');
      dom.cardsList?.classList.remove('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
