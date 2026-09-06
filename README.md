# kidsgo — nextplace.day/zh 本地複刻（假資料版・繁體中文）

照抄 https://www.nextplace.day/zh 的版面、互動與資料結構，不依賴 Node，
純靜態 HTML + 原站編譯後的 Tailwind CSS + 原生 JS，用 Python 內建伺服器跑。

## 啟動

```bash
python3 serve.py            # http://127.0.0.1:3000/zh
python3 serve.py --port 8080
```

## 重新產生假資料

```bash
python3 scripts/gen_fake_data.py --seed 7
```

會覆寫 `public/data/places.json` 與 `public/images/*.svg`（佔位圖）。

## 互動 smoke test（需要本機有 Chrome）

```bash
python3 serve.py &        # 先把伺服器跑起來
scripts/smoke.sh 3000     # 無頭 Chrome 跑 tests/smoke.html，逐項印出結果
```

## 結構

```
serve.py                  路由：/zh, /zh/place/<slug>, /zh/about, /zh/credits（en 同）
scripts/gen_fake_data.py  假資料 + SVG 佔位圖產生器
scripts/smoke.sh          無頭 Chrome 互動測試（tests/smoke.html，路由 /__smoke）
public/
  index.html / place.html / about.html / credits.html
  assets/css/site.css     原站編譯後的 Tailwind v4 CSS（字型路徑改為本地）
  assets/fonts/           Plus Jakarta Sans（woff2）
  assets/js/app.js        共用：i18n 字典、常數、localStorage、Header/Footer/卡片/Modal
  assets/js/home.js       首頁 Explorer（分類、年齡、天氣、篩選、排序、收藏、🎯 幫我決定）
  assets/js/place.js      地點詳情頁
  assets/js/credits.js    照片版權頁
  data/places.json        假資料（欄位與原站 Place 型別一致）
  images/*.svg            佔位圖
```

## 之後換真資料

只要換 `public/data/places.json`：

- `places[]`：`slug, name, city, category, lat, lng, driveMin, toddlerRating, strollerFriendly, shade, cost, parking, durationHours, bestSeason, weather, tags, highlight, tips, url, reservationsRequired, image`
- `driveMatrix`：每個 slug 對 13 個出發城市的車程（分鐘）
- `ageOverrides`：個別地點的年齡覆寫
- `credits`：照片版權
- `forecast / season / suggestedMood`：原站是即時抓 Open-Meteo，這裡先寫死

## 與原站的差異

- 天氣是假的（不打 Open-Meteo）；換出發城市或看詳情頁時用座標做確定性擾動模擬「目的地預報」。
- 只保留 zh / en 兩個語系（原站有 7 個）。zh 全部改為繁體中文、台灣用語（帶小孩、推車友善、揹巾、廁所、°C），html lang 為 zh-TW；地點假資料也是繁中。
- 地圖仍用 OpenStreetMap 的 embed iframe（需要網路）。
- 圖片是 SVG 佔位圖，不是 Wikimedia 照片。
