/* =========================================================
   NomaLoft — Interactive Frontend Application (app.js)
   Features:
   1. Kinetic Typography (character stagger morph + wave hover)
   2. UI/UX Micro-Animations + Confetti + Cafe Synth Ambience
   3. Infographic Animation (SVG radial gauges, count-up, hourly bars, radar breakdown)
   4. Pull to Refresh (touch + mouse drag with dripping coffee cup)
   5. Skeleton Screen (latte shimmer transition)
   6. Toast Notifications (spring stack + progress bar + undo action)
   7. Draggable Bottom Sheet (half / full snap points + swipe down to close)
   8. Swipe Action on Cards (right = favorite, left = check-in & detail)
   9. Auto Complete Search (highlight match, ↑↓ keyboard nav, instant jump)
   ========================================================= */

(function () {
  'use strict';

  // --- Application State ---
  const state = {
    lat: 35.6619,
    lng: 139.6995,
    areaLabel: '渋谷・神南エリア',
    category: 'all',
    filter: '',
    query: '',
    sort: 'distance',
    jitterSeed: 0,
    spots: [],
    selectedSpotId: null,
    savedIds: new Set(['spot-oat-loft', 'spot-beurre-study']),
    checkedInIds: new Set(),
    beans: 45,
    radarCircleVisible: true,
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

  // --- Map Instances ---
  let map = null;
  let userMarker = null;
  let walkCircle = null;
  let markersLayer = null;
  const markerMap = new Map();

  // --- DOM Elements ---
  const el = {
    toastContainer: document.getElementById('toast-container'),
    kineticWord: document.getElementById('kinetic-rotating-word'),
    waveText: document.querySelector('.kinetic-wave-text'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    acDropdown: document.getElementById('autocomplete-dropdown'),
    acList: document.getElementById('autocomplete-list'),
    acCount: document.getElementById('ac-count'),
    locateMeBtn: document.getElementById('locate-me-btn'),
    locationPill: document.getElementById('current-location-pill'),
    statWifi: document.getElementById('stat-avg-wifi'),
    statPower: document.getElementById('stat-avg-power'),
    statSeats: document.getElementById('stat-open-seats'),
    ringWifi: document.getElementById('ring-wifi'),
    ringPower: document.getElementById('ring-power'),
    ringSeats: document.getElementById('ring-seats'),
    skeletonList: document.getElementById('skeleton-list'),
    cardsList: document.getElementById('spots-cards-list'),
    spotCountLabel: document.getElementById('spot-count-label'),
    scrollContainer: document.getElementById('spot-scroll-container'),
    ptrIndicator: document.getElementById('ptr-indicator'),
    ptrText: document.getElementById('ptr-text'),
    ptrSvg: document.getElementById('ptr-svg'),
    savedBadge: document.getElementById('saved-count-badge'),
    beanPoints: document.getElementById('bean-points'),
    bsBackdrop: document.getElementById('bottom-sheet-backdrop'),
    bottomSheet: document.getElementById('spot-bottom-sheet'),
    bsDragHandle: document.getElementById('bs-drag-handle'),
    bsContent: document.getElementById('bs-content'),
    bsCloseBtn: document.getElementById('bs-close-btn'),
    bsExpandBtn: document.getElementById('bs-expand-btn'),
    sortSelect: document.getElementById('sort-select'),
    globalHourlyBars: document.getElementById('global-hourly-bars')
  };

  // =========================================================
  // 1. KINETIC TYPOGRAPHY ENGINE
  // =========================================================
  const kineticPhrases = [
    { text: '爆速Wi-Fiの', bg: '#F8DF8C' },
    { text: '全席コンセントの', bg: '#F4C7B8' },
    { text: '焼きたて珈琲香る', bg: '#D8EAD9' },
    { text: 'Web会議も安心な', bg: '#FCE6A6' },
    { text: 'ふかふか椅子の', bg: '#E8D7BC' }
  ];
  let kineticIdx = 0;

  function renderKineticChars(wordStr) {
    if (!el.kineticWord) return;
    el.kineticWord.innerHTML = '';
    Array.from(wordStr).forEach((ch, idx) => {
      const span = document.createElement('span');
      span.className = 'kinetic-char';
      span.style.animationDelay = `${idx * 38}ms`;
      span.textContent = ch;
      el.kineticWord.appendChild(span);
    });
  }

  function initKineticTypography() {
    // Split wave text into individual hoverable wave chars
    if (el.waveText) {
      const txt = el.waveText.textContent || '';
      el.waveText.innerHTML = Array.from(txt)
        .map((c, i) => `<span class="kinetic-wave-char" style="animation-delay:${i * 45}ms">${c}</span>`)
        .join('');
    }

    renderKineticChars(kineticPhrases[0].text);

    setInterval(() => {
      if (!el.kineticWord) return;
      const currentChars = el.kineticWord.querySelectorAll('.kinetic-char');
      currentChars.forEach((c, i) => {
        c.style.animationDelay = `${i * 18}ms`;
        c.classList.add('char-exit');
      });

      setTimeout(() => {
        kineticIdx = (kineticIdx + 1) % kineticPhrases.length;
        const next = kineticPhrases[kineticIdx];
        const box = el.kineticWord.closest('.kinetic-word-box');
        if (box) box.style.backgroundColor = next.bg;
        renderKineticChars(next.text);
      }, 250);
    }, 3400);
  }

  // =========================================================
  // 2. TOAST NOTIFICATION SYSTEM (Spring + Undo + Progress)
  // =========================================================
  function showToast({ icon = '☕', title, message, actionLabel, onAction, tone = 'oat', duration = 3800 }) {
    if (!el.toastContainer) return;

    const toneStyles = {
      oat: 'bg-oat-50 border-espresso-900',
      berry: 'bg-[#FFF3EF] border-espresso-900',
      matcha: 'bg-[#F1F8F2] border-espresso-900',
      butter: 'bg-[#FFFBE8] border-espresso-900'
    };

    const toast = document.createElement('div');
    toast.className = `noma-toast ${toneStyles[tone] || toneStyles.oat} border-2 rounded-2xl p-3.5 shadow-[0_6px_0_#2E2018] flex items-start gap-3 relative overflow-hidden`;

    toast.innerHTML = `
      <div class="w-9 h-9 rounded-xl bg-butter-300 border-2 border-espresso-900 flex items-center justify-center text-lg shrink-0">
        ${icon}
      </div>
      <div class="flex-1 min-w-0 pr-1">
        <div class="text-xs font-black text-espresso-900 truncate">${title}</div>
        ${message ? `<p class="text-[11px] font-medium text-espresso-700 mt-0.5 leading-snug">${message}</p>` : ''}
        ${
          actionLabel
            ? `<button type="button" class="toast-action-btn mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full bg-espresso-900 text-oat-50 text-[10px] font-black hover:bg-berry-500 transition-colors">${actionLabel}</button>`
            : ''
        }
      </div>
      <button type="button" class="toast-close text-espresso-700 hover:text-espresso-900 text-xs p-1" aria-label="閉じる">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="absolute bottom-0 left-0 h-1 bg-berry-400 transition-all ease-linear" style="width: 100%; transition-duration: ${duration}ms;"></div>
    `;

    el.toastContainer.appendChild(toast);

    // Start progress bar shrink
    requestAnimationFrame(() => {
      const bar = toast.querySelector('.absolute.bottom-0');
      if (bar) bar.style.width = '0%';
    });

    const removeToast = () => {
      if (!toast.isConnected) return;
      toast.classList.add('toast-leave');
      setTimeout(() => toast.remove(), 260);
    };

    const timer = setTimeout(removeToast, duration);

    toast.querySelector('.toast-close')?.addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });

    if (actionLabel && typeof onAction === 'function') {
      toast.querySelector('.toast-action-btn')?.addEventListener('click', () => {
        clearTimeout(timer);
        onAction();
        removeToast();
      });
    }
  }

  // Playful Emoji Confetti Burst
  function burstEmojiConfetti(x, y, emojis = ['☕', '🥐', '✨', '🫘', '💛']) {
    for (let i = 0; i < 9; i++) {
      const node = document.createElement('span');
      node.className = 'floating-confetti';
      node.textContent = emojis[i % emojis.length];
      const angle = (Math.PI * 2 * i) / 9 + (Math.random() - 0.5) * 0.4;
      const dist = 48 + Math.random() * 55;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      node.style.setProperty('--ty', `${Math.sin(angle) * dist - 25}px`);
      node.style.setProperty('--rot', `${(Math.random() - 0.5) * 90}deg`);
      document.body.appendChild(node);
      setTimeout(() => node.remove(), 980);
    }
  }

  // =========================================================
  // 3. INFOGRAPHIC ANIMATIONS (Counters, SVG Rings, Bars)
  // =========================================================
  function animateCounter(element, targetValue, duration = 850) {
    if (!element) return;
    const startVal = parseInt(element.textContent || '0', 10) || 0;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetValue - startVal) * eased);
      element.textContent = String(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setRingPercent(circleEl, percent) {
    if (!circleEl) return;
    const circumference = 2 * Math.PI * 26; // r=26 => ~163.36
    const clamped = Math.max(0, Math.min(100, percent));
    const offset = circumference * (1 - clamped / 100);
    circleEl.style.strokeDashoffset = String(offset);
  }

  function updateHeroInfographic(summary) {
    if (!summary) return;
    animateCounter(el.statWifi, summary.avgWifi);
    animateCounter(el.statPower, summary.avgPower);
    animateCounter(el.statSeats, summary.totalOpenSeats);

    setRingPercent(el.ringWifi, Math.min(100, (summary.avgWifi / 550) * 100));
    setRingPercent(el.ringPower, summary.avgPower);
    setRingPercent(el.ringSeats, Math.min(100, (summary.totalOpenSeats / 110) * 100));
  }

  function renderGlobalInfographicSection() {
    if (!el.globalHourlyBars) return;
    const sampleHours = [
      { label: '9時', val: 38, best: false },
      { label: '11時', val: 62, best: false },
      { label: '13時', val: 76, best: false },
      { label: '14時', val: 34, best: true },
      { label: '16時', val: 58, best: false },
      { label: '18時', val: 46, best: false },
      { label: '20時', val: 29, best: true }
    ];

    el.globalHourlyBars.innerHTML = sampleHours
      .map(
        (h) => `
      <div class="flex-1 flex flex-col items-center justify-end h-full group">
        <span class="text-[10px] font-mono font-bold text-espresso-700 mb-1 opacity-80 group-hover:opacity-100">${100 - h.val}%空</span>
        <div class="w-full bg-oat-200 rounded-t-xl flex items-end overflow-hidden border border-espresso-900/20 h-20">
          <div
            class="hourly-bar w-full rounded-t-lg ${h.best ? 'bg-matcha-500' : 'bg-butter-400'}"
            data-height="${100 - h.val}%"
            style="height: 0%"
          ></div>
        </div>
        <span class="text-[10px] font-black text-espresso-800 mt-1">${h.label}</span>
      </div>
    `
      )
      .join('');

    triggerGlobalInfographicAnimation();
  }

  function triggerGlobalInfographicAnimation() {
    // Reset to 0 first
    document.querySelectorAll('#global-hourly-bars .hourly-bar').forEach((bar) => {
      bar.style.height = '0%';
    });
    document.querySelectorAll('#worker-mode-bars .info-progress-bar').forEach((bar) => {
      bar.style.width = '0%';
    });

    setTimeout(() => {
      document.querySelectorAll('#global-hourly-bars .hourly-bar').forEach((bar, idx) => {
        setTimeout(() => {
          bar.style.height = bar.getAttribute('data-height') || '50%';
        }, idx * 70);
      });
      document.querySelectorAll('#worker-mode-bars .info-progress-bar').forEach((bar, idx) => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-target') || '50%';
        }, idx * 110);
      });
    }, 80);
  }

  // =========================================================
  // 4. LEAFLET CAFE MAP & MARKERS
  // =========================================================
  function initMap() {
    if (typeof L === 'undefined') return;

    map = L.map('nomaloft-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([state.lat, state.lng], 14);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Clean bright CARTO Voyager tiles styled with warm cafe CSS filter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
    renderUserLocationOnMap();
  }

  function renderUserLocationOnMap() {
    if (!map) return;
    if (userMarker) map.removeLayer(userMarker);
    if (walkCircle) map.removeLayer(walkCircle);

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `<div class="user-here-pin" title="あなたの現在地"><div class="user-here-ring"></div><div class="user-here-dot"></div></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    userMarker = L.marker([state.lat, state.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

    if (state.radarCircleVisible) {
      walkCircle = L.circle([state.lat, state.lng], {
        radius: 650, // ~8 min walk
        color: '#D97254',
        weight: 2,
        dashArray: '6 6',
        fillColor: '#F8DF8C',
        fillOpacity: 0.14
      }).addTo(map);
    }
  }

  function renderSpotMarkers() {
    if (!map || !markersLayer) return;
    markersLayer.clearLayers();
    markerMap.clear();

    state.spots.forEach((spot) => {
      const isCowork = spot.category === 'coworking';
      const isSelected = spot.id === state.selectedSpotId;
      const emoji = spot.mascotMood === 'croissant' ? '🥐' : spot.mascotMood === 'matcha' ? '🍵' : spot.mascotMood === 'muffin' ? '🧁' : isCowork ? '🪑' : '☕';

      const icon = L.divIcon({
        className: 'custom-noma-pin',
        html: `
          <div class="noma-pin-wrap ${isSelected ? 'active-pin' : ''}" data-pin-id="${spot.id}">
            <div class="noma-pin-bubble ${isCowork ? 'noma-pin-coworking' : 'noma-pin-cafe'}">
              <span>${emoji}</span>
              <span>⚡${spot.wifiMbps}M</span>
              <span class="opacity-75">· 空${spot.seatsAvailable}</span>
            </div>
            <div class="noma-pin-tail"></div>
          </div>
        `,
        iconSize: [120, 40],
        iconAnchor: [60, 38]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(markersLayer);
      marker.on('click', () => {
        selectSpot(spot.id, { openSheet: true, panMap: true });
      });
      markerMap.set(spot.id, marker);
    });
  }

  // =========================================================
  // 5. SKELETON SCREEN + FETCH SPOTS + SWIPE CARDS
  // =========================================================
  function showSkeletonScreen() {
    if (el.skeletonList && el.cardsList) {
      el.skeletonList.classList.remove('hidden');
      el.cardsList.classList.add('hidden');
    }
  }

  function hideSkeletonScreen() {
    if (el.skeletonList && el.cardsList) {
      el.skeletonList.classList.add('hidden');
      el.cardsList.classList.remove('hidden');
    }
  }

  async function fetchSpots({ withSkeleton = true, minDelay = 420 } = {}) {
    if (withSkeleton) showSkeletonScreen();
    const t0 = performance.now();

    try {
      const params = new URLSearchParams({
        lat: String(state.lat),
        lng: String(state.lng),
        category: state.category,
        filter: state.filter,
        q: state.query,
        sort: state.sort,
        jitter: String(state.jitterSeed)
      });

      const res = await fetch(`/api/spots?${params.toString()}`);
      const data = await res.json();

      const elapsed = performance.now() - t0;
      if (withSkeleton && elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      state.spots = data.spots || [];
      if (el.spotCountLabel) el.spotCountLabel.textContent = `(${state.spots.length})`;

      renderSpotCards();
      renderSpotMarkers();
      updateHeroInfographic(data.summary);
      hideSkeletonScreen();
    } catch (err) {
      hideSkeletonScreen();
      showToast({
        icon: '🥺',
        title: '通信エラーが発生しました',
        message: 'もう一度下に引っ張って更新してみてください。',
        tone: 'berry'
      });
    }
  }

  function renderSpotCards() {
    if (!el.cardsList) return;

    if (state.spots.length === 0) {
      el.cardsList.innerHTML = `
        <div class="bg-white border-2 border-dashed border-espresso-900/30 rounded-3xl p-8 text-center space-y-3">
          <div class="text-4xl">🕵️‍♀️🥐</div>
          <h3 class="text-base font-black text-espresso-900">条件に合う秘密基地が見つかりませんでした</h3>
          <p class="text-xs text-espresso-700">検索キーワードやフィルターを少しゆるめて探してみてください！</p>
          <button id="reset-all-filters-btn" type="button" class="tactile-btn px-4 py-2 rounded-xl bg-butter-300 border-2 border-espresso-900 text-xs font-black">
            ✨ 条件をリセットして全件表示
          </button>
        </div>
      `;
      document.getElementById('reset-all-filters-btn')?.addEventListener('click', resetAllFilters);
      return;
    }

    el.cardsList.innerHTML = state.spots
      .map((spot, idx) => {
        const isSaved = state.savedIds.has(spot.id);
        const isSelected = spot.id === state.selectedSpotId;
        const crowdLabel =
          spot.crowdLevel <= 35 ? '🟢 ゆったり空席' : spot.crowdLevel <= 60 ? '🟡 ほどよく快適' : '🟠 やや賑わい';

        return `
        <article class="swipe-card-wrapper card-enter" style="animation-delay: ${idx * 55}ms" data-spot-id="${spot.id}">
          <!-- Background Layer revealed during Swipe Action -->
          <div class="swipe-bg-layer swipe-bg-save" data-bg-save>
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-heart text-base"></i> お気に入り切替！</span>
            <span class="flex items-center gap-1.5">チェックイン＆詳細 <i class="fa-solid fa-mug-hot text-base"></i></span>
          </div>

          <!-- Foreground Draggable Card -->
          <div class="spot-card-fg p-3.5 sm:p-4 ${isSelected ? 'selected-card' : ''}" data-fg-card="${spot.id}">
            <div class="flex gap-3.5">
              <!-- Thumbnail -->
              <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-espresso-900 shrink-0 bg-oat-200">
                <img src="${spot.imageUrl}" alt="${spot.name}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <span class="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-oat-50/95 border border-espresso-900 text-[10px] font-black text-espresso-900">
                  徒歩${spot.walkMinFromHere}分
                </span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-1">
                  <span class="inline-block px-2 py-0.5 rounded-md bg-butter-300/80 text-[10px] font-black text-espresso-900 truncate">
                    ${spot.badge}
                  </span>
                  <button
                    type="button"
                    class="fav-btn w-7 h-7 rounded-full border border-espresso-900/20 flex items-center justify-center ${
                      isSaved ? 'bg-berry-400 text-white' : 'bg-oat-100 text-espresso-700 hover:bg-oat-200'
                    } transition-transform active:scale-125 shrink-0"
                    data-fav-id="${spot.id}"
                    aria-label="お気に入り保存"
                  >
                    <i class="fa-solid fa-heart text-xs"></i>
                  </button>
                </div>

                <h3 class="text-sm sm:text-base font-black text-espresso-900 truncate mt-1">${spot.name}</h3>
                <p class="text-[11px] text-espresso-700 truncate">${spot.area} · ${spot.distanceMeters}m · ${spot.priceRange}</p>
                <p class="text-xs text-espresso-800 font-medium line-clamp-1 mt-1">${spot.catchcopy}</p>
              </div>
            </div>

            <!-- Telemetry Mini Pills -->
            <div class="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-espresso-900/10 text-[11px] font-bold">
              <div class="px-2 py-1 rounded-xl bg-oat-100 text-espresso-900 flex items-center justify-center gap-1">
                <i class="fa-solid fa-bolt text-berry-500"></i>
                <span class="font-mono">${spot.wifiMbps}M</span>
              </div>
              <div class="px-2 py-1 rounded-xl bg-oat-100 text-espresso-900 flex items-center justify-center gap-1">
                <i class="fa-solid fa-plug text-matcha-500"></i>
                <span>電源${spot.outletRatio}%</span>
              </div>
              <div class="px-2 py-1 rounded-xl bg-oat-100 text-espresso-900 flex items-center justify-center truncate">
                <span>${crowdLabel}</span>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    attachCardInteractions();
  }

  // =========================================================
  // 6. SWIPE ACTION HANDLER ON CARDS (Touch + Pointer Drag)
  // =========================================================
  function attachCardInteractions() {
    // Heart button direct click
    document.querySelectorAll('.fav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav-id');
        if (id) toggleFavorite(id, e.clientX, e.clientY);
      });
    });

    // Swipe gesture + click for each card
    document.querySelectorAll('.spot-card-fg').forEach((card) => {
      const spotId = card.getAttribute('data-fg-card');
      const bgLayer = card.parentElement?.querySelector('[data-bg-save]');
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let dragging = false;
      let swiped = false;

      const onPointerDown = (e) => {
        if (e.target.closest('button')) return;
        startX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
        startY = e.clientY ?? (e.touches && e.touches[0].clientY) ?? 0;
        currentX = 0;
        dragging = true;
        swiped = false;
        card.classList.add('dragging');
      };

      const onPointerMove = (e) => {
        if (!dragging) return;
        const x = e.clientX ?? (e.touches && e.touches[0].clientX) ?? startX;
        const y = e.clientY ?? (e.touches && e.touches[0].clientY) ?? startY;
        const dx = x - startX;
        const dy = y - startY;

        // If user scrolls vertically, cancel horizontal swipe
        if (!swiped && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
          dragging = false;
          card.classList.remove('dragging');
          card.style.transform = '';
          return;
        }

        if (Math.abs(dx) > 10) {
          swiped = true;
          currentX = Math.max(-135, Math.min(135, dx));
          card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.025}deg)`;
          if (bgLayer) {
            bgLayer.className = `swipe-bg-layer ${currentX > 0 ? 'swipe-bg-save' : 'swipe-bg-checkin'}`;
          }
        }
      };

      const onPointerUp = (e) => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('dragging');

        if (currentX > 78 && spotId) {
          // Right Swipe => Favorite Toggle
          const rect = card.getBoundingClientRect();
          toggleFavorite(spotId, rect.left + 60, rect.top + 40);
        } else if (currentX < -78 && spotId) {
          // Left Swipe => Check-in + Open Bottom Sheet
          performCheckIn(spotId);
          selectSpot(spotId, { openSheet: true, panMap: true });
        } else if (!swiped && spotId) {
          // Normal Tap => Select & Open Bottom Sheet
          selectSpot(spotId, { openSheet: true, panMap: true });
        }

        card.style.transform = '';
      };

      card.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);

      card.addEventListener('touchstart', onPointerDown, { passive: true });
      card.addEventListener('touchmove', onPointerMove, { passive: true });
      card.addEventListener('touchend', onPointerUp);
    });
  }

  function toggleFavorite(spotId, clientX, clientY) {
    const spot = state.spots.find((s) => s.id === spotId);
    const wasSaved = state.savedIds.has(spotId);

    if (wasSaved) {
      state.savedIds.delete(spotId);
      showToast({
        icon: '🧺',
        title: 'お気に入りから外しました',
        message: spot ? spot.name : '',
        actionLabel: '元に戻す',
        onAction: () => {
          state.savedIds.add(spotId);
          updateSavedUI();
          renderSpotCards();
        }
      });
    } else {
      state.savedIds.add(spotId);
      if (clientX && clientY) burstEmojiConfetti(clientX, clientY, ['💖', '🥐', '☕', '✨']);
      showToast({
        icon: '💖',
        title: 'お気に入り秘密基地に保存！',
        message: `${spot ? spot.name : ''} をリストに追加しました`,
        tone: 'berry'
      });
    }

    updateSavedUI();
    renderSpotCards();
  }

  function updateSavedUI() {
    if (el.savedBadge) el.savedBadge.textContent = String(state.savedIds.size);
    const heart = document.getElementById('header-heart-icon');
    if (heart) {
      heart.classList.add('scale-150');
      setTimeout(() => heart.classList.remove('scale-150'), 280);
    }
  }

  async function performCheckIn(spotId, ev) {
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotId })
      });
      const data = await res.json();
      state.checkedInIds.add(spotId);
      state.beans += data.beansEarned || 15;
      animateCounter(el.beanPoints, state.beans, 600);

      if (ev && ev.clientX) {
        burstEmojiConfetti(ev.clientX, ev.clientY, ['🫘', '☕', '🎉', '✨']);
      }

      showToast({
        icon: '🎉',
        title: 'ノマド・チェックイン成功！',
        message: data.message,
        tone: 'matcha'
      });
    } catch (_) {
      showToast({ icon: '☕', title: 'チェックイン完了！ (+15粒)', tone: 'matcha' });
    }
  }

  // =========================================================
  // 7. PULL TO REFRESH (Touch + Desktop Drag in Scroll Container)
  // =========================================================
  function initPullToRefresh() {
    const container = el.scrollContainer;
    const indicator = el.ptrIndicator;
    if (!container || !indicator) return;

    let startY = 0;
    let pulling = false;
    let pullDist = 0;
    const threshold = 68;

    const startPull = (y) => {
      if (container.scrollTop > 2) return;
      startY = y;
      pulling = true;
      pullDist = 0;
      indicator.classList.remove('ptr-releasing');
    };

    const movePull = (y) => {
      if (!pulling) return;
      const diff = y - startY;
      if (diff <= 0) {
        pullDist = 0;
        indicator.style.height = '0px';
        return;
      }
      pullDist = Math.min(105, Math.pow(diff, 0.82) * 1.6);
      indicator.style.height = `${pullDist}px`;
      if (el.ptrSvg) el.ptrSvg.style.transform = `rotate(${pullDist * 2.2}deg)`;
      if (el.ptrText) {
        el.ptrText.textContent =
          pullDist >= threshold ? '✨ 指を離して淹れたて空席データを取得！' : '☕ 下に引っ張ってドリップ更新...';
      }
    };

    const endPull = async () => {
      if (!pulling) return;
      pulling = false;
      indicator.classList.add('ptr-releasing');

      if (pullDist >= threshold) {
        indicator.style.height = '56px';
        if (el.ptrText) el.ptrText.textContent = 'ハンドドリップで最新Wi-Fi・空席を抽出中...';
        el.ptrSvg?.classList.add('ptr-spinning');

        state.jitterSeed += 1;
        await fetchSpots({ withSkeleton: true, minDelay: 580 });

        el.ptrSvg?.classList.remove('ptr-spinning');
        indicator.style.height = '0px';
        showToast({
          icon: '☕',
          title: '最新の空席＆Wi-Fi状況をドリップ完了！',
          message: `${state.areaLabel}周辺のリアルタイム情報を更新しました`,
          tone: 'butter'
        });
      } else {
        indicator.style.height = '0px';
      }
      pullDist = 0;
    };

    container.addEventListener('touchstart', (e) => startPull(e.touches[0].clientY), { passive: true });
    container.addEventListener('touchmove', (e) => movePull(e.touches[0].clientY), { passive: true });
    container.addEventListener('touchend', endPull);

    // Also allow mouse drag from top header area of scroll container for desktop testing
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, .spot-card-fg')) return;
      startPull(e.clientY);
    });
    window.addEventListener('mousemove', (e) => movePull(e.clientY));
    window.addEventListener('mouseup', endPull);
  }

  // =========================================================
  // 8. BOTTOM SHEET (Spot Detail + Animated Infographic + Drag)
  // =========================================================
  function selectSpot(spotId, { openSheet = true, panMap = true } = {}) {
    state.selectedSpotId = spotId;
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot) return;

    // Highlight card & marker
    document.querySelectorAll('.spot-card-fg').forEach((c) => {
      c.classList.toggle('selected-card', c.getAttribute('data-fg-card') === spotId);
    });
    document.querySelectorAll('.noma-pin-wrap').forEach((p) => {
      p.classList.toggle('active-pin', p.getAttribute('data-pin-id') === spotId);
    });

    if (panMap && map) {
      map.flyTo([spot.lat, spot.lng], 15, { duration: 0.65 });
    }

    if (openSheet) {
      openBottomSheet(spot);
    }
  }

  function openBottomSheet(spot) {
    if (!el.bottomSheet || !el.bsContent || !el.bsBackdrop) return;
    const isSaved = state.savedIds.has(spot.id);
    const isCheckedIn = state.checkedInIds.has(spot.id);

    el.bsContent.innerHTML = `
      <!-- Header Photo + Title -->
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
        <div class="sm:col-span-5 relative h-44 sm:h-48 rounded-3xl overflow-hidden border-2 border-espresso-900 shadow-[0_4px_0_#2E2018]">
          <img src="${spot.imageUrl}" alt="${spot.name}" class="w-full h-full object-cover" />
          <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-butter-300 border-2 border-espresso-900 text-xs font-black">
            ${spot.badge}
          </span>
          <span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-espresso-900/90 text-oat-50 text-[11px] font-mono font-bold">
            現在地から ${spot.distanceMeters}m（徒歩${spot.walkMinFromHere}分）
          </span>
        </div>

        <div class="sm:col-span-7 space-y-2.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-oat-200 border border-espresso-900/30 text-[11px] font-black">${spot.categoryLabel}</span>
            <span class="text-xs font-bold text-espresso-700"><i class="fa-solid fa-train-subway mr-1"></i>${spot.station} 徒歩${spot.walkMinutes}分</span>
            <span class="text-xs font-bold text-matcha-500">● 営業中 (${spot.openHours})</span>
          </div>

          <h2 id="bs-spot-title" class="text-xl sm:text-2xl font-black text-espresso-900 leading-tight">${spot.name}</h2>
          <p class="text-xs sm:text-sm text-espresso-800 leading-relaxed">${spot.description}</p>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2.5 pt-1">
            <button id="bs-checkin-btn" type="button" class="tactile-btn px-4 py-2.5 rounded-2xl ${
              isCheckedIn ? 'bg-matcha-400 text-espresso-900' : 'bg-berry-400 text-white'
            } border-2 border-espresso-900 text-xs font-black flex items-center gap-1.5">
              <i class="fa-solid fa-mug-saucer"></i>
              <span>${isCheckedIn ? 'チェックイン済み (+15粒)' : 'ここにチェックイン (+15粒)'}</span>
            </button>

            <button id="bs-fav-btn" type="button" class="tactile-btn px-4 py-2.5 rounded-2xl ${
              isSaved ? 'bg-butter-300' : 'bg-white'
            } border-2 border-espresso-900 text-xs font-black flex items-center gap-1.5">
              <i class="fa-solid fa-heart ${isSaved ? 'text-berry-500' : 'text-espresso-700'}"></i>
              <span>${isSaved ? 'お気に入り保存中' : 'お気に入りに追加'}</span>
            </button>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}"
              target="_blank"
              rel="noopener noreferrer"
              class="tactile-btn px-3.5 py-2.5 rounded-2xl bg-oat-100 border-2 border-espresso-900 text-xs font-black flex items-center gap-1.5"
            >
              <i class="fa-solid fa-route text-espresso-800"></i>
              <span>ルート案内</span>
            </a>
          </div>
        </div>
      </div>

      <!-- ANIMATED INFOGRAPHIC TELEMETRY GRID -->
      <div class="bg-oat-100 border-2 border-espresso-900 rounded-3xl p-4 sm:p-5 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-espresso-900 flex items-center gap-1.5">
            <span>📊</span> PCワーカー向け環境インフォグラフィック
          </h3>
          <span class="px-2.5 py-0.5 rounded-full bg-espresso-900 text-oat-50 font-mono text-xs font-bold">
            総合快適度 ${spot.nomadScore} / 100
          </span>
        </div>

        <!-- 4 Animated Progress Meters -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div class="bg-white rounded-2xl p-3 border border-espresso-900/15">
            <div class="flex justify-between text-xs font-black mb-1.5">
              <span>⚡ 実測Wi-Fiスピード (${spot.wifiMbps} Mbps)</span>
              <span class="font-mono text-matcha-500">安定度 ${spot.wifiStability}%</span>
            </div>
            <div class="h-3 rounded-full bg-oat-200 overflow-hidden">
              <div class="bs-anim-bar h-full bg-matcha-500 rounded-full transition-all duration-1000 ease-out" data-w="${spot.wifiStability}%" style="width:0%"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-3 border border-espresso-900/15">
            <div class="flex justify-between text-xs font-black mb-1.5">
              <span>🔌 コンセント・USB給電席率</span>
              <span class="font-mono text-berry-500">${spot.outletRatio}%</span>
            </div>
            <div class="h-3 rounded-full bg-oat-200 overflow-hidden">
              <div class="bs-anim-bar h-full bg-berry-400 rounded-full transition-all duration-1000 ease-out" data-w="${spot.outletRatio}%" style="width:0%"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-3 border border-espresso-900/15">
            <div class="flex justify-between text-xs font-black mb-1.5">
              <span>🪑 デスク広さ＆チェア快適度</span>
              <span class="font-mono text-espresso-900">${spot.chairComfort}点</span>
            </div>
            <div class="h-3 rounded-full bg-oat-200 overflow-hidden">
              <div class="bs-anim-bar h-full bg-butter-400 rounded-full transition-all duration-1000 ease-out" data-w="${spot.chairComfort}%" style="width:0%"></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-3 border border-espresso-900/15">
            <div class="flex justify-between text-xs font-black mb-1.5">
              <span>🤫 静かさ・集中しやすさ</span>
              <span class="font-mono text-espresso-900">${spot.quietness}点</span>
            </div>
            <div class="h-3 rounded-full bg-oat-200 overflow-hidden">
              <div class="bs-anim-bar h-full bg-espresso-800 rounded-full transition-all duration-1000 ease-out" data-w="${spot.quietness}%" style="width:0%"></div>
            </div>
          </div>
        </div>

        <!-- Hourly Crowd Animated Chart inside Bottom Sheet -->
        <div class="bg-white rounded-2xl p-4 border border-espresso-900/15">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span class="text-xs font-black text-espresso-900">🕒 時間帯別の空席ゆとりチャート（高いほど空いていて快適！）</span>
            <span class="text-xs font-bold text-berry-500">現在 残り ${spot.seatsAvailable} / ${spot.totalSeats} 席空き</span>
          </div>
          <div class="h-28 flex items-end justify-between gap-2 pt-3">
            ${spot.hourlyStats
              .map((st) => {
                const comfort = 100 - st.crowd;
                return `
                <div class="flex-1 flex flex-col items-center h-full justify-end">
                  <span class="text-[10px] font-mono font-bold text-espresso-700 mb-1">${comfort}%</span>
                  <div class="w-full h-16 bg-oat-100 rounded-t-xl border border-espresso-900/15 flex items-end overflow-hidden">
                    <div class="bs-hourly-bar w-full rounded-t-lg ${
                      comfort >= 65 ? 'bg-matcha-400' : 'bg-butter-400'
                    } transition-all duration-700 ease-out" data-h="${comfort}%" style="height: 0%"></div>
                  </div>
                  <span class="text-[10px] font-black text-espresso-800 mt-1">${st.hour}</span>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      </div>

      <!-- Signature Drink & Call Policy & Tags -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div class="bg-butter-300/40 border-2 border-espresso-900 rounded-2xl p-3.5 flex items-center gap-3">
          <img src="${spot.subImageUrl}" alt="${spot.signatureDrink}" class="w-14 h-14 rounded-xl object-cover border border-espresso-900 shrink-0" />
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-berry-500">☕ おすすめご褒美メニュー</span>
            <div class="text-xs sm:text-sm font-black text-espresso-900">${spot.signatureDrink}</div>
            <div class="text-xs font-mono font-bold text-espresso-700">${spot.signaturePrice}</div>
          </div>
        </div>

        <div class="bg-white border-2 border-espresso-900 rounded-2xl p-3.5 flex flex-col justify-center">
          <span class="text-[10px] font-black text-espresso-700">🎧 Web会議・通話ルール</span>
          <div class="text-xs sm:text-sm font-black text-espresso-900 mt-0.5">${spot.callLabel}</div>
          <div class="flex flex-wrap gap-1 mt-2">
            ${spot.tags.map((t) => `<span class="px-2 py-0.5 rounded-full bg-oat-100 border border-espresso-900/20 text-[10px] font-bold">#${t}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Nomad Voices -->
      <div class="space-y-2.5">
        <h3 class="text-xs font-black text-espresso-900">💬 先輩ノマドワーカーのリアル口コミ</h3>
        ${spot.reviews
          .map(
            (r) => `
          <div class="bg-white border-2 border-espresso-900/15 rounded-2xl p-3.5 flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-oat-200 border border-espresso-900 flex items-center justify-center text-base shrink-0">${r.avatar}</div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-espresso-900">${r.author} <span class="font-normal text-espresso-700">(${r.role})</span></span>
                <span class="px-2 py-0.5 rounded-full bg-butter-300/70 text-[10px] font-black">${r.vibeTag}</span>
              </div>
              <p class="text-xs text-espresso-800 mt-1 leading-relaxed">${r.comment}</p>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    // Show Backdrop + Slide Up Sheet
    state.sheetExpanded = false;
    el.bottomSheet.style.maxHeight = '76vh';
    el.bsBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    el.bottomSheet.classList.remove('translate-y-full');
    el.bottomSheet.style.transform = 'translateY(0px)';

    // Animate Infographic Bars inside Bottom Sheet
    setTimeout(() => {
      el.bsContent.querySelectorAll('.bs-anim-bar').forEach((b) => {
        b.style.width = b.getAttribute('data-w') || '80%';
      });
      el.bsContent.querySelectorAll('.bs-hourly-bar').forEach((b, i) => {
        setTimeout(() => {
          b.style.height = b.getAttribute('data-h') || '60%';
        }, i * 65);
      });
    }, 100);

    // Sheet Inner Buttons
    document.getElementById('bs-checkin-btn')?.addEventListener('click', (ev) => {
      performCheckIn(spot.id, ev);
      openBottomSheet(spot);
    });
    document.getElementById('bs-fav-btn')?.addEventListener('click', (ev) => {
      toggleFavorite(spot.id, ev.clientX, ev.clientY);
      openBottomSheet(spot);
    });
  }

  function closeBottomSheet() {
    if (!el.bottomSheet || !el.bsBackdrop) return;
    el.bsBackdrop.classList.add('opacity-0', 'pointer-events-none');
    el.bottomSheet.style.transform = '';
    el.bottomSheet.classList.add('translate-y-full');
  }

  function initBottomSheetGestures() {
    el.bsCloseBtn?.addEventListener('click', closeBottomSheet);
    el.bsBackdrop?.addEventListener('click', closeBottomSheet);

    el.bsExpandBtn?.addEventListener('click', () => {
      if (!el.bottomSheet) return;
      state.sheetExpanded = !state.sheetExpanded;
      el.bottomSheet.style.maxHeight = state.sheetExpanded ? '94vh' : '76vh';
      el.bsExpandBtn.textContent = state.sheetExpanded ? 'コンパクトに戻す' : '全画面でじっくり見る';
    });

    // Drag Down to Dismiss / Drag Up to Expand
    const handle = el.bsDragHandle;
    if (!handle || !el.bottomSheet) return;

    let startY = 0;
    let deltaY = 0;
    let dragging = false;

    const onStart = (y) => {
      startY = y;
      deltaY = 0;
      dragging = true;
      el.bottomSheet.style.transition = 'none';
    };

    const onMove = (y) => {
      if (!dragging) return;
      deltaY = y - startY;
      if (deltaY > 0) {
        el.bottomSheet.style.transform = `translateY(${deltaY}px)`;
      } else if (deltaY < -40) {
        el.bottomSheet.style.maxHeight = '94vh';
        state.sheetExpanded = true;
      }
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      el.bottomSheet.style.transition = '';
      if (deltaY > 110) {
        closeBottomSheet();
      } else {
        el.bottomSheet.style.transform = 'translateY(0px)';
      }
    };

    handle.addEventListener('touchstart', (e) => onStart(e.touches[0].clientY), { passive: true });
    handle.addEventListener('touchmove', (e) => onMove(e.touches[0].clientY), { passive: true });
    handle.addEventListener('touchend', onEnd);

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      onStart(e.clientY);
    });
    window.addEventListener('mousemove', (e) => onMove(e.clientY));
    window.addEventListener('mouseup', onEnd);
  }

  // =========================================================
  // 9. AUTO COMPLETE SEARCH (Keyboard ↑↓ + Match Highlight)
  // =========================================================
  let acDebounce = null;

  function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-butter-300 text-espresso-900 rounded px-0.5 font-black">$1</mark>');
  }

  async function updateAutocomplete(qText) {
    try {
      const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(qText)}`);
      const data = await res.json();
      state.autocompleteItems = data.suggestions || [];
      state.acActiveIndex = -1;
      renderAutocompleteList(qText);
    } catch (_) {}
  }

  function renderAutocompleteList(qText) {
    if (!el.acDropdown || !el.acList) return;
    if (state.autocompleteItems.length === 0) {
      el.acDropdown.classList.add('hidden');
      el.searchInput?.setAttribute('aria-expanded', 'false');
      return;
    }

    if (el.acCount) el.acCount.textContent = `${state.autocompleteItems.length}件`;

    el.acList.innerHTML = state.autocompleteItems
      .map(
        (item, idx) => `
      <li
        role="option"
        data-ac-idx="${idx}"
        class="ac-item px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors ${
          idx === state.acActiveIndex ? 'bg-butter-300/70' : 'hover:bg-oat-200/70'
        }"
      >
        <span class="w-8 h-8 rounded-xl bg-white border border-espresso-900/20 flex items-center justify-center text-base shrink-0">${item.icon}</span>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-black text-espresso-900 truncate">${highlightMatch(item.label, qText)}</div>
          <div class="text-[11px] text-espresso-700 truncate">${item.sub}</div>
        </div>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-oat-200 text-espresso-800 shrink-0">
          ${item.type === 'spot' ? '店舗へ直行' : '絞り込み'}
        </span>
      </li>
    `
      )
      .join('');

    el.acDropdown.classList.remove('hidden');
    el.searchInput?.setAttribute('aria-expanded', 'true');

    el.acList.querySelectorAll('.ac-item').forEach((li) => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const idx = parseInt(li.getAttribute('data-ac-idx') || '0', 10);
        applyAutocompleteItem(state.autocompleteItems[idx]);
      });
    });
  }

  function applyAutocompleteItem(item) {
    if (!item) return;
    el.acDropdown?.classList.add('hidden');
    el.searchInput?.setAttribute('aria-expanded', 'false');

    if (item.type === 'spot' && item.spotId) {
      state.query = '';
      if (el.searchInput) el.searchInput.value = item.label;
      el.clearSearchBtn?.classList.remove('hidden');
      fetchSpots({ withSkeleton: false }).then(() => {
        selectSpot(item.spotId, { openSheet: true, panMap: true });
      });
      return;
    }

    state.query = item.query;
    if (el.searchInput) el.searchInput.value = item.query;
    el.clearSearchBtn?.classList.remove('hidden');
    fetchSpots({ withSkeleton: true });
    showToast({
      icon: item.icon || '🔍',
      title: `「${item.label}」で検索しました`,
      tone: 'oat'
    });
  }

  function initAutocompleteEvents() {
    if (!el.searchInput) return;

    el.searchInput.addEventListener('focus', () => {
      updateAutocomplete(el.searchInput.value.trim());
    });

    el.searchInput.addEventListener('input', () => {
      const val = el.searchInput.value.trim();
      el.clearSearchBtn?.classList.toggle('hidden', val.length === 0);
      clearTimeout(acDebounce);
      acDebounce = setTimeout(() => {
        state.query = val;
        updateAutocomplete(val);
        fetchSpots({ withSkeleton: false });
      }, 160);
    });

    el.searchInput.addEventListener('keydown', (e) => {
      const len = state.autocompleteItems.length;
      if (e.key === 'ArrowDown' && len > 0) {
        e.preventDefault();
        state.acActiveIndex = (state.acActiveIndex + 1) % len;
        renderAutocompleteList(el.searchInput.value.trim());
      } else if (e.key === 'ArrowUp' && len > 0) {
        e.preventDefault();
        state.acActiveIndex = (state.acActiveIndex - 1 + len) % len;
        renderAutocompleteList(el.searchInput.value.trim());
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.acActiveIndex >= 0 && state.autocompleteItems[state.acActiveIndex]) {
          applyAutocompleteItem(state.autocompleteItems[state.acActiveIndex]);
        } else {
          state.query = el.searchInput.value.trim();
          el.acDropdown?.classList.add('hidden');
          fetchSpots({ withSkeleton: true });
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
      fetchSpots({ withSkeleton: true });
    });

    // Global '/' shortcut
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
      }
    });
  }

  // =========================================================
  // 10. PLAYFUL EXTRAS: GPS Radar, Cafe BGM Synth, Latte Fortune, Pomodoro
  // =========================================================
  function resetAllFilters() {
    state.category = 'all';
    state.filter = '';
    state.query = '';
    if (el.searchInput) el.searchInput.value = '';
    el.clearSearchBtn?.classList.add('hidden');

    document.querySelectorAll('.cat-pill').forEach((b) => {
      const active = b.getAttribute('data-cat') === 'all';
      b.className = `cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-espresso-900 shadow-[0_2px_0_#2E2018] ${
        active ? 'bg-espresso-900 text-oat-50' : 'bg-white text-espresso-900 hover:bg-oat-200'
      }`;
    });
    document.querySelectorAll('.cond-pill').forEach((b) => {
      b.classList.remove('bg-butter-300', 'border-espresso-900');
      b.classList.add('bg-oat-100', 'border-espresso-900/25');
    });

    fetchSpots({ withSkeleton: true });
  }

  function initFilterAndMapButtons() {
    // Category pills
    document.querySelectorAll('.cat-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = btn.getAttribute('data-cat') || 'all';
        document.querySelectorAll('.cat-pill').forEach((b) => {
          const active = b === btn;
          b.className = `cat-pill shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-espresso-900 shadow-[0_2px_0_#2E2018] ${
            active ? 'bg-espresso-900 text-oat-50' : 'bg-white text-espresso-900 hover:bg-oat-200'
          }`;
        });
        fetchSpots({ withSkeleton: true });
      });
    });

    // Condition filter pills (toggleable)
    document.querySelectorAll('.cond-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter') || '';
        state.filter = state.filter === f ? '' : f;
        document.querySelectorAll('.cond-pill').forEach((b) => {
          const active = b.getAttribute('data-filter') === state.filter;
          b.classList.toggle('bg-butter-300', active);
          b.classList.toggle('border-espresso-900', active);
          b.classList.toggle('bg-oat-100', !active);
          b.classList.toggle('border-espresso-900/25', !active);
        });
        fetchSpots({ withSkeleton: true });
      });
    });

    // Area jump chips
    document.querySelectorAll('.area-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const lat = parseFloat(chip.getAttribute('data-lat') || '35.6619');
        const lng = parseFloat(chip.getAttribute('data-lng') || '139.6995');
        const label = chip.textContent?.trim() || '渋谷';
        state.lat = lat;
        state.lng = lng;
        state.areaLabel = label;

        document.querySelectorAll('.area-chip').forEach((c) => {
          const active = c === chip;
          c.className = `area-chip shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
            active
              ? 'border-espresso-900 bg-espresso-900 text-oat-50'
              : 'border-espresso-900/30 bg-white text-espresso-800 hover:bg-butter-300'
          }`;
        });

        if (el.locationPill) el.locationPill.textContent = `現在地設定: ${label}エリア周辺をスキャン中`;
        renderUserLocationOnMap();
        if (map) map.flyTo([lat, lng], 14, { duration: 0.75 });
        fetchSpots({ withSkeleton: true });
        showToast({ icon: '🧭', title: `${label}エリアへワープしました！`, tone: 'oat' });
      });
    });

    // Sort select
    el.sortSelect?.addEventListener('change', () => {
      state.sort = el.sortSelect.value;
      fetchSpots({ withSkeleton: true, minDelay: 320 });
    });

    // GPS Geolocation Button
    el.locateMeBtn?.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast({ icon: '📍', title: 'ブラウザの位置情報が無効です', message: '渋谷駅周辺を基準に表示します' });
        return;
      }
      showToast({ icon: '🛰️', title: 'GPSで現在地をサーチ中...', duration: 2000 });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.lat = pos.coords.latitude;
          state.lng = pos.coords.longitude;
          state.areaLabel = 'あなたの現在地';
          if (el.locationPill) el.locationPill.textContent = '現在地: GPSで取得したリアル現在地周辺';
          renderUserLocationOnMap();
          if (map) map.flyTo([state.lat, state.lng], 14, { duration: 0.9 });
          fetchSpots({ withSkeleton: true });
          showToast({
            icon: '✨',
            title: '現在地の取得に成功しました！',
            message: '一番近い電源カフェ順に並べ替えました',
            tone: 'matcha'
          });
        },
        () => {
          // Friendly fallback to Shibuya/Daikanyama center so experience never breaks
          state.lat = 35.6585;
          state.lng = 139.701;
          renderUserLocationOnMap();
          if (map) map.flyTo([state.lat, state.lng], 14, { duration: 0.7 });
          fetchSpots({ withSkeleton: true });
          showToast({
            icon: '🐕',
            title: 'デモ現在地（渋谷・代官山中間）を設定しました！',
            message: '位置情報許可なしでも全機能をお試しいただけます✨',
            tone: 'butter'
          });
        },
        { timeout: 5000 }
      );
    });

    // Manual Refresh & Demo Skeleton Button
    const triggerRefresh = async () => {
      const icon = document.getElementById('refresh-spin-icon');
      icon?.classList.add('fa-spin');
      state.jitterSeed += 1;
      await fetchSpots({ withSkeleton: true, minDelay: 550 });
      icon?.classList.remove('fa-spin');
      showToast({
        icon: '☕',
        title: 'リアルタイム空席＆回線速度を更新しました！',
        tone: 'butter'
      });
    };
    document.getElementById('manual-refresh-btn')?.addEventListener('click', triggerRefresh);
    document.getElementById('demo-skeleton-btn')?.addEventListener('click', triggerRefresh);

    // Toggle 8-min Walk Radar Ring
    document.getElementById('toggle-radar-circle-btn')?.addEventListener('click', () => {
      state.radarCircleVisible = !state.radarCircleVisible;
      renderUserLocationOnMap();
      showToast({
        icon: '⭕',
        title: state.radarCircleVisible ? '徒歩8分圏リングを表示しました' : '徒歩8分圏リングを非表示にしました'
      });
    });

    document.getElementById('recenter-map-btn')?.addEventListener('click', () => {
      if (map) map.flyTo([state.lat, state.lng], 14, { duration: 0.6 });
    });

    // Saved Drawer Filter Quick Toggle
    document.getElementById('saved-drawer-btn')?.addEventListener('click', () => {
      if (state.savedIds.size === 0) {
        showToast({ icon: '💡', title: 'カードを右スワイプしてお気に入り登録しよう！' });
        return;
      }
      const firstId = Array.from(state.savedIds)[0];
      selectSpot(firstId, { openSheet: true, panMap: true });
      showToast({
        icon: '💖',
        title: `お気に入り登録中 (${state.savedIds.size}店舗)`,
        message: 'イチオシの保存スポットを開きました！',
        tone: 'berry'
      });
    });

    // Latte Fortune Easter Egg Sticker
    document.getElementById('sticker-croissant')?.addEventListener('click', (e) => {
      const fortunes = [
        '大吉ラテ☕：窓際の角席が一発で見つかる奇跡の1日！ラッキードリンクはオーツラテ。',
        '爆速クロワッサン吉🥐：コードがバグゼロで一発ビルド成功する予感！',
        'ふわふわカプチーノ吉☁️：偶然座ったカフェで最高のアイデアが降りてきそう！'
      ];
      const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
      burstEmojiConfetti(e.clientX, e.clientY, ['🥐', '🔮', '☕', '🌟']);
      showToast({
        icon: '🔮',
        title: '今日のノマド・ラテ占い結果！',
        message: pick,
        tone: 'butter',
        duration: 5000
      });
    });

    // Replay Infographic Button
    document.getElementById('replay-infographic-btn')?.addEventListener('click', () => {
      triggerGlobalInfographicAnimation();
      showToast({ icon: '📊', title: 'インフォグラフィックを再アニメーションしました！' });
    });

    // Mobile Tabs
    const tabBoth = document.getElementById('tab-both-btn');
    const tabMap = document.getElementById('tab-map-only-btn');
    const listSec = document.getElementById('spot-list-section');
    tabBoth?.addEventListener('click', () => {
      listSec?.classList.remove('hidden');
      tabBoth.classList.add('bg-espresso-900', 'text-oat-50');
      tabMap?.classList.remove('bg-espresso-900', 'text-oat-50');
      setTimeout(() => map?.invalidateSize(), 150);
    });
    tabMap?.addEventListener('click', () => {
      listSec?.classList.add('hidden');
      tabMap.classList.add('bg-espresso-900', 'text-oat-50');
      tabBoth?.classList.remove('bg-espresso-900', 'text-oat-50');
      setTimeout(() => map?.invalidateSize(), 150);
    });
  }

  // Web Audio API Cozy Cafe Brown Noise + Warm Chord Synth
  function initCafeAmbience() {
    const btn = document.getElementById('ambience-btn');
    const label = document.getElementById('ambience-label');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!state.ambienceOn) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!state.audioCtx) state.audioCtx = new AudioContextClass();
        const ctx = state.audioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        // Soft warm cafe room murmur (filtered brown noise)
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.18;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;

        const gain = ctx.createGain();
        gain.gain.value = 0.18;

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start(0);

        state.ambienceNodes = [whiteNoise, gain];
        state.ambienceOn = true;
        if (label) label.textContent = 'Cafe音 ON♪';
        btn.classList.add('bg-butter-300');
        showToast({
          icon: '🎧',
          title: '心地よいカフェ環境音をONにしました',
          message: '優しいローパス・アンビエントで集中モードへ☕',
          tone: 'matcha'
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
        if (label) label.textContent = 'Cafe音 OFF';
        btn.classList.remove('bg-butter-300');
        showToast({ icon: '🔇', title: 'カフェ環境音をOFFにしました' });
      }
    });
  }

  // Pomodoro Timer
  function initPomodoro() {
    const display = document.getElementById('pomo-timer-display');
    const status = document.getElementById('pomo-status-text');
    const toggleBtn = document.getElementById('pomo-toggle-btn');
    const resetBtn = document.getElementById('pomo-reset-btn');
    const headerBtn = document.getElementById('pomodoro-btn');

    const renderTime = () => {
      const m = String(Math.floor(state.pomoSeconds / 60)).padStart(2, '0');
      const s = String(state.pomoSeconds % 60).padStart(2, '0');
      if (display) display.textContent = `${m}:${s}`;
    };

    toggleBtn?.addEventListener('click', () => {
      state.pomoRunning = !state.pomoRunning;
      if (state.pomoRunning) {
        toggleBtn.textContent = '一時停止';
        if (status) status.textContent = '🔥 集中ドリップ中！応援してます！';
        state.pomoInterval = setInterval(() => {
          if (state.pomoSeconds > 0) {
            state.pomoSeconds -= 1;
            renderTime();
          } else {
            clearInterval(state.pomoInterval);
            state.pomoRunning = false;
            toggleBtn.textContent = '開始';
            state.beans += 25;
            animateCounter(el.beanPoints, state.beans);
            showToast({
              icon: '🏆',
              title: '25分ポモドーロ達成！お疲れさまです！',
              message: 'ご褒美ビーンズ +25粒を獲得しました☕✨',
              tone: 'butter'
            });
          }
        }, 1000);
      } else {
        clearInterval(state.pomoInterval);
        toggleBtn.textContent = '再開';
        if (status) status.textContent = '☕ ひと息ブレイク中';
      }
    });

    resetBtn?.addEventListener('click', () => {
      clearInterval(state.pomoInterval);
      state.pomoRunning = false;
      state.pomoSeconds = 25 * 60;
      renderTime();
      if (toggleBtn) toggleBtn.textContent = '開始';
      if (status) status.textContent = 'スタンバイ中・深呼吸しよう';
    });

    headerBtn?.addEventListener('click', (e) => {
      burstEmojiConfetti(e.clientX, e.clientY, ['🫘', '☕', '🥐']);
      document.getElementById('nomad-insights-section')?.scrollIntoView({ behavior: 'smooth' });
      showToast({
        icon: '🫘',
        title: `現在の所持ビーンズ: ${state.beans}粒`,
        message: '店舗への左スワイプチェックインやポモドーロで貯まります！',
        tone: 'butter'
      });
    });
  }

  // Magnetic Kawaii Cursor Follower (Desktop)
  function initMagneticCursor() {
    const cursor = document.getElementById('latte-cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let curX = -100;
    let curY = -100;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.classList.remove('opacity-0');

      const hoverCard = e.target.closest('.spot-card-fg');
      const hoverPin = e.target.closest('.noma-pin-wrap');
      const hoverBtn = e.target.closest('button, a');

      if (hoverCard) {
        cursor.textContent = '↔';
        cursor.style.width = '46px';
        cursor.style.height = '46px';
        cursor.style.backgroundColor = 'rgba(248, 223, 140, 0.78)';
      } else if (hoverPin) {
        cursor.textContent = '☕';
        cursor.style.width = '44px';
        cursor.style.height = '44px';
        cursor.style.backgroundColor = 'rgba(232, 141, 114, 0.65)';
      } else if (hoverBtn) {
        cursor.textContent = '✨';
        cursor.style.width = '38px';
        cursor.style.height = '38px';
        cursor.style.backgroundColor = 'rgba(184, 223, 191, 0.6)';
      } else {
        cursor.textContent = '';
        cursor.style.width = '28px';
        cursor.style.height = '28px';
        cursor.style.backgroundColor = 'rgba(248, 223, 140, 0.28)';
      }
    });

    function tick() {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;
      cursor.style.transform = `translate3d(${curX - cursor.offsetWidth / 2}px, ${curY - cursor.offsetHeight / 2}px, 0)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // =========================================================
  // BOOTSTRAP
  // =========================================================
  document.addEventListener('DOMContentLoaded', async () => {
    initKineticTypography();
    initMagneticCursor();
    initMap();
    initAutocompleteEvents();
    initPullToRefresh();
    initBottomSheetGestures();
    initFilterAndMapButtons();
    initCafeAmbience();
    initPomodoro();
    renderGlobalInfographicSection();

    // Initial Skeleton -> Smooth Reveal
    await fetchSpots({ withSkeleton: true, minDelay: 620 });

    setTimeout(() => {
      showToast({
        icon: '🥐',
        title: 'NomaLoftへようこそ！',
        message: 'ピンやカードをタップすると混雑インフォグラフィックが開きます✨',
        tone: 'butter',
        duration: 4200
      });
    }, 700);
  });
})();
