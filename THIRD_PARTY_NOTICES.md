# Üçüncü Taraf Bileşenler

"Geldik Mi?" aşağıdaki açık kaynak bileşenleri ve verileri kullanır. Bu
bileşenlerin lisansları korunur; bu durum Yazılım'ın kendisinin tescilli
(bkz. [LICENSE](LICENSE)) olmasına engel değildir.

| Bileşen | Lisans | Kullanım amacı |
|---|---|---|
| [Leaflet](https://leafletjs.com/) | BSD-2-Clause | Harita render motoru |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) verileri ve harita karoları | ODbL | Harita altlığı — `© OpenStreetMap katkıcıları` atfı uygulama içinde gösterilir |
| [Nominatim](https://nominatim.org/release-docs/latest/api/Search/) arama servisi | ODbL / Nominatim Kullanım Politikası | Adres arama ve ters geocoding — özel `User-Agent` ile, istemci tarafında saniyede 1 istekle sınırlı |
| [Lexend](https://fonts.google.com/specimen/Lexend) yazı tipi (Google Fonts) | SIL Open Font License 1.1 | Arayüz tipografisi |

Uygulama hiçbir reklam veya izleme (tracker) kütüphanesi içermez. Konum
verisi yalnızca cihazda/tarayıcıda işlenir; arama sorguları dışında hiçbir
veri sunucuya gönderilmez.

Alarm sesi, üçüncü taraf bir ses dosyası kullanılmadan, tarayıcının
Web Audio API'si ile uygulama içinde anlık olarak üretilir (özgün, telifsiz).
