/*
  Geldik Mi?
  Copyright (c) 2026 Onur Teryakioğlu. Tüm hakları saklıdır.
  Bu dosya Onur Teryakioğlu'nun yazılı izni olmadan kopyalanamaz,
  değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz.
*/

(function () {
  "use strict";

  /* =========================================================
     YARDIMCI FONKSİYONLAR
  ========================================================= */
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function normalizeTr(s) {
    return (s || "")
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i")
      .replace(/İ/g, "i")
      .replace(/ş/g, "s")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function formatDistance(m) {
    if (m == null || isNaN(m)) return "—";
    const isTr = I18N_STATE.lang === "tr";
    const unitPref = (typeof settings !== "undefined" && settings.unit) || "auto";
    const asKm = unitPref === "km" || (unitPref === "auto" && m >= 1000);
    if (asKm) {
      const km = (m / 1000).toFixed(m >= 10000 ? 0 : 1);
      return (isTr ? km.replace(".", ",") : km) + " km";
    }
    return Math.round(m) + " m";
  }

  function formatDuration(sec) {
    if (sec == null || isNaN(sec) || sec <= 0) return "";
    const isTr = I18N_STATE.lang === "tr";
    const approx = isTr ? "yaklaşık" : "about";
    const dk = isTr ? "dk" : "min";
    const min = Math.round(sec / 60);
    if (min < 1) return approx + " 1 " + dk;
    if (min < 60) return approx + " " + min + " " + dk;
    const h = Math.floor(min / 60);
    const m = min % 60;
    const sa = isTr ? "sa" : "h";
    return approx + " " + h + " " + sa + " " + m + " " + dk;
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  let toastTimer;
  function toast(msg, ms) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), ms || 2600);
  }

  /* =========================================================
     DEPOLAMA (localStorage)
  ========================================================= */
  const STORE_KEYS = {
    favorites: "geldikmi_favorites",
    history: "geldikmi_history",
    settings: "geldikmi_settings",
    onboarded: "geldikmi_onboarded",
    tourDone: "geldikmi_tour_done",
  };

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* depolama dolu/engelli olabilir — sessizce yok say */
    }
  }

  const DEFAULT_SETTINGS = {
    defaultRadius: 500,
    unit: "auto",
    theme: "system",
    lang: I18N_STATE.lang,
    sound: true,
    vibration: true,
    flash: true,
  };

  let settings = Object.assign({}, DEFAULT_SETTINGS, loadJSON(STORE_KEYS.settings, {}));
  let favorites = loadJSON(STORE_KEYS.favorites, []);
  let history_ = loadJSON(STORE_KEYS.history, []);

  function persistSettings() { saveJSON(STORE_KEYS.settings, settings); }
  function persistFavorites() { saveJSON(STORE_KEYS.favorites, favorites); }
  function persistHistory() { saveJSON(STORE_KEYS.history, history_); }

  function applyTheme() {
    const html = document.documentElement;
    if (settings.theme === "light" || settings.theme === "dark") {
      html.setAttribute("data-theme", settings.theme);
    } else {
      html.removeAttribute("data-theme");
    }
  }

  /* =========================================================
     GÖRÜNÜM (VIEW) YÖNETİMİ
  ========================================================= */
  function showView(id) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    const el = document.getElementById("view-" + id);
    if (el) el.classList.add("active");
    document.querySelectorAll(".nav-item").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === id);
    });
    if (id === "favorites") renderFavorites();
    if (id === "history") renderHistory();
    if (id === "map" && map) setTimeout(() => map.invalidateSize(), 50);
  }

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });
  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.dataset.back));
  });

  /* =========================================================
     AÇILIŞ / ONBOARDING
  ========================================================= */
  const onboardingSlides = document.querySelectorAll(".onboarding-slide");
  const obDots = document.getElementById("onboarding-dots");
  let obIndex = 0;

  onboardingSlides.forEach((_, i) => {
    const d = document.createElement("span");
    if (i === 0) d.classList.add("active");
    obDots.appendChild(d);
  });

  function renderOnboarding() {
    onboardingSlides.forEach((s, i) => s.classList.toggle("active", i === obIndex));
    obDots.querySelectorAll("span").forEach((d, i) => d.classList.toggle("active", i === obIndex));
    document.getElementById("btn-onboarding-prev").style.visibility = obIndex === 0 ? "hidden" : "visible";
    const isLast = obIndex === onboardingSlides.length - 1;
    document.getElementById("btn-onboarding-next").style.display = isLast ? "none" : "";
  }

  document.getElementById("btn-onboarding-next").addEventListener("click", () => {
    if (obIndex < onboardingSlides.length - 1) { obIndex++; renderOnboarding(); }
  });
  document.getElementById("btn-onboarding-prev").addEventListener("click", () => {
    if (obIndex > 0) { obIndex--; renderOnboarding(); }
  });
  document.getElementById("btn-onboarding-skip").addEventListener("click", finishOnboarding);
  document.getElementById("btn-onboarding-start").addEventListener("click", finishOnboarding);

  // İzinler önce açıklanır, sonra kullanıcı düğmeye basınca gerçek tarayıcı izni istenir.
  function setPermStatus(elId, granted) {
    const el = document.getElementById(elId);
    el.textContent = granted ? t("permission_granted") : t("permission_denied");
    el.classList.toggle("denied", !granted);
  }
  document.getElementById("btn-ask-location").addEventListener("click", () => {
    if (!navigator.geolocation) return setPermStatus("status-location", false);
    navigator.geolocation.getCurrentPosition(
      () => setPermStatus("status-location", true),
      () => setPermStatus("status-location", false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
  document.getElementById("btn-ask-notification").addEventListener("click", () => {
    if (!("Notification" in window)) return setPermStatus("status-notification", false);
    Notification.requestPermission().then((perm) => setPermStatus("status-notification", perm === "granted"));
  });

  function finishOnboarding() {
    saveJSON(STORE_KEYS.onboarded, true);
    showView("map");
    ensureMap();
    if (!loadJSON(STORE_KEYS.tourDone, false)) {
      setTimeout(startTour, 400);
    }
  }

  /* =========================================================
     TUR (COACH-MARK) MOTORU — oklarla adım adım tanıtım
  ========================================================= */
  function getTourSteps() {
    return [
      { selector: "#search-input", key: "tour_search", dir: "down" },
      { selector: "#map", key: "tour_map", dir: "up" },
      { selector: "[data-tour=\"zoom\"]", key: "tour_zoom", dir: "left" },
      { selector: "#btn-locate", key: "tour_locate", dir: "left" },
      { selector: "#btn-lines", key: "tour_lines", dir: "right" },
      { selector: "[data-tour=\"shortcuts\"]", key: "tour_shortcuts", dir: "up" },
    ];
  }
  let tourIndex = 0;
  let spotlightEl = null;

  function startTour() {
    tourIndex = 0;
    document.getElementById("tour-layer").classList.remove("hidden");
    renderTourStep();
  }
  function endTour() {
    document.getElementById("tour-layer").classList.add("hidden");
    if (spotlightEl) { spotlightEl.remove(); spotlightEl = null; }
    saveJSON(STORE_KEYS.tourDone, true);
  }
  function renderTourStep() {
    const tourSteps = getTourSteps();
    const step = tourSteps[tourIndex];
    const target = document.querySelector(step.selector);
    if (!target) { tourIndex++; if (tourIndex < tourSteps.length) return renderTourStep(); return endTour(); }
    const rect = target.getBoundingClientRect();

    if (!spotlightEl) {
      spotlightEl = document.createElement("div");
      spotlightEl.className = "tour-spotlight";
      document.body.appendChild(spotlightEl);
    }
    const pad = 8;
    spotlightEl.style.left = rect.left - pad + "px";
    spotlightEl.style.top = rect.top - pad + "px";
    spotlightEl.style.width = rect.width + pad * 2 + "px";
    spotlightEl.style.height = rect.height + pad * 2 + "px";

    const tooltip = document.getElementById("tour-tooltip");
    document.getElementById("tour-tooltip-text").textContent = t(step.key);
    document.getElementById("tour-step-count").textContent = (tourIndex + 1) + " / " + tourSteps.length;
    const nextBtn = document.getElementById("btn-tour-next");
    nextBtn.querySelector("span").textContent = tourIndex === tourSteps.length - 1 ? t("understood") : t("next");

    // Tooltip'i hedefin altına ya da üstüne, ekran sınırları içinde yerleştir
    const vw = window.innerWidth, vh = window.innerHeight;
    let top;
    // "Hepsini Geç" düğmesiyle çakışmayı önlemek için üstte en az 74px boşluk bırak
    if (rect.top > vh / 2) top = Math.max(74, rect.top - 150);
    else top = Math.min(vh - 170, Math.max(74, rect.bottom + 24));
    let left = Math.min(Math.max(16, rect.left), vw - 296);
    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";

    // Ok (özgün SVG ok ikonu, yöne göre döndürülür)
    const arrow = document.getElementById("tour-arrow");
    const rotation = { left: 0, up: 90, right: 180, down: -90 };
    arrow.innerHTML = `<svg viewBox="0 0 24 24" style="transform:rotate(${rotation[step.dir] != null ? rotation[step.dir] : -90}deg)"><use href="#i-chevron-left"/></svg>`;
    const size = 40;
    let ax = rect.left + rect.width / 2 - size / 2;
    let ay = step.dir === "down" ? rect.bottom + 6 : step.dir === "up" ? rect.top - size - 6 : rect.top + rect.height / 2 - size / 2;
    if (step.dir === "left") ax = rect.left - size - 6;
    if (step.dir === "right") ax = rect.right + 6;
    arrow.style.left = Math.min(Math.max(4, ax), vw - size - 4) + "px";
    arrow.style.top = Math.min(Math.max(4, ay), vh - size - 4) + "px";
  }
  document.getElementById("btn-tour-next").addEventListener("click", () => {
    tourIndex++;
    if (tourIndex >= getTourSteps().length) return endTour();
    renderTourStep();
  });
  document.getElementById("btn-tour-skip").addEventListener("click", endTour);
  document.getElementById("btn-replay-tour").addEventListener("click", () => {
    showView("map");
    setTimeout(startTour, 250);
  });
  window.addEventListener("resize", () => {
    if (!document.getElementById("tour-layer").classList.contains("hidden")) renderTourStep();
  });

  /* =========================================================
     HARİTA
  ========================================================= */
  let map, tripMap, userMarker, targetMarker, targetCircle, tripLine;
  let currentTarget = null; // {lat,lng,name,address,underground}
  let lastNominatimCall = 0;

  function ensureMap() {
    if (map) return;
    // Varsayılan: dünya görünümü (uygulama herhangi bir ülkede kullanılabilir).
    // Konum izni zaten verilmişse aşağıdaki locate() kullanıcının konumuna uçar.
    map = L.map("map", { zoomControl: false, attributionControl: true }).setView([20, 10], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap katkıcıları",
    }).addTo(map);

    map.on("click", (e) => placeTarget(e.latlng.lat, e.latlng.lng, null));

    map.locate({ setView: true, maxZoom: 15 });
    map.on("locationfound", (e) => {
      if (!userMarker) {
        userMarker = L.circleMarker(e.latlng, {
          radius: 8, color: "#fff", weight: 3, fillColor: "#1E88FF", fillOpacity: 1,
        }).addTo(map);
      } else {
        userMarker.setLatLng(e.latlng);
      }
    });
  }

  document.getElementById("btn-locate").addEventListener("click", () => {
    if (!navigator.geolocation) return toast(t("geolocation_unsupported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 16);
        if (!userMarker) {
          userMarker = L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
            radius: 8, color: "#fff", weight: 3, fillColor: "#1E88FF", fillOpacity: 1,
          }).addTo(map);
        } else {
          userMarker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
        }
      },
      () => toast(t("locate_error")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  document.getElementById("btn-zoom-in").addEventListener("click", () => map && map.zoomIn());
  document.getElementById("btn-zoom-out").addEventListener("click", () => map && map.zoomOut());

  // Emoji glyphları tarayıcıya/işletim sistemine ve sayfa yakınlaştırma
  // seviyesine göre farklı görsel hizalamayla çizilebiliyor; bu da iğnenin
  // gerçek tıklanan noktadan kaymış görünmesine yol açıyordu. Bunun yerine
  // geometrisi tam olarak bilinen, ölçekle tutarlı kalan bir vektör (SVG)
  // iğne kullanıyoruz — ucu tam iconAnchor noktasına denk gelir.
  const PIN_SIZE = 36; // px — viewBox 24 birim, ölçek 1.5
  const targetIcon = L.divIcon({
    className: "",
    html:
      '<svg width="' + PIN_SIZE + '" height="' + PIN_SIZE + '" viewBox="0 0 24 24" ' +
      'style="display:block;filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))">' +
      '<ellipse cx="12" cy="21.5" rx="3.4" ry="1.3" fill="rgba(0,0,0,.28)"/>' +
      '<path d="M12 21s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12z" fill="#FF6B00" stroke="#ffffff" stroke-width="0.8"/>' +
      '<circle cx="12" cy="9" r="3.1" fill="#ffffff"/>' +
      "</svg>",
    iconSize: [PIN_SIZE, PIN_SIZE],
    iconAnchor: [PIN_SIZE / 2, Math.round((21 / 24) * PIN_SIZE)],
  });

  function placeTarget(lat, lng, meta) {
    currentTarget = {
      lat, lng,
      name: (meta && meta.name) || "",
      address: (meta && meta.address) || null,
      underground: (meta && meta.underground) || false,
    };
    if (!targetMarker) {
      targetMarker = L.marker([lat, lng], { icon: targetIcon, draggable: true }).addTo(map);
      targetMarker.on("dragend", () => {
        const ll = targetMarker.getLatLng();
        currentTarget.lat = ll.lat; currentTarget.lng = ll.lng;
        currentTarget.address = null;
        reverseGeocode(ll.lat, ll.lng);
        updateCircle();
      });
    } else {
      targetMarker.setLatLng([lat, lng]);
    }
    map.panTo([lat, lng]);
    openTargetSheet();
    updateCircle();
    if (!currentTarget.address) reverseGeocode(lat, lng);
    document.getElementById("target-name").placeholder = currentTarget.name || t("target_name_placeholder");
  }

  async function reverseGeocode(lat, lng) {
    document.getElementById("target-address").textContent = t("address_loading");
    try {
      const wait = Math.max(0, 1000 - (Date.now() - lastNominatimCall));
      await new Promise((r) => setTimeout(r, wait));
      lastNominatimCall = Date.now();
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${I18N_STATE.lang}`
      );
      const data = await res.json();
      const addr = data && data.display_name ? data.display_name : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      currentTarget.address = addr;
      document.getElementById("target-address").textContent = addr;
      if (!currentTarget.name) currentTarget.name = data.name || addr.split(",")[0];
      if (!document.getElementById("target-name").value) {
        document.getElementById("target-name").placeholder = currentTarget.name;
      }
    } catch (e) {
      const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      currentTarget.address = addr;
      document.getElementById("target-address").textContent = addr;
      if (!currentTarget.name) currentTarget.name = addr;
      document.getElementById("target-name").placeholder = currentTarget.name;
    }
  }

  function updateCircle() {
    if (!currentTarget) return;
    const r = Number(document.getElementById("radius-slider").value);
    if (!targetCircle) {
      targetCircle = L.circle([currentTarget.lat, currentTarget.lng], {
        radius: r, color: "#FF6B00", weight: 2, fillColor: "#FF6B00", fillOpacity: 0.2,
      }).addTo(map);
    } else {
      targetCircle.setLatLng([currentTarget.lat, currentTarget.lng]);
      targetCircle.setRadius(r);
    }
    const bounds = targetCircle.getBounds();
    // Panel artık saydam + daha kısa (60vh); yine de dairenin görünür kalan
    // üst kısımda ortalanması için sadece alta ekstra pay bırakıyoruz.
    const sheetReserve = Math.min(window.innerHeight * 0.42, 320);
    map.fitBounds(bounds, {
      paddingTopLeft: [70, 90],
      paddingBottomRight: [70, sheetReserve],
      maxZoom: 17,
      animate: true,
    });
  }

  /* =========================================================
     ARAMA
  ========================================================= */
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const clearBtn = document.getElementById("btn-clear-search");

  // Yerel sonuçları eşleşme kalitesine göre sırala: tam eşleşme > baştan
  // eşleşme > içinde geçme. Böylece "m4" yazınca gerçekten M4 hattı/durağı
  // en üstte çıkar, alakasız sonuçlar aşağı düşer — daha tutarlı öneriler.
  function localSearch(norm) {
    const scored = [];
    for (const s of STOPS_DATA) {
      const nName = normalizeTr(s.name);
      const nLine = normalizeTr(s.line);
      const nDistrict = normalizeTr(s.district);
      let score = -1;
      if (nName === norm || nLine === norm) score = 0;
      else if (nName.startsWith(norm) || nLine.startsWith(norm)) score = 1;
      else if (nName.includes(norm)) score = 2;
      else if (nLine.includes(norm) || nDistrict.includes(norm)) score = 3;
      if (score >= 0) scored.push({ s, score });
    }
    scored.sort((a, b) => a.score - b.score || a.s.name.localeCompare(b.s.name, "tr"));
    return scored.slice(0, 8).map((x) => x.s);
  }

  const doSearch = debounce(async (q) => {
    if (!q || q.trim().length < 2) { searchResults.classList.add("hidden"); return; }
    const norm = normalizeTr(q);
    const local = localSearch(norm);
    renderSearchResults(local, []);

    try {
      const wait = Math.max(0, 1000 - (Date.now() - lastNominatimCall));
      await new Promise((r) => setTimeout(r, wait));
      lastNominatimCall = Date.now();
      // Kullanıcının şu an baktığı bölgeye yakın sonuçları öne çıkar (dünyanın
      // her yerinde arama yapılabilir kalır, sadece o bölgeye "ağırlık" verilir).
      let viewboxParam = "";
      if (map) {
        const b = map.getBounds();
        viewboxParam = `&viewbox=${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}&bounded=0`;
      }
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&accept-language=${I18N_STATE.lang}&q=${encodeURIComponent(q)}${viewboxParam}`
      );
      const remote = await res.json();
      renderSearchResults(local, remote || []);
    } catch (e) {
      /* çevrimdışı olabilir — yerel sonuçlar zaten gösteriliyor */
    }
  }, 300);

  searchInput.addEventListener("input", (e) => {
    clearBtn.classList.toggle("hidden", !e.target.value);
    doSearch(e.target.value);
  });
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.classList.add("hidden");
    searchResults.classList.add("hidden");
  });

  function renderSearchResults(local, remote) {
    searchResults.innerHTML = "";
    if (!local.length && !remote.length) {
      searchResults.innerHTML = `<div class="search-result-empty">${t("search_no_results")}</div>`;
      searchResults.classList.remove("hidden");
      return;
    }
    local.forEach((s) => {
      const row = document.createElement("div");
      row.className = "search-result-item";
      row.innerHTML = `<span class="sri-icon"><svg width="20" height="20"><use href="#${STOP_TYPE_ICON[s.type] || "i-pin"}"/></svg></span>
        <span><div class="sri-name">${s.name}</div><div class="sri-sub">${s.line} · ${s.district}</div></span>`;
      row.addEventListener("click", () => {
        searchResults.classList.add("hidden");
        searchInput.value = s.name;
        map.setView([s.lat, s.lng], 16);
        placeTarget(s.lat, s.lng, { name: s.name, address: `${s.name}, ${s.district}`, underground: s.underground });
      });
      searchResults.appendChild(row);
    });
    remote.forEach((r) => {
      const row = document.createElement("div");
      row.className = "search-result-item";
      const short = r.display_name.split(",").slice(0, 2).join(",");
      row.innerHTML = `<span class="sri-icon"><svg width="20" height="20"><use href="#i-pin"/></svg></span>
        <span><div class="sri-name">${short}</div><div class="sri-sub">${r.display_name}</div></span>`;
      row.addEventListener("click", () => {
        searchResults.classList.add("hidden");
        searchInput.value = short;
        const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
        map.setView([lat, lng], 16);
        placeTarget(lat, lng, { name: short, address: r.display_name, underground: false });
      });
      searchResults.appendChild(row);
    });
    searchResults.classList.remove("hidden");
  }

  document.getElementById("btn-show-favorites").addEventListener("click", () => showView("favorites"));
  document.getElementById("btn-show-recents").addEventListener("click", () => showView("history"));

  /* =========================================================
     YAKINDAKİ HATLAR (OpenStreetMap / Overpass API)
     Dünyanın her yerinde çalışır: kullanıcının konumuna yakın metro/
     tramvay/hafif raylı hatlarını bulup hazır seçim olarak sunar.
  ========================================================= */
  // Birincisi aşırı yüklenirse/yanıt vermezse ikinci aynaya geç — tek
  // sunucuya bağımlı kalmayıp "sorunsuz çalışması" için.
  const OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];
  const linesCache = { key: null, lines: null };
  const stopsCache = {};

  function lastKnownLatLng() {
    if (userMarker) { const ll = userMarker.getLatLng(); return { lat: ll.lat, lng: ll.lng }; }
    return null;
  }

  async function overpassQuery(ql) {
    // Aynaları PARALEL dene (sırayla değil) — biri yavaş/aşırı yüklüyse
    // diğerinden gelen ilk yanıtı kullan. Overpass genel kullanıma açık,
    // ücretsiz bir servis olduğu için zaman zaman yavaşlayabilir; bu yüzden
    // tek bir isteğe bağımlı kalmıyoruz.
    const attempts = OVERPASS_URLS.map((url) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 25000);
      return fetch(url, { method: "POST", body: "data=" + encodeURIComponent(ql), signal: ctrl.signal })
        .then((res) => { clearTimeout(timer); if (!res.ok) throw new Error("overpass http " + res.status); return res.json(); })
        .catch((e) => { clearTimeout(timer); throw e; });
    });
    try {
      return await Promise.any(attempts);
    } catch (e) {
      throw new Error("Tüm Overpass aynaları başarısız oldu");
    }
  }

  // Konumun bulunduğu yerleşimin kabaca büyüklüğünü Nominatim'in geri
  // döndürdüğü sınır kutusundan (boundingbox) çıkarır. İdari sınır
  // poligonunu Overpass'a sorgulatmak (area[...]) sunucu tarafında çok
  // ağır ve yavaş olduğundan, onun yerine hafif bir "yarıçap" sorgusu
  // kullanıyoruz — büyük bir il için otomatik olarak daha geniş bir
  // yarıçap seçilmiş olur.
  async function suggestedSearchRadius(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lng}&accept-language=${I18N_STATE.lang}`
      );
      const data = await res.json();
      if (data.boundingbox && data.boundingbox.length === 4) {
        const [south, north, west, east] = data.boundingbox.map(Number);
        const diagonal = haversine(south, west, north, east);
        return Math.round(Math.min(60000, Math.max(15000, diagonal / 1.6)));
      }
    } catch (e) { /* geri dönüş yarıçapı kullanılacak */ }
    return 30000;
  }

  async function fetchNearbyLines(lat, lng) {
    const key = lat.toFixed(2) + "," + lng.toFixed(2);
    if (linesCache.key === key && linesCache.lines) return linesCache.lines;
    const routeFilter = 'relation["route"~"^(subway|light_rail|tram)$"]';
    const radius = await suggestedSearchRadius(lat, lng);
    const ql = `[out:json][timeout:20];(${routeFilter}(around:${radius},${lat},${lng}););out tags;`;
    const data = await overpassQuery(ql);
    const elements = data.elements || [];

    const seen = new Set();
    const lines = [];
    for (const el of elements) {
      const tags = el.tags || {};
      const ref = tags.ref || tags.name || "?";
      const dedupeKey = ref + "|" + (tags.colour || "") + "|" + tags.route;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      lines.push({ id: el.id, ref, name: tags.name || ref, colour: tags.colour || "", route: tags.route });
    }
    lines.sort((a, b) => a.ref.localeCompare(b.ref, undefined, { numeric: true }));
    linesCache.key = key;
    linesCache.lines = lines;
    return lines;
  }

  async function fetchLineStops(relId) {
    if (stopsCache[relId]) return stopsCache[relId];
    const ql = `[out:json][timeout:25];relation(${relId});(._;>;);out body;`;
    const data = await overpassQuery(ql);
    const rel = (data.elements || []).find((e) => e.type === "relation" && e.id === relId);
    const nodesById = {};
    (data.elements || []).forEach((e) => { if (e.type === "node") nodesById[e.id] = e; });
    const stops = [];
    const seenCoord = new Set();
    if (rel && rel.members) {
      for (const m of rel.members) {
        if (m.type !== "node" || (m.role !== "stop" && m.role !== "platform" && m.role !== "stop_entry_only")) continue;
        const node = nodesById[m.ref];
        if (!node) continue;
        const coordKey = node.lat.toFixed(4) + "," + node.lon.toFixed(4);
        if (seenCoord.has(coordKey)) continue;
        seenCoord.add(coordKey);
        stops.push({ name: (node.tags && node.tags.name) || "—", lat: node.lat, lng: node.lon });
        if (stops.length >= 60) break;
      }
    }
    stopsCache[relId] = stops;
    return stops;
  }

  const linesSheet = document.getElementById("sheet-lines");
  const linesOverlay = document.getElementById("lines-overlay");
  const linesContent = document.getElementById("lines-content");
  const linesBackBtn = document.getElementById("btn-lines-back");

  function openLinesSheet() {
    linesSheet.classList.remove("hidden");
    linesOverlay.classList.remove("hidden");
    linesBackBtn.classList.add("hidden");
    document.getElementById("lines-title").textContent = t("lines_title");
    document.getElementById("lines-hint").classList.remove("hidden");
    loadLinesList();
  }
  function closeLinesSheet() {
    linesSheet.classList.add("hidden");
    linesOverlay.classList.add("hidden");
  }
  document.getElementById("btn-lines").addEventListener("click", openLinesSheet);
  document.getElementById("btn-lines-close").addEventListener("click", closeLinesSheet);
  linesOverlay.addEventListener("click", closeLinesSheet);

  function getCurrentPositionAsync() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  function linesRetryHtml(msg) {
    return `<p class="lines-empty">${msg}</p><button class="btn-primary btn-sm" id="btn-lines-retry" type="button" style="display:block;margin:0 auto;">${t("retry")}</button>`;
  }

  async function loadLinesList() {
    linesContent.innerHTML = `<div class="lines-loading"><div class="lines-spinner"></div><span id="lines-loading-text">${t("lines_loading")}</span></div>`;
    const slowNoticeTimer = setTimeout(() => {
      const el = document.getElementById("lines-loading-text");
      if (el) el.textContent = t("lines_loading_slow");
    }, 7000);

    let pos = lastKnownLatLng();
    if (!pos) pos = await getCurrentPositionAsync();
    if (!pos) {
      clearTimeout(slowNoticeTimer);
      linesContent.innerHTML = `<p class="lines-empty">${t("lines_need_location")}</p>`;
      return;
    }
    try {
      const lines = await fetchNearbyLines(pos.lat, pos.lng);
      clearTimeout(slowNoticeTimer);
      if (!lines.length) {
        linesContent.innerHTML = linesRetryHtml(t("lines_empty"));
        document.getElementById("btn-lines-retry").addEventListener("click", () => { linesCache.key = null; loadLinesList(); });
        return;
      }
      const grid = document.createElement("div");
      grid.className = "line-badge-grid";
      lines.forEach((line) => {
        const badge = document.createElement("button");
        badge.className = "line-badge";
        badge.type = "button";
        badge.innerHTML = `<span class="line-chip" style="background:${line.colour || "var(--color-secondary)"}">${line.ref.slice(0, 3)}</span>${line.name}`;
        badge.addEventListener("click", () => openLineStops(line));
        grid.appendChild(badge);
      });
      linesContent.innerHTML = "";
      linesContent.appendChild(grid);
    } catch (e) {
      clearTimeout(slowNoticeTimer);
      linesContent.innerHTML = linesRetryHtml(t("lines_error"));
      document.getElementById("btn-lines-retry").addEventListener("click", () => { linesCache.key = null; loadLinesList(); });
    }
  }

  async function openLineStops(line) {
    linesBackBtn.classList.remove("hidden");
    document.getElementById("lines-title").textContent = line.name;
    document.getElementById("lines-hint").classList.add("hidden");
    linesContent.innerHTML = `<div class="lines-loading"><div class="lines-spinner"></div>${t("lines_loading")}</div>`;
    try {
      const stops = await fetchLineStops(line.id);
      if (!stops.length) {
        linesContent.innerHTML = `<p class="lines-empty">${t("lines_empty")}</p>`;
        return;
      }
      linesContent.innerHTML = "";
      stops.forEach((s) => {
        const row = document.createElement("div");
        row.className = "line-stop-row";
        row.innerHTML = `<span class="line-stop-dot" style="background:${line.colour || "var(--color-primary)"}"></span><span class="line-stop-name">${s.name}</span>`;
        row.addEventListener("click", () => {
          closeLinesSheet();
          ensureMap();
          map.setView([s.lat, s.lng], 16);
          placeTarget(s.lat, s.lng, { name: s.name, address: s.name + " — " + line.name });
        });
        linesContent.appendChild(row);
      });
    } catch (e) {
      linesContent.innerHTML = `<p class="lines-empty">${t("lines_error")}</p>`;
    }
  }
  linesBackBtn.addEventListener("click", openLinesSheet);

  /* =========================================================
     HEDEF AYAR PANELİ (bottom sheet)
  ========================================================= */
  const sheet = document.getElementById("sheet-target");
  const sheetOverlay = document.getElementById("sheet-overlay");
  const radiusSlider = document.getElementById("radius-slider");
  const radiusValue = document.getElementById("radius-value");

  function openTargetSheet() {
    document.getElementById("target-name").value = "";
    document.getElementById("target-address").textContent = currentTarget.address || t("address_loading");
    document.getElementById("underground-hint").classList.toggle("hidden", !currentTarget.underground);
    const initialRadius = currentTarget.underground ? Math.max(1000, settings.defaultRadius) : settings.defaultRadius;
    radiusSlider.value = initialRadius;
    radiusValue.textContent = formatDistance(initialRadius);
    document.getElementById("toggle-sound").checked = settings.sound;
    document.getElementById("toggle-vibration").checked = settings.vibration;
    document.getElementById("toggle-flash").checked = settings.flash;
    updateFavStar();
    sheet.classList.remove("hidden");
    sheetOverlay.classList.remove("hidden");
  }
  function closeTargetSheet() {
    sheet.classList.add("hidden");
    sheetOverlay.classList.add("hidden");
  }
  document.getElementById("btn-sheet-close").addEventListener("click", closeTargetSheet);
  sheetOverlay.addEventListener("click", closeTargetSheet);

  radiusSlider.addEventListener("input", () => {
    radiusValue.textContent = formatDistance(Number(radiusSlider.value));
    updateCircle();
  });
  document.querySelectorAll(".radius-presets .chip-sm").forEach((btn) => {
    btn.addEventListener("click", () => {
      radiusSlider.value = btn.dataset.radius;
      radiusValue.textContent = formatDistance(Number(btn.dataset.radius));
      updateCircle();
    });
  });

  function favKeyOf(t) { return t.lat.toFixed(5) + "," + t.lng.toFixed(5); }
  function updateFavStar() {
    const btn = document.getElementById("btn-fav-toggle");
    const exists = favorites.some((f) => favKeyOf(f) === favKeyOf(currentTarget));
    btn.textContent = exists ? "★" : "☆";
    btn.classList.toggle("active", exists);
  }
  document.getElementById("btn-fav-toggle").addEventListener("click", () => {
    const key = favKeyOf(currentTarget);
    const idx = favorites.findIndex((f) => favKeyOf(f) === key);
    if (idx >= 0) {
      favorites.splice(idx, 1);
      toast(t("fav_removed"));
    } else {
      const nameInput = document.getElementById("target-name").value.trim();
      favorites.unshift({
        id: uid(),
        name: nameInput || currentTarget.name || currentTarget.address || t("trip_default_name"),
        lat: currentTarget.lat, lng: currentTarget.lng,
        address: currentTarget.address,
        radius: Number(radiusSlider.value),
        underground: currentTarget.underground,
      });
      toast(t("fav_added"));
    }
    persistFavorites();
    updateFavStar();
  });

  document.getElementById("btn-start-trip").addEventListener("click", () => {
    const dist = userMarker ? haversine(userMarker.getLatLng().lat, userMarker.getLatLng().lng, currentTarget.lat, currentTarget.lng) : null;
    const r = Number(radiusSlider.value);
    if (dist != null && dist <= r) {
      if (!confirm(t("already_close_confirm"))) return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    const name = document.getElementById("target-name").value.trim() || currentTarget.name || (currentTarget.address ? currentTarget.address.split(",")[0] : t("trip_default_name"));
    startTrip({
      name,
      lat: currentTarget.lat, lng: currentTarget.lng,
      address: currentTarget.address,
      radius: r,
      underground: currentTarget.underground,
      sound: document.getElementById("toggle-sound").checked,
      vibration: document.getElementById("toggle-vibration").checked,
      flash: document.getElementById("toggle-flash").checked,
    });
    closeTargetSheet();
  });

  /* =========================================================
     YOLCULUK TAKİBİ (akıllı örnekleme + Haversine + geofence)
  ========================================================= */
  let trip = null; // aktif yolculuk state'i
  let watchId = null;
  let wakeLockSentinel = null;
  let signalTimer = null;
  let deadReckonTimer = null;

  async function requestWakeLock() {
    try {
      if ("wakeLock" in navigator) wakeLockSentinel = await navigator.wakeLock.request("screen");
    } catch (e) { /* desteklenmiyor olabilir, sorun değil */ }
  }
  function releaseWakeLock() {
    if (wakeLockSentinel) { wakeLockSentinel.release().catch(() => {}); wakeLockSentinel = null; }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && trip && !wakeLockSentinel) requestWakeLock();
  });

  // Bölüm 4 — hedefe kalan mesafeye göre akıllı güncelleme aralığı
  function intervalFor(distanceM) {
    if (distanceM > 20000) return 60000;
    if (distanceM > 5000) return 30000;
    if (distanceM > 1000) return 10000;
    return 4000;
  }

  function startTrip(dest) {
    if (!navigator.geolocation) { toast(t("geolocation_unsupported")); return; }
    trip = {
      dest, startedAt: Date.now(),
      lastProcessedAt: 0, lastUpdateAt: Date.now(),
      insideStreak: 0, minDistance: Infinity, distanceHistory: [],
      alarmFired: false, snoozeUntil: 0,
      speed: 0, lastFix: null,
    };
    showView("trip");
    ensureTripMap();
    setTimeout(() => tripMap && tripMap.invalidateSize(), 60);
    document.getElementById("trip-target-name").textContent = dest.name;
    document.getElementById("trip-signal-banner").classList.add("hidden");
    requestWakeLock();

    watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
      enableHighAccuracy: true, maximumAge: 0, timeout: 20000,
    });
    signalTimer = setInterval(checkSignal, 5000);
    deadReckonTimer = setInterval(extrapolatePosition, 3000);
  }

  // Yeraltı/tünel çözümü: GPS sinyali kesildiğinde son bilinen hız ile
  // hedefe olan mesafeyi tahmin etmeye devam et (Bölüm 4'teki öneriyle uyumlu).
  function extrapolatePosition() {
    if (!trip || !trip.lastFix) return;
    const silenceMs = Date.now() - trip.lastUpdateAt;
    if (silenceMs < 8000 || silenceMs > 600000) return; // çok kısa ya da güvenilmez derecede uzun
    if (!(trip.speed > 0.3)) return; // anlamlı bir hız tahmini yoksa tahmin etme

    const estDistance = Math.max(0, trip.lastFix.distance - trip.speed * (silenceMs / 1000));
    const remaining = Math.max(0, estDistance - trip.dest.radius);
    document.getElementById("trip-remaining").textContent =
      formatDistance(remaining) + " " + t("trip_remaining_suffix") + " " + t("trip_estimated");

    if (estDistance < trip.minDistance) trip.minDistance = estDistance;

    if (!trip.alarmFired && estDistance <= trip.dest.radius && Date.now() > trip.snoozeUntil) {
      fireAlarm(t("alarm_msg", { dist: formatDistance(estDistance) + " " + t("trip_estimated"), name: trip.dest.name }));
    }
  }

  function ensureTripMap() {
    if (tripMap) { tripMap.remove(); tripMap = null; }
    tripMap = L.map("map-trip", { zoomControl: false, attributionControl: true }).setView([trip.dest.lat, trip.dest.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap katkıcıları",
    }).addTo(tripMap);
    L.marker([trip.dest.lat, trip.dest.lng], { icon: targetIcon }).addTo(tripMap);
    L.circle([trip.dest.lat, trip.dest.lng], {
      radius: trip.dest.radius, color: "#FF6B00", weight: 2, fillColor: "#FF6B00", fillOpacity: 0.18,
    }).addTo(tripMap);
  }

  function checkSignal() {
    if (!trip) return;
    const silentFor = Date.now() - trip.lastUpdateAt;
    document.getElementById("trip-signal-banner").classList.toggle("hidden", silentFor < 120000);
  }

  function onPositionError() {
    // Konum alınamadı; sinyal bandı checkSignal ile zaten yönetiliyor.
  }

  function onPosition(pos) {
    if (!trip) return;
    trip.lastUpdateAt = Date.now();
    document.getElementById("trip-signal-banner").classList.add("hidden");

    const { latitude, longitude, accuracy, speed } = pos.coords;
    const distance = haversine(latitude, longitude, trip.dest.lat, trip.dest.lng);
    const remaining = Math.max(0, distance - trip.dest.radius);

    // Akıllı örnekleme: mesafeye göre belirlenen aralıktan sık işlemeyi engelle
    const minInterval = intervalFor(remaining);
    const isFirst = trip.lastProcessedAt === 0;
    if (!isFirst && Date.now() - trip.lastProcessedAt < minInterval) return;
    trip.lastProcessedAt = Date.now();

    // Haritayı güncelle
    if (!userMarkerTrip) {
      userMarkerTrip = L.circleMarker([latitude, longitude], { radius: 8, color: "#fff", weight: 3, fillColor: "#1E88FF", fillOpacity: 1 }).addTo(tripMap);
    } else {
      userMarkerTrip.setLatLng([latitude, longitude]);
    }
    if (tripLine) tripMap.removeLayer(tripLine);
    tripLine = L.polyline([[latitude, longitude], [trip.dest.lat, trip.dest.lng]], { color: "#1A2340", weight: 2, dashArray: "6 6" }).addTo(tripMap);
    tripMap.fitBounds(tripLine.getBounds(), { padding: [60, 60] });

    document.getElementById("trip-remaining").textContent = formatDistance(remaining) + " " + t("trip_remaining_suffix");
    trip.lastFix = { t: Date.now(), distance };

    // Son 1 dakikalık hıza göre kabaca ETA (çok düşükse gösterme); aynı hız
    // tünel/yeraltı sinyal kesintisinde tahmini konum için de kullanılır.
    trip.distanceHistory.push({ t: Date.now(), d: distance });
    trip.distanceHistory = trip.distanceHistory.filter((h) => Date.now() - h.t <= 60000);
    if (trip.distanceHistory.length >= 2) {
      const first = trip.distanceHistory[0];
      const dt = (Date.now() - first.t) / 1000;
      const dd = first.d - distance;
      const v = dd / dt; // m/s
      if (v > 0.3) {
        document.getElementById("trip-eta").textContent = formatDuration(remaining / v);
        trip.speed = v;
      } else {
        document.getElementById("trip-eta").textContent = "";
      }
    }

    // Bölüm 4 — yanlış alarm önleme: doğruluk kötüyse tek başına tetikleyici sayma
    const reliable = accuracy == null || accuracy <= 150;
    if (reliable) {
      if (distance < trip.minDistance) trip.minDistance = distance;
      if (distance <= trip.dest.radius) trip.insideStreak++;
      else trip.insideStreak = 0;
    }

    if (!trip.alarmFired && trip.insideStreak >= 2 && Date.now() > trip.snoozeUntil) {
      fireAlarm(t("alarm_msg", { dist: formatDistance(distance), name: trip.dest.name }));
      return;
    }

    // Hedefi geçmiş olabilir: en yakın mesafe yarıçapın altındaydı, şimdi tekrar artıyor
    // (sinyal tünelde kesilip döndüğünde de bu kontrol hemen alarmı tetikler)
    if (!trip.alarmFired && trip.minDistance <= trip.dest.radius && distance > trip.minDistance + trip.dest.radius * 0.5) {
      fireAlarm(t("passed_target_alarm") + " — " + trip.dest.name);
    }
  }
  let userMarkerTrip = null;

  document.getElementById("btn-cancel-trip").addEventListener("click", () => {
    if (!confirm(t("trip_cancel_confirm"))) return;
    endTrip("iptal");
  });

  function endTrip(result) {
    if (trip) {
      history_.unshift({
        id: uid(), name: trip.dest.name, address: trip.dest.address,
        date: Date.now(), result,
      });
      history_ = history_.slice(0, 20);
      persistHistory();
    }
    if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    if (signalTimer) { clearInterval(signalTimer); signalTimer = null; }
    if (deadReckonTimer) { clearInterval(deadReckonTimer); deadReckonTimer = null; }
    releaseWakeLock();
    stopAlarmEffects();
    trip = null;
    userMarkerTrip = null;
    showView("map");
  }

  /* =========================================================
     ALARM EKRANI — ses, titreşim, yanıp sönme, kaydırarak onay
  ========================================================= */
  let audioCtx = null, oscGain = null, osc = null, beepTimer = null, vibrateTimer = null, notifyTimer = null, alarmStartedAt = 0;

  function fireAlarm(subtitle) {
    trip.alarmFired = true;
    document.getElementById("alarm-sub").textContent = subtitle;
    showView("alarm");
    startAlarmEffects();
  }

  function startAlarmEffects() {
    alarmStartedAt = Date.now();
    requestWakeLock();

    if (trip.dest.flash !== false) document.getElementById("alarm-flash").classList.add("on");

    if (trip.dest.vibration !== false && navigator.vibrate) {
      const pulse = () => navigator.vibrate([1000, 500]);
      pulse();
      vibrateTimer = setInterval(pulse, 1500);
    }

    if (trip.dest.sound !== false) startAlarmSound();

    document.getElementById("btn-snooze").classList.toggle("hidden", !!trip.snoozed);

    // 30 saniyede bir yeniden bildir (Bildirim izni verilmişse)
    if ("Notification" in window && Notification.permission === "granted") {
      const notify = () => {
        try { new Notification("Geldik Mi? — GELDİK! 🎉", { body: document.getElementById("alarm-sub").textContent, tag: "geldikmi-alarm", renotify: true }); } catch (e) {}
      };
      notify();
      notifyTimer = setInterval(notify, 30000);
    }
  }

  function startAlarmSound() {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      oscGain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      oscGain.gain.value = 0;
      osc.connect(oscGain).connect(audioCtx.destination);
      osc.start();
      beepTimer = setInterval(() => {
        const elapsed = (Date.now() - alarmStartedAt) / 1000;
        const maxVol = Math.min(1, 0.3 + (0.7 * Math.min(elapsed, 10)) / 10);
        const now = audioCtx.currentTime;
        oscGain.gain.cancelScheduledValues(now);
        oscGain.gain.setValueAtTime(maxVol, now);
        oscGain.gain.linearRampToValueAtTime(0.0001, now + 0.32);
      }, 420);
    } catch (e) { /* Web Audio desteklenmiyor olabilir */ }
  }

  function stopAlarmEffects() {
    document.getElementById("alarm-flash").classList.remove("on");
    if (vibrateTimer) { clearInterval(vibrateTimer); vibrateTimer = null; }
    if (navigator.vibrate) navigator.vibrate(0);
    if (beepTimer) { clearInterval(beepTimer); beepTimer = null; }
    if (osc) { try { osc.stop(); } catch (e) {} osc = null; }
    if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
    if (notifyTimer) { clearInterval(notifyTimer); notifyTimer = null; }
  }

  // Kaydırarak onay (swipe-to-confirm)
  (function setupSwipe() {
    const track = document.querySelector(".swipe-track");
    const thumb = document.getElementById("swipe-thumb");
    let dragging = false, startX = 0, maxX = 0;

    function pointerDown(e) {
      dragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX) - thumb.offsetLeft;
      maxX = track.clientWidth - thumb.clientWidth - 10;
    }
    function pointerMove(e) {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
      const clamped = Math.min(Math.max(0, x), maxX);
      thumb.style.transform = `translateX(${clamped}px)`;
      if (clamped >= maxX * 0.85) confirmWake();
    }
    function pointerUp() {
      if (!dragging) return;
      dragging = false;
      thumb.style.transform = "translateX(0)";
    }
    thumb.addEventListener("touchstart", pointerDown, { passive: true });
    thumb.addEventListener("touchmove", pointerMove, { passive: true });
    thumb.addEventListener("touchend", pointerUp);
    thumb.addEventListener("mousedown", pointerDown);
    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("mouseup", pointerUp);
  })();

  function confirmWake() {
    document.getElementById("swipe-thumb").style.transform = "translateX(0)";
    toast(t("trip_completed_toast"));
    endTrip("tamamlandı");
  }

  document.getElementById("btn-snooze").addEventListener("click", () => {
    stopAlarmEffects();
    trip.alarmFired = false;
    trip.snoozed = true;
    trip.snoozeUntil = Date.now() + 5 * 60 * 1000;
    trip.insideStreak = 0;
    showView("trip");
    toast(t("snooze_toast"));
  });

  /* =========================================================
     FAVORİLER
  ========================================================= */
  function renderFavorites() {
    const el = document.getElementById("favorites-list");
    if (!favorites.length) { el.innerHTML = `<p class="empty-state">${t("fav_empty")}</p>`; return; }
    el.innerHTML = "";
    favorites.forEach((f) => {
      const card = document.createElement("div");
      card.className = "list-card";
      card.innerHTML = `<span class="list-card-icon"><svg width="20" height="20"><use href="#i-star-filled"/></svg></span>
        <span class="list-card-main"><div class="list-card-title">${f.name}</div><div class="list-card-sub">${f.address || ""} · ${formatDistance(f.radius)}</div></span>
        <button class="list-card-remove" aria-label="remove"><svg width="16" height="16"><use href="#i-close"/></svg></button>`;
      card.querySelector(".list-card-remove").addEventListener("click", (ev) => {
        ev.stopPropagation();
        favorites = favorites.filter((x) => x.id !== f.id);
        persistFavorites();
        renderFavorites();
      });
      card.addEventListener("click", () => {
        showView("map");
        ensureMap();
        setTimeout(() => {
          map.setView([f.lat, f.lng], 16);
          placeTarget(f.lat, f.lng, { name: f.name, address: f.address, underground: f.underground });
          radiusSlider.value = f.radius;
          radiusValue.textContent = formatDistance(f.radius);
          updateCircle();
          document.getElementById("target-name").value = f.name;
        }, 150);
      });
      el.appendChild(card);
    });
  }

  /* =========================================================
     GEÇMİŞ
  ========================================================= */
  function renderHistory() {
    const el = document.getElementById("history-list");
    if (!history_.length) { el.innerHTML = `<p class="empty-state">${t("history_empty")}</p>`; return; }
    el.innerHTML = "";
    const locale = I18N_STATE.lang === "tr" ? "tr-TR" : "en-US";
    history_.forEach((h) => {
      const card = document.createElement("div");
      card.className = "list-card";
      const badge = h.result === "tamamlandı"
        ? `<span class="list-card-badge badge-done">${t("trip_done")}</span>`
        : `<span class="list-card-badge badge-cancel">${t("trip_cancelled")}</span>`;
      const d = new Date(h.date);
      card.innerHTML = `<span class="list-card-icon"><svg width="20" height="20"><use href="#i-clock"/></svg></span>
        <span class="list-card-main"><div class="list-card-title">${h.name}</div><div class="list-card-sub">${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</div></span>
        ${badge}`;
      el.appendChild(card);
    });
  }

  /* =========================================================
     AYARLAR
  ========================================================= */
  function loadSettingsUI() {
    document.getElementById("setting-lang").value = settings.lang;
    document.getElementById("setting-default-radius").value = settings.defaultRadius;
    document.getElementById("setting-unit").value = settings.unit;
    document.getElementById("setting-theme").value = settings.theme;
    document.getElementById("setting-sound").checked = settings.sound;
    document.getElementById("setting-vibration").checked = settings.vibration;
    document.getElementById("setting-flash").checked = settings.flash;
  }
  document.getElementById("setting-lang").addEventListener("change", (e) => {
    settings.lang = e.target.value; persistSettings(); setLang(settings.lang);
    renderFavorites(); renderHistory();
  });
  document.getElementById("setting-default-radius").addEventListener("change", (e) => { settings.defaultRadius = Number(e.target.value); persistSettings(); });
  document.getElementById("setting-unit").addEventListener("change", (e) => { settings.unit = e.target.value; persistSettings(); });
  document.getElementById("setting-theme").addEventListener("change", (e) => { settings.theme = e.target.value; persistSettings(); applyTheme(); });
  document.getElementById("setting-sound").addEventListener("change", (e) => { settings.sound = e.target.checked; persistSettings(); });
  document.getElementById("setting-vibration").addEventListener("change", (e) => { settings.vibration = e.target.checked; persistSettings(); });
  document.getElementById("setting-flash").addEventListener("change", (e) => { settings.flash = e.target.checked; persistSettings(); });
  document.getElementById("btn-open-about").addEventListener("click", () => showView("about"));

  /* =========================================================
     BAŞLANGIÇ
  ========================================================= */
  applyTheme();
  setLang(settings.lang);
  loadSettingsUI();

  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }
  });

  function leaveSplash() {
    if (leaveSplash.done) return;
    leaveSplash.done = true;
    const onboarded = loadJSON(STORE_KEYS.onboarded, false);
    if (onboarded) {
      showView("map");
      ensureMap();
    } else {
      showView("onboarding");
      renderOnboarding();
    }
  }
  document.getElementById("view-splash").addEventListener("click", leaveSplash);
  setTimeout(leaveSplash, 3200);
})();
