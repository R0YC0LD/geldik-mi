/*
  Geldik Mi?
  Copyright (c) 2026 Onur Teryakioğlu. Tüm hakları saklıdır.
  Bu dosya Onur Teryakioğlu'nun yazılı izni olmadan kopyalanamaz,
  değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz.
*/

// Basit, bağımlılıksız çeviri (i18n) katmanı — Türkçe ve İngilizce.
const I18N = {
  tr: {
    app_name: "Geldik Mi?",
    splash_tagline: "Durağını kaçırma, sen uyu — biz uyandıralım.",
    credit_made_in: "Türkiye'de tasarlandı ve geliştirildi",
    credit_made_by: "Onur Teryakioğlu tarafından",
    credit_rights: "Tüm hakları saklıdır",
    credit_copyright: "© 2026 Geldik Mi?",

    skip_all: "Hepsini Geç",
    next: "İleri",
    back: "Geri",
    understood: "Anladım",

    ob1_title: "Konumuna ihtiyacımız var",
    ob1_text: "Durağına yaklaştığını anlayabilmemiz için konum iznine ihtiyaç duyuyoruz. Bu bilgi asla cihazının dışına çıkmaz, hiçbir sunucuya gönderilmez.",
    ob1_btn: "Konum İzni Ver",
    ob2_title: "Ekran kapalıyken de çalışırız",
    ob2_text: "Telefonu cebine koyup uyuyabilmen için, uygulama/sekme açık kaldığı sürece arka planda konumunu takip ederiz. Pil dostu, akıllı takip kullanırız.",
    ob3_title: "Bildirimlere izin ver",
    ob3_text: "Uyuyor olsan bile seni uyandırabilmemiz için ses, titreşim ve bildirim izinlerini açık tutmanı öneririz.",
    ob3_btn: "Bildirim İzni Ver",
    ob4_title: "Hazırsın!",
    ob4_text: "Şimdi sana haritayı kısaca gezdirelim. Adım adım nereye dokunacağını oklarla göstereceğiz.",
    ob4_btn: "Haritayı Göster",

    tour_search: "Buraya durak adı, şehir veya adres yazarak dünyanın her yerinde arama yapabilirsin.",
    tour_map: "İstersen haritaya doğrudan dokunarak hedefini işaretleyebilirsin — istediğin her ülkede çalışır.",
    tour_locate: "Bu düğmeyle anında kendi konumuna dönersin.",
    tour_zoom: "Buradan haritayı yakınlaştırıp uzaklaştırabilirsin.",
    tour_shortcuts: "Sık kullandığın yerlere buradan hızlıca ulaşabilirsin.",
    tour_step: "adım",

    search_placeholder: "Nereye gidiyorsun? Durak, şehir veya adres ara…",
    search_no_results: "Sonuç bulunamadı",
    recents: "Son Kullanılanlar",
    favorites: "Favoriler",

    nav_map: "Harita",
    nav_favorites: "Favoriler",
    nav_history: "Geçmiş",
    nav_settings: "Ayarlar",

    target_name_placeholder: "Hedefin adı (örn. Evin durağı)",
    address_loading: "Adres bulunuyor…",
    underground_hint: "Yeraltı / tünel hattı — sinyal kesilebilir, en az 1 km uyarı mesafesi önerilir.",
    radius_label: "Uyarı mesafesi",
    sound: "Ses",
    vibration: "Titreşim",
    flash: "Ekran yanıp sönme",
    start_trip: "Yolculuğu Başlat",
    cancel_sheet: "Vazgeç",
    already_close_confirm: "Zaten hedefe çok yakınsın. Yine de yolculuğu başlatmak istiyor musun?",

    trip_hint: "Ekranı kapatabilirsin, telefonu cebine koyabilirsin. Uygulamayı kapatma ya da sekmeyi kapatma — arka planda seni takip etmeye devam edebilmemiz için açık kalması gerekir.",
    trip_cancel: "Yolculuğu İptal Et",
    trip_cancel_confirm: "Yolculuğu iptal etmek istediğine emin misin?",
    trip_remaining_suffix: "kaldı",
    signal_weak: "Sinyal zayıf — son bilinen hız ile tahmini konum kullanılıyor",
    trip_completed_toast: "Yolculuk tamamlandı",
    trip_estimated: "(tahmini)",

    alarm_title: "GELDİK!",
    alarm_default_sub: "Hedefe yaklaştın",
    swipe_label: "Kaydırarak \"Uyandım\" de",
    snooze: "5 dk ertele",
    snooze_toast: "5 dakika sonra tekrar hatırlatacağız",

    fav_added: "Favorilere eklendi",
    fav_removed: "Favorilerden kaldırıldı",
    fav_empty: "Henüz favori eklemedin. Bir hedef seçip yıldız ikonuna dokun.",
    history_empty: "Henüz bir yolculuğun yok.",
    trip_done: "Tamamlandı",
    trip_cancelled: "İptal",

    settings_default_radius: "Varsayılan uyarı mesafesi",
    settings_unit: "Birim",
    settings_unit_auto: "Otomatik (m/km)",
    settings_unit_m: "Metre",
    settings_unit_km: "Kilometre",
    settings_theme: "Tema",
    settings_theme_system: "Sistem",
    settings_theme_light: "Açık",
    settings_theme_dark: "Koyu",
    settings_lang: "Dil",
    settings_default_sound: "Varsayılan ses",
    settings_default_vibration: "Varsayılan titreşim",
    settings_default_flash: "Varsayılan ekran yanıp sönme",
    settings_replay_tour: "Kullanım turunu tekrar oynat",
    settings_about: "Hakkında",

    about_desc: "Toplu taşımada (Marmaray, metro, metrobüs, otobüs, vapur, tren, şehirlerarası otobüs vb.) yolculuk yapan kişinin ineceği durağı kaçırmamasını sağlayan, dünyanın her yerinde kullanılabilen bir konum alarmı uygulamasıdır.",
    about_privacy_title: "Gizlilik",
    about_privacy_text: "Konum verin yalnızca cihazında/tarayıcında işlenir; hiçbir sunucuya gönderilmez (yazdığın arama metni hariç — bu yalnızca OpenStreetMap arama servisine gider). Hesap açma veya giriş yapma yoktur. Reklam ve izleme kütüphanesi kullanılmaz.",
    about_copyright_title: "Telif Hakkı",
    about_legal: "Bu yazılımın kaynak kodu, tasarımı, arayüzü, uygulama adı ve logosu Onur Teryakioğlu'nun mülkiyetindedir. Yazılı izin olmadan kopyalanamaz, değiştirilemez veya dağıtılamaz.",
    about_attrib: "Harita verileri © OpenStreetMap katkıcıları",
    version: "Sürüm",

    locate_error: "Konumuna ulaşılamadı. Konum iznini kontrol et.",
    geolocation_unsupported: "Tarayıcın konum özelliğini desteklemiyor.",
    permission_granted: "İzin verildi",
    permission_denied: "İzin reddedildi — Ayarlar'dan açabilirsin",
    passed_target_alarm: "Hedefi geçmiş olabilirsin!",
    reached_prefix: "Hedefe",
    alarm_msg: "Hedefe {dist} kaldı — {name}",
    trip_default_name: "Hedef",
    already_started_status: "Konum bulundu, teşekkürler!",
    tap_to_skip: "Geçmek için dokun",
    lines_title: "Yakındaki Hatlar",
    lines_hint: "Konumuna yakın raylı sistem/tramvay hatları — OpenStreetMap verisinden, dünyanın her yerinde otomatik bulunur.",
    lines_loading: "Yakındaki hatlar aranıyor…",
    lines_loading_slow: "Bu biraz uzun sürüyor, ücretsiz servis yoğun olabilir — lütfen bekle…",
    lines_empty: "Bu bölgede raylı sistem hattı bulunamadı. Yine de arama çubuğunu ya da haritaya dokunmayı kullanabilirsin.",
    lines_need_location: "Önce konumuna izin vermen ya da 'Konumuma git' demen gerekiyor.",
    lines_error: "Hatlar yüklenemedi. Bağlantını kontrol edip tekrar dene.",
    lines_stops_count: "{count} durak",
    tour_lines: "Buradan konumuna yakın metro/tramvay hatlarını ve duraklarını listeleyip hazır seçebilirsin.",
    retry: "Tekrar dene",
    lines_tab_lines: "Hatlar",
    lines_tab_stops: "Yakın Duraklar",
    stops_loading: "Yakındaki duraklar aranıyor…",
    stops_empty: "Yakınında otobüs/tramvay/metro durağı bulunamadı.",
    stops_need_location: "Yakın durakları görmek için önce konumuna izin vermen gerekiyor.",
    route_loading: "Rota hesaplanıyor…",
    route_walking: "Yürüme rotası",
    route_unavailable: "Gerçek rota bulunamadı — düz çizgi tahmini gösteriliyor",
    route_walking_short: "Yürüme",
  },
  en: {
    app_name: "Geldik Mi?",
    splash_tagline: "Don't miss your stop — sleep, we'll wake you.",
    credit_made_in: "Designed & built in Turkey",
    credit_made_by: "by Onur Teryakioğlu",
    credit_rights: "All rights reserved",
    credit_copyright: "© 2026 Geldik Mi?",

    skip_all: "Skip All",
    next: "Next",
    back: "Back",
    understood: "Got it",

    ob1_title: "We need your location",
    ob1_text: "We need location access to tell when you're getting close to your stop. This data never leaves your device or gets sent to any server.",
    ob1_btn: "Allow Location",
    ob2_title: "We keep working with the screen off",
    ob2_text: "So you can put your phone away and sleep, we track your location in the background as long as the app/tab stays open. We use smart, battery-friendly tracking.",
    ob3_title: "Allow notifications",
    ob3_text: "So we can wake you even if you're fast asleep, we recommend keeping sound, vibration and notifications turned on.",
    ob3_btn: "Allow Notifications",
    ob4_title: "You're all set!",
    ob4_text: "Let's take a quick tour of the map. We'll show you exactly where to tap, step by step, with arrows.",
    ob4_btn: "Show Map",

    tour_search: "Type a stop name, city or address here to search anywhere in the world.",
    tour_map: "Or tap directly on the map to drop a pin — works in any country.",
    tour_locate: "This button instantly jumps back to your own location.",
    tour_zoom: "Zoom the map in and out from here.",
    tour_shortcuts: "Quickly jump to your frequent places from here.",
    tour_step: "of",

    search_placeholder: "Where are you headed? Search a stop, city or address…",
    search_no_results: "No results found",
    recents: "Recent",
    favorites: "Favorites",

    nav_map: "Map",
    nav_favorites: "Favorites",
    nav_history: "History",
    nav_settings: "Settings",

    target_name_placeholder: "Destination name (e.g. My stop home)",
    address_loading: "Finding address…",
    underground_hint: "Underground / tunnel line — signal may drop, at least a 1 km radius is recommended.",
    radius_label: "Alert distance",
    sound: "Sound",
    vibration: "Vibration",
    flash: "Screen flash",
    start_trip: "Start Trip",
    cancel_sheet: "Cancel",
    already_close_confirm: "You're already very close to the destination. Start the trip anyway?",

    trip_hint: "You can turn your screen off and put your phone away. Don't close the app or the tab — it needs to stay open so we can keep tracking you in the background.",
    trip_cancel: "Cancel Trip",
    trip_cancel_confirm: "Are you sure you want to cancel this trip?",
    trip_remaining_suffix: "left",
    signal_weak: "Weak signal — estimating position from last known speed",
    trip_completed_toast: "Trip completed",
    trip_estimated: "(estimated)",

    alarm_title: "YOU'RE HERE!",
    alarm_default_sub: "You're near your destination",
    swipe_label: "Swipe to say \"I'm awake\"",
    snooze: "Snooze 5 min",
    snooze_toast: "We'll remind you again in 5 minutes",

    fav_added: "Added to favorites",
    fav_removed: "Removed from favorites",
    fav_empty: "No favorites yet. Pick a destination and tap the star icon.",
    history_empty: "No trips yet.",
    trip_done: "Completed",
    trip_cancelled: "Cancelled",

    settings_default_radius: "Default alert distance",
    settings_unit: "Unit",
    settings_unit_auto: "Automatic (m/km)",
    settings_unit_m: "Meters",
    settings_unit_km: "Kilometers",
    settings_theme: "Theme",
    settings_theme_system: "System",
    settings_theme_light: "Light",
    settings_theme_dark: "Dark",
    settings_lang: "Language",
    settings_default_sound: "Default sound",
    settings_default_vibration: "Default vibration",
    settings_default_flash: "Default screen flash",
    settings_replay_tour: "Replay the guided tour",
    settings_about: "About",

    about_desc: "Geldik Mi? is a location alarm app, usable anywhere in the world, that stops you from missing your stop on public transit (rail, metro, bus rapid transit, ferry, train, intercity coach, etc).",
    about_privacy_title: "Privacy",
    about_privacy_text: "Your location is processed only on your device/browser; nothing is sent to any server (except the text you type into search, which goes only to the OpenStreetMap search service). No account or sign-in. No ads or trackers.",
    about_copyright_title: "Copyright",
    about_legal: "The source code, design, interface, app name and logo of this software are the property of Onur Teryakioğlu. May not be copied, modified or distributed without written permission.",
    about_attrib: "Map data © OpenStreetMap contributors",
    version: "Version",

    locate_error: "Couldn't get your location. Check your location permission.",
    geolocation_unsupported: "Your browser doesn't support geolocation.",
    permission_granted: "Permission granted",
    permission_denied: "Permission denied — you can enable it in Settings",
    passed_target_alarm: "You may have passed your destination!",
    reached_prefix: "Destination",
    alarm_msg: "{dist} to {name}",
    trip_default_name: "Destination",
    already_started_status: "Location found, thanks!",
    tap_to_skip: "Tap to skip",
    lines_title: "Nearby Lines",
    lines_hint: "Rail/tram lines near your location — found automatically from OpenStreetMap data, anywhere in the world.",
    lines_loading: "Looking for nearby lines…",
    lines_loading_slow: "This is taking a bit longer — the free service may be busy, please wait…",
    lines_empty: "No rail system line found in this area. You can still use the search bar or tap the map directly.",
    lines_need_location: "You need to allow location access, or tap 'Go to my location' first.",
    lines_error: "Couldn't load lines. Check your connection and try again.",
    lines_stops_count: "{count} stops",
    tour_lines: "From here you can browse metro/tram lines and stops near you, and pick one ready-made.",
    retry: "Try again",
    lines_tab_lines: "Lines",
    lines_tab_stops: "Nearby Stops",
    stops_loading: "Looking for nearby stops…",
    stops_empty: "No bus/tram/metro stop found near you.",
    stops_need_location: "You need to allow location access first to see nearby stops.",
    route_loading: "Calculating route…",
    route_walking: "Walking route",
    route_unavailable: "Couldn't find a real route — showing a straight-line estimate",
    route_walking_short: "Walking",
  },
};

const I18N_STATE = { lang: "tr" };

function detectLang() {
  try {
    const saved = JSON.parse(localStorage.getItem("geldikmi_settings") || "{}");
    if (saved.lang === "tr" || saved.lang === "en") return saved.lang;
  } catch (e) {}
  const nav = (navigator.language || "tr").toLowerCase();
  return nav.startsWith("tr") ? "tr" : "en";
}

function t(key, vars) {
  const dict = I18N[I18N_STATE.lang] || I18N.tr;
  let str = dict[key] != null ? dict[key] : (I18N.en[key] || key);
  if (vars) {
    Object.keys(vars).forEach((k) => { str = str.replace("{" + k + "}", vars[k]); });
  }
  return str;
}

function setLang(lang) {
  I18N_STATE.lang = lang === "en" ? "en" : "tr";
  document.documentElement.lang = I18N_STATE.lang;
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  document.title = t("app_name") + (I18N_STATE.lang === "tr" ? " — Durağını Kaçırma" : " — Don't Miss Your Stop");
  if (window.onLangChanged) window.onLangChanged();
}

I18N_STATE.lang = detectLang();
