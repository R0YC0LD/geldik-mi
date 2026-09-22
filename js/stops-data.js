/*
  Geldik Mi?
  Copyright (c) 2026 Onur Teryakioğlu. Tüm hakları saklıdır.
  Bu dosya Onur Teryakioğlu'nun yazılı izni olmadan kopyalanamaz,
  değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz.
*/

// Yerel durak veritabanı — ilk sürüm, İstanbul odaklı başlangıç seti.
// "verified": false olan koordinatlar yaklaşıktır, OpenStreetMap ile
// teyit edilmeden hassas navigasyon için kullanılmamalıdır.
// Yapı, ileride başka şehirlerin (Ankara, İzmir vb.) eklenmesine uygundur.
const STOPS_DATA = [
  // ---- Marmaray ----
  {id:"marmaray_halkali", name:"Halkalı", line:"Marmaray", type:"rail", district:"Küçükçekmece", city:"İstanbul", lat:41.0072, lng:28.7739, underground:false, verified:true},
  {id:"marmaray_florya", name:"Florya", line:"Marmaray", type:"rail", district:"Bakırköy", city:"İstanbul", lat:40.9776, lng:28.7889, underground:false, verified:false},
  {id:"marmaray_yesilkoy", name:"Yeşilköy", line:"Marmaray", type:"rail", district:"Bakırköy", city:"İstanbul", lat:40.9689, lng:28.8215, underground:false, verified:false},
  {id:"marmaray_atakoy", name:"Ataköy", line:"Marmaray", type:"rail", district:"Bakırköy", city:"İstanbul", lat:40.9776, lng:28.8663, underground:false, verified:false},
  {id:"marmaray_bakirkoy", name:"Bakırköy", line:"Marmaray", type:"rail", district:"Bakırköy", city:"İstanbul", lat:40.9819, lng:28.8722, underground:false, verified:false},
  {id:"marmaray_zeytinburnu", name:"Zeytinburnu", line:"Marmaray", type:"rail", district:"Zeytinburnu", city:"İstanbul", lat:40.9917, lng:28.9053, underground:false, verified:false},
  {id:"marmaray_yenikapi", name:"Yenikapı", line:"Marmaray", type:"rail", district:"Fatih", city:"İstanbul", lat:41.0053, lng:28.9497, underground:true, verified:true},
  {id:"marmaray_sirkeci", name:"Sirkeci", line:"Marmaray", type:"rail", district:"Fatih", city:"İstanbul", lat:41.0136, lng:28.9769, underground:true, verified:true},
  {id:"marmaray_uskudar", name:"Üsküdar", line:"Marmaray", type:"rail", district:"Üsküdar", city:"İstanbul", lat:41.0255, lng:29.0152, underground:true, verified:true},
  {id:"marmaray_ayrilikcesmesi", name:"Ayrılık Çeşmesi", line:"Marmaray", type:"rail", district:"Kadıköy", city:"İstanbul", lat:40.9942, lng:29.0295, underground:true, verified:false},
  {id:"marmaray_sogutlucesme", name:"Söğütlüçeşme", line:"Marmaray", type:"rail", district:"Kadıköy", city:"İstanbul", lat:40.9897, lng:29.0409, underground:false, verified:false},
  {id:"marmaray_bostanci", name:"Bostancı", line:"Marmaray", type:"rail", district:"Kadıköy", city:"İstanbul", lat:40.9553, lng:29.0956, underground:false, verified:false},
  {id:"marmaray_maltepe", name:"Maltepe", line:"Marmaray", type:"rail", district:"Maltepe", city:"İstanbul", lat:40.9231, lng:29.1367, underground:false, verified:false},
  {id:"marmaray_kartal", name:"Kartal", line:"Marmaray", type:"rail", district:"Kartal", city:"İstanbul", lat:40.9061, lng:29.1897, underground:false, verified:false},
  {id:"marmaray_pendik", name:"Pendik", line:"Marmaray", type:"rail", district:"Pendik", city:"İstanbul", lat:40.8778, lng:29.2436, underground:false, verified:false},
  {id:"marmaray_gebze", name:"Gebze", line:"Marmaray", type:"rail", district:"Gebze", city:"Kocaeli", lat:40.8027, lng:29.4306, underground:false, verified:false},

  // ---- Metro (M1, M2, M4 başlıca istasyonlar) ----
  {id:"metro_aksaray", name:"Aksaray", line:"M1", type:"metro", district:"Fatih", city:"İstanbul", lat:41.0126, lng:28.9558, underground:true, verified:false},
  {id:"metro_otogar", name:"Otogar", line:"M1", type:"metro", district:"Bayrampaşa", city:"İstanbul", lat:41.0392, lng:28.8925, underground:true, verified:false},
  {id:"metro_taksim", name:"Taksim", line:"M2", type:"metro", district:"Beyoğlu", city:"İstanbul", lat:41.0369, lng:28.9850, underground:true, verified:true},
  {id:"metro_sisli_mecidiyekoy", name:"Şişli-Mecidiyeköy", line:"M2", type:"metro", district:"Şişli", city:"İstanbul", lat:41.0631, lng:28.9977, underground:true, verified:false},
  {id:"metro_levent", name:"Levent", line:"M2", type:"metro", district:"Beşiktaş", city:"İstanbul", lat:41.0822, lng:29.0111, underground:true, verified:false},
  {id:"metro_hacıosman", name:"Hacıosman", line:"M2", type:"metro", district:"Sarıyer", city:"İstanbul", lat:41.1105, lng:29.0217, underground:false, verified:false},
  {id:"metro_kadikoy", name:"Kadıköy", line:"M4", type:"metro", district:"Kadıköy", city:"İstanbul", lat:40.9903, lng:29.0275, underground:true, verified:false},
  {id:"metro_kozyatagi", name:"Kozyatağı", line:"M4", type:"metro", district:"Kadıköy", city:"İstanbul", lat:40.9713, lng:29.1017, underground:true, verified:false},
  {id:"metro_kartal_m4", name:"Kartal", line:"M4", type:"metro", district:"Kartal", city:"İstanbul", lat:40.9048, lng:29.1875, underground:false, verified:false},

  // ---- Metrobüs ----
  {id:"metrobus_zincirlikuyu", name:"Zincirlikuyu", line:"Metrobüs", type:"bus", district:"Şişli", city:"İstanbul", lat:41.0656, lng:29.0117, underground:false, verified:false},
  {id:"metrobus_mecidiyekoy", name:"Mecidiyeköy", line:"Metrobüs", type:"bus", district:"Şişli", city:"İstanbul", lat:41.0631, lng:28.9977, underground:false, verified:false},
  {id:"metrobus_avcilar", name:"Avcılar", line:"Metrobüs", type:"bus", district:"Avcılar", city:"İstanbul", lat:40.9800, lng:28.7215, underground:false, verified:false},
  {id:"metrobus_sogutlucesme", name:"Söğütlüçeşme", line:"Metrobüs", type:"bus", district:"Kadıköy", city:"İstanbul", lat:40.9897, lng:29.0409, underground:false, verified:false},
  {id:"metrobus_altunizade", name:"Altunizade", line:"Metrobüs", type:"bus", district:"Üsküdar", city:"İstanbul", lat:41.0233, lng:29.0472, underground:false, verified:false},

  // ---- Vapur iskeleleri ----
  {id:"vapur_eminonu", name:"Eminönü İskelesi", line:"Vapur", type:"ferry", district:"Fatih", city:"İstanbul", lat:41.0176, lng:28.9709, underground:false, verified:false},
  {id:"vapur_kadikoy", name:"Kadıköy İskelesi", line:"Vapur", type:"ferry", district:"Kadıköy", city:"İstanbul", lat:40.9917, lng:29.0244, underground:false, verified:false},
  {id:"vapur_besiktas", name:"Beşiktaş İskelesi", line:"Vapur", type:"ferry", district:"Beşiktaş", city:"İstanbul", lat:41.0428, lng:29.0075, underground:false, verified:false},
  {id:"vapur_uskudar", name:"Üsküdar İskelesi", line:"Vapur", type:"ferry", district:"Üsküdar", city:"İstanbul", lat:41.0258, lng:29.0134, underground:false, verified:false},
  {id:"vapur_kabatas", name:"Kabataş İskelesi", line:"Vapur", type:"ferry", district:"Beyoğlu", city:"İstanbul", lat:41.0328, lng:28.9925, underground:false, verified:false}
];

// Hat türüne göre özgün ikon (sprite.svg sembol id'si)
const STOP_TYPE_ICON = {rail:"i-train", metro:"i-subway", bus:"i-bus", ferry:"i-ferry"};
