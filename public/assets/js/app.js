/* nextplace 本地複刻 — 共用模組（常數、i18n、儲存、元件） */
(function () {
  "use strict";
  const NP = (window.NP = {});

  NP.BRAND = "nextplace";
  NP.FEEDBACK_EMAIL = "support@example.com";
  NP.LOCALES = ["zh", "en"];
  NP.LOCALE_NAMES = { zh: "中文", en: "English" };

  // ---------- i18n（照抄原站字典，只保留 zh / en） ----------
  NP.UI = {
    zh: {
      htmlLang: "zh-TW",
      tempUnit: "C",
      siteTitle: "南灣週末去哪裡 · nextplace",
      siteDescription: "幫南灣（Sunnyvale / Cupertino 一帶）家有 0–10 歲小孩的家庭挑週末去處：健行、農場、遊戲場、室內館、海灘、小火車。",
      header: { area: "南灣", who: "帶小孩", when: "這個週末", about: "關於", menu: "選單", switchLabel: "English" },
      cats: { all: "全部", favs: "收藏" },
      location: { title: "你從哪裡出發？", useCurrent: "使用目前位置", locating: "定位中…", denied: "沒有取得定位權限，從下面選一個城市吧", estimateNote: "車程以最近的基準城市估算，僅供參考" },
      sort: { rec: "推薦", near: "最近", fit: "適齡" },
      favShare: { share: "分享收藏", imported: (a) => `已匯入 ${a} 個收藏` },
      age: { question: "小孩幾歲？", groups: { baby: "0–1 歲", toddler: "1–3 歲", preschool: "3–5 歲", school: "5–10 歲" } },
      catNames: { hike: "健行", farm: "農場", playground: "遊戲場", indoor: "室內", beach: "海灘", train: "小火車", garden: "花園", zoo: "動物園", museum: "博物館", seasonal: "季節限定" },
      actions: { filters: "篩選", decide: "🎯 幫我決定", adjust: "調整", clearAll: "全部清除", clearFilters: "清除篩選", showN: (a) => `顯示 ${a} 個地方`, share: "分享", copied: "已複製連結", save: "收藏", unsave: "取消收藏", navigate: "開始導航", details: "看詳細資訊", again: "換一個" },
      weather: {
        unavailable: "週末天氣暫時抓不到", rain: (a) => `降雨機率 ${a}%`,
        day: { sat: "週六", sun: "週日", today: "今天" },
        summary: { clear: "晴天", partly: "多雲時晴", overcast: "陰天", fog: "有霧", drizzle: "毛毛雨", rain: "下雨", sleet: "雨夾雪", showers: "陣雨", thunder: "雷陣雨" },
        mood: { rainy: "可能會下雨，已優先排室內和不怕雨的地方", hot: "蠻熱的，已優先排樹蔭多、有水的地方", cool: "偏涼，適合走走路、逛農場", nice: "天氣不錯，戶外隨便挑" },
        moodNames: { any: "不限", nice: "天氣好", hot: "很熱", cool: "涼爽", rainy: "下雨" },
      },
      list: { headingAll: (a) => `這個週末的 ${a} 個去處`, headingCat: (a, e) => `${a} · ${e} 個地方`, headingFavs: (a) => `收藏的 ${a} 個地方`, sortNote: "依適齡度 · 天氣 · 距離排序", emptyFavsTitle: "還沒有收藏", emptyFavsDesc: "點卡片右上角的 ❤️ 就能收藏。", emptyTitle: "沒有符合條件的地方", emptyDesc: "把車程拉長一點，或把「只看免費」關掉試試。" },
      card: { driveMin: (a) => `車程 ${a} 分鐘`, hours: (a) => `${a} 小時`, stroller: "推車友善", carrier: "建議揹巾", reservation: "需預約", free: "免費", parking: "停車：", favBadge: "小孩最愛", genericBadge: "示意圖", toddlerFit: "適齡度" },
      filterModal: { title: "篩選", drive: "車程", driveDesc: (a, e) => `從 ${e} 出發，最多 ${a} 分鐘`, min10: "10 分鐘", min90: "150 分鐘", weather: "天氣", weatherAuto: (a) => `依週六預報自動選了「${a}」`, duration: "要在外面玩多久", durAny: "不限", dur15: "1.5 小時以內", dur25: "半天（2.5 小時以內）", dur4: "一整天", needs: "帶小孩必備", strollerTitle: "只看推車友善", strollerDesc: "路面平坦、推得動推車，不用揹巾", freeTitle: "只看免費", freeDesc: "不含停車費" },
      pick: { picking: "挑選中…", goHere: "就去這裡", weightedNote: (a) => `從 ${a} 個地方裡依適齡度加權抽籤`, tips: "小提醒：", duration: "停留時間", cost: "費用", stroller: "推車", strollerOk: "可以", strollerCarrier: "揹巾" },
      detail: { similar: "同類", aboutDrive: (a) => `車程約 ${a} 分鐘`, fromHome: (a) => `從 ${a} 出發`, parkingLabel: "停車", strollerTitle: "推車友善", strollerDesc: "路面平整，可以一路推推車", carrierTitle: "建議用揹巾", carrierDesc: "路況不適合推車，用揹巾比較輕鬆", typicalVisit: (a) => `通常玩 ${a} 小時`, bestSeason: "最佳季節：", hours: (a) => `${a} 小時`, perFamily: "/ 一家人", resYes: "需要預約", resNo: "不用預約", resUnknown: "預約規定請看官網", fitLabel: "適齡度", offers: "這個地方有什麼", weekendIn: (a) => `這個週末 ${a} 的天氣`, destNote: "目的地當地的預報（海邊和山上常常和家裡不一樣）", location: "位置", gmaps: "Google 地圖導航", amaps: "Apple 地圖導航", website: "官網 / 查營業時間 ↗", confirm: "出發前請確認營業時間與預約規定", moreLikeThis: "同類的其他選擇", photo: "照片：", generic: "示意圖 · ", tips: "💡 小提醒" },
      footer: { blurb: "給住在南灣、家有 0–10 歲小孩的家庭用的「週末去哪裡」。", dataTitle: "資料", dataNote: "人工整理，出發前請到官網確認營業時間與預約", weatherSrc: "天氣資料來自 Open-Meteo", mapsSrc: "地圖來自 OpenStreetMap · 照片來自 Wikimedia Commons", linksTitle: "連結", aboutLink: "關於 & 推薦分數怎麼算", allLink: "所有地點", creditsLink: "照片版權（Wikimedia Commons）", feedback: "意見回饋" },
      labels: { shade: { low: "遮蔭少", medium: "部分遮蔭", high: "樹蔭很多" }, season: { spring: "春", summer: "夏", fall: "秋", winter: "冬" }, weatherTag: { sunny: "晴天適合", hot: "熱天也 OK", cool: "涼天適合", "rain-ok": "下雨也 OK", "windy-ok": "有風也 OK" } },
      reasons: { top: "這個年齡的首選去處", great: "很適合這個年齡", inSeason: "正好當季", shadeHot: "樹蔭多，熱天也舒服", rainOk: "下雨也不怕", close: (a) => `車程只要 ${a} 分鐘`, stroller: "推車友善", free: "免費" },
      about: { title: "關於 nextplace", credits: "照片版權", close: "關閉", mapTitle: "地圖", notFound: "找不到這個地點", backHome: "回首頁" },
    },
    en: {
      htmlLang: "en",
      tempUnit: "F",
      siteTitle: "South Bay Weekends · nextplace",
      siteDescription: "Weekend outings for South Bay (Sunnyvale / Cupertino) families with kids 0–10: hikes, farms, playgrounds, museums, beaches, and little trains.",
      header: { area: "South Bay", who: "With kids", when: "This weekend", about: "About", menu: "Menu", switchLabel: "中文" },
      cats: { all: "All", favs: "Saved" },
      location: { title: "Where are you starting from?", useCurrent: "Use current location", locating: "Locating…", denied: "Couldn't get your location — pick a city below", estimateNote: "Drive times are estimates from the nearest hub city" },
      sort: { rec: "Recommended", near: "Nearest", fit: "Best fit" },
      favShare: { share: "Share saved", imported: (a) => `Imported ${a} saved places` },
      age: { question: "How old is your kid?", groups: { baby: "0–1 yr", toddler: "1–3 yrs", preschool: "3–5 yrs", school: "5–10 yrs" } },
      catNames: { hike: "Hike", farm: "Farm", playground: "Playground", indoor: "Indoor", beach: "Beach", train: "Train", garden: "Garden", zoo: "Zoo", museum: "Museum", seasonal: "Seasonal" },
      actions: { filters: "Filters", decide: "🎯 Decide for me", adjust: "adjust", clearAll: "Clear all", clearFilters: "Clear filters", showN: (a) => `Show ${a} places`, share: "Share", copied: "Link copied", save: "Save", unsave: "Unsave", navigate: "Navigate", details: "Details", again: "Pick again" },
      weather: {
        unavailable: "Weekend forecast unavailable right now", rain: (a) => `${a}% rain`,
        day: { sat: "Sat", sun: "Sun", today: "Today" },
        summary: { clear: "Sunny", partly: "Partly cloudy", overcast: "Overcast", fog: "Foggy", drizzle: "Drizzle", rain: "Rain", sleet: "Sleet", showers: "Showers", thunder: "Thunderstorms" },
        mood: { rainy: "Rain likely — indoor and rain-OK spots boosted", hot: "Hot one — shady and watery spots boosted", cool: "On the cool side — great for walks and farms", nice: "Nice weather — anything outdoors works" },
        moodNames: { any: "Any", nice: "Nice", hot: "Hot", cool: "Cool", rainy: "Rainy" },
      },
      list: { headingAll: (a) => `${a} places for this weekend`, headingCat: (a, e) => `${a} · ${e} places`, headingFavs: (a) => `${a} saved places`, sortNote: "Sorted by age fit · weather · distance", emptyFavsTitle: "Nothing saved yet", emptyFavsDesc: "Tap the ❤️ on any card to save it.", emptyTitle: "No places match", emptyDesc: "Try a longer drive time, or turn off “free only”." },
      card: { driveMin: (a) => `${a} min drive`, hours: (a) => `${a} h`, stroller: "stroller-friendly", carrier: "carrier recommended", reservation: "reservation needed", free: "Free", parking: "Parking: ", favBadge: "Kid favorite", genericBadge: "Representative photo", toddlerFit: "age fit" },
      filterModal: { title: "Filters", drive: "Drive time", driveDesc: (a, e) => `Up to ${a} minutes from ${e}`, min10: "10 min", min90: "150 min", weather: "Weather", weatherAuto: (a) => `Auto-selected “${a}” from Saturday's forecast`, duration: "How long to stay out", durAny: "Any", dur15: "Under 1.5 hours", dur25: "Half day (under 2.5 h)", dur4: "Full day", needs: "Toddler essentials", strollerTitle: "Stroller-friendly only", strollerDesc: "Flat paths, no carrier needed", freeTitle: "Free only", freeDesc: "Not counting parking fees" },
      pick: { picking: "Picking…", goHere: "Go here", weightedNote: (a) => `A weighted draw from ${a} places, favoring age fit`, tips: "Tips: ", duration: "Duration", cost: "Cost", stroller: "Stroller", strollerOk: "OK", strollerCarrier: "Carrier" },
      detail: { similar: "Similar", aboutDrive: (a) => `About ${a} min drive`, fromHome: (a) => `From ${a}`, parkingLabel: "Parking", strollerTitle: "Stroller-friendly", strollerDesc: "Flat surfaces — bring the stroller", carrierTitle: "Carrier recommended", carrierDesc: "Terrain isn't stroller-friendly; a carrier is easier", typicalVisit: (a) => `Typical visit: ${a} hours`, bestSeason: "Best seasons: ", hours: (a) => `${a} hours`, perFamily: "/ family", resYes: "Reservation required", resNo: "No reservation needed", resUnknown: "Check website for reservations", fitLabel: "age fit", offers: "What this place offers", weekendIn: (a) => `This weekend's weather in ${a}`, destNote: "Forecast at the destination itself (coast and hills often differ from home)", location: "Location", gmaps: "Navigate with Google Maps", amaps: "Navigate with Apple Maps", website: "Official site / hours ↗", confirm: "Confirm hours and reservations before you go", moreLikeThis: "More like this", photo: "Photo: ", generic: "Representative photo · ", tips: "💡 Tips" },
      footer: { blurb: "A weekend-outing picker for South Bay families with kids 0–10.", dataTitle: "Data", dataNote: "Hand-curated — confirm hours and reservations before you go", weatherSrc: "Weather by Open-Meteo", mapsSrc: "Maps by OpenStreetMap · Photos from Wikimedia Commons", linksTitle: "Links", aboutLink: "About & how scoring works", allLink: "All places", creditsLink: "Photo credits (Wikimedia Commons)", feedback: "Send feedback" },
      labels: { shade: { low: "Little shade", medium: "Some shade", high: "Lots of shade" }, season: { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" }, weatherTag: { sunny: "Great on sunny days", hot: "Handles heat", cool: "Good on cool days", "rain-ok": "Rain-OK", "windy-ok": "Wind-OK" } },
      reasons: { top: "A top pick for this age", great: "Great for this age", inSeason: "In season right now", shadeHot: "Plenty of shade for a hot day", rainOk: "Fine in the rain", close: (a) => `Only a ${a} min drive`, stroller: "Stroller-friendly", free: "Free" },
      about: { title: "About nextplace", credits: "Photo credits", close: "Close", mapTitle: "map", notFound: "Place not found", backHome: "Back home" },
    },
  };

  NP.CATEGORY_META = {
    hike: { label: "Hike", zh: "健行", emoji: "🥾" }, farm: { label: "Farm", zh: "農場", emoji: "🐐" },
    playground: { label: "Playground", zh: "遊戲場", emoji: "🛝" }, indoor: { label: "Indoor", zh: "室內", emoji: "🏠" },
    beach: { label: "Beach", zh: "海灘", emoji: "🏖️" }, train: { label: "Train", zh: "小火車", emoji: "🚂" },
    garden: { label: "Garden", zh: "花園", emoji: "🌷" }, zoo: { label: "Zoo", zh: "動物園", emoji: "🦒" },
    museum: { label: "Museum", zh: "博物館", emoji: "🎨" }, seasonal: { label: "Seasonal", zh: "季節限定", emoji: "🎃" },
  };
  NP.CATEGORY_COLORS = {
    hike: ["#2f6b50", "#8fae7a"], farm: ["#c9722f", "#f0b27a"], playground: ["#e9a23b", "#f7d78a"], indoor: ["#4d6fb0", "#9db6e3"],
    beach: ["#2f8fb5", "#9bd3e6"], train: ["#7a4b3a", "#c49a86"], garden: ["#c25f85", "#efb2c8"], zoo: ["#a67c1e", "#e3c46b"],
    museum: ["#5b5fb5", "#aeb0e6"], seasonal: ["#d9682f", "#f6b48a"],
  };
  NP.ANCHORS = [
    { id: "sunnyvale", label: "Sunnyvale", lat: 37.3688, lng: -122.0363 }, { id: "cupertino", label: "Cupertino", lat: 37.323, lng: -122.0322 },
    { id: "mountain-view", label: "Mountain View", lat: 37.3861, lng: -122.0839 }, { id: "palo-alto", label: "Palo Alto", lat: 37.4419, lng: -122.143 },
    { id: "san-jose", label: "San Jose", lat: 37.3382, lng: -121.8863 }, { id: "milpitas", label: "Milpitas", lat: 37.4323, lng: -121.8996 },
    { id: "fremont", label: "Fremont", lat: 37.5485, lng: -121.9886 }, { id: "san-mateo", label: "San Mateo", lat: 37.563, lng: -122.3255 },
    { id: "san-francisco", label: "San Francisco", lat: 37.7749, lng: -122.4194 }, { id: "oakland", label: "Oakland", lat: 37.8044, lng: -122.2712 },
    { id: "berkeley", label: "Berkeley", lat: 37.8715, lng: -122.273 }, { id: "santa-cruz", label: "Santa Cruz", lat: 36.9741, lng: -122.0308 },
    { id: "morgan-hill", label: "Morgan Hill", lat: 37.1305, lng: -121.6544 },
  ];
  NP.DEFAULT_HOME = { anchorId: "sunnyvale", label: "Sunnyvale", lat: 37.3688, lng: -122.0363 };
  NP.AGE_GROUPS = ["baby", "toddler", "preschool", "school"];
  NP.DEFAULT_AGE = "toddler";
  const CATEGORY_AGE_BONUS = {
    hike: { baby: 0, toddler: 0, preschool: 0, school: 0 }, farm: { baby: 0, toddler: 0, preschool: 0, school: -1 },
    playground: { baby: -1, toddler: 0, preschool: 0, school: -1 }, indoor: { baby: -2, toddler: 0, preschool: 1, school: -1 },
    beach: { baby: -1, toddler: 0, preschool: 0, school: 1 }, train: { baby: 0, toddler: 0, preschool: 0, school: 0 },
    garden: { baby: 0, toddler: 0, preschool: 0, school: -1 }, zoo: { baby: -1, toddler: 0, preschool: 0, school: 0 },
    museum: { baby: -1, toddler: 0, preschool: 0, school: 0 }, seasonal: { baby: -1, toddler: 0, preschool: 0, school: 0 },
  };

  // ---------- 小工具 ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  NP.esc = esc;
  NP.h = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (Array.isArray(vals[i]) ? vals[i].join("") : vals[i] ?? "") : ""), "");
  NP.el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  NP.locale = (() => {
    const m = location.pathname.match(/^\/(zh|en)(?=\/|$)/);
    return m ? m[1] : "zh";
  })();
  NP.t = NP.UI[NP.locale];
  NP.pathWithoutLocale = location.pathname.replace(/^\/(zh|en)(?=\/|$)/, "") || "";

  NP.haversineMi = (a, e, n, o) => 7917.6 * Math.asin(Math.sqrt(Math.sin(((n - a) * Math.PI) / 180 / 2) ** 2 + Math.cos((a * Math.PI) / 180) * Math.cos((n * Math.PI) / 180) * Math.sin(((o - e) * Math.PI) / 180 / 2) ** 2));
  NP.nearestAnchor = (lat, lng) => {
    let best = NP.ANCHORS[0], d = Infinity;
    for (const a of NP.ANCHORS) { const x = NP.haversineMi(lat, lng, a.lat, a.lng); if (x < d) { d = x; best = a; } }
    return best;
  };
  NP.driveMinFrom = (place, home) => {
    const matrix = (NP.data && NP.data.driveMatrix) || {};
    const base = matrix[place.slug]?.[home.anchorId] ?? place.driveMin;
    if (!home.custom) return base;
    const anchor = NP.ANCHORS.find((a) => a.id === home.anchorId) ?? NP.ANCHORS[0];
    const delta = ((NP.haversineMi(home.lat, home.lng, place.lat, place.lng) - NP.haversineMi(anchor.lat, anchor.lng, place.lat, place.lng)) * 60) / 32;
    return Math.max(5, 5 * Math.round((base + Math.max(-15, Math.min(15, delta))) / 5));
  };
  NP.ageFit = (place, age) => {
    const ov = (NP.data && NP.data.ageOverrides && NP.data.ageOverrides[place.slug]) || {};
    if (ov[age] !== undefined) return ov[age];
    let r = place.toddlerRating + CATEGORY_AGE_BONUS[place.category][age];
    if (age === "baby" && !place.strollerFriendly) r -= 1;
    return Math.max(1, Math.min(5, r));
  };
  NP.catName = (cat, locale = NP.locale) => NP.UI[locale].catNames[cat];
  NP.costLabel = (cost, locale = NP.locale) => (cost === "free" ? NP.UI[locale].card.free : cost);
  NP.fmtTemp = (d, locale = NP.locale) => {
    const f2c = (f) => Math.round(((f - 32) * 5) / 9);
    return NP.UI[locale].tempUnit === "C" ? `${f2c(d.tempMinF)}–${f2c(d.tempMaxF)}°C` : `${d.tempMinF}–${d.tempMaxF}°F`;
  };
  NP.moodFromDay = (d) => (!d ? "nice" : d.rainChance >= 45 || d.code >= 51 ? "rainy" : d.tempMaxF >= 88 ? "hot" : d.tempMaxF <= 62 ? "cool" : "nice");

  // 假的「目的地預報」：用座標做確定性擾動，模擬原站對目的地另外查 Open-Meteo 的行為
  NP.fakeForecastFor = (lat, lng) => {
    if (!NP.data) return null;
    const seed = Math.abs(Math.round(lat * 1000) * 31 + Math.round(lng * 1000)) % 97;
    const coast = lng < -122.25 || lat < 37.1;
    const table = [["clear", "☀️", 0], ["partly", "🌤️", 2], ["overcast", "☁️", 3], ["fog", "🌫️", 45], ["showers", "🌦️", 80]];
    return NP.data.forecast.map((d, i) => {
      const shift = coast ? -(4 + (seed % 5)) : (seed % 7) - 2;
      const pick = coast && (seed + i) % 3 === 0 ? table[3] : table[Math.min(3, Math.max(0, table.findIndex((t) => t[0] === d.summaryKey) + ((seed + i) % 3) - 1))];
      return { ...d, tempMaxF: d.tempMaxF + shift, tempMinF: d.tempMinF + Math.round(shift / 2), rainChance: Math.min(100, d.rainChance + ((seed + i) % 4)), summaryKey: pick[0], emoji: pick[1], code: pick[2] };
    });
  };

  // ---------- localStorage 狀態（key 與原站相同） ----------
  const store = (key, fallback, parse = JSON.parse, ser = JSON.stringify) => ({
    get() { try { const v = localStorage.getItem(key); return v ? parse(v) : fallback; } catch { return fallback; } },
    set(v) { try { localStorage.setItem(key, ser(v)); } catch {} window.dispatchEvent(new CustomEvent(key + "-changed")); },
    on(fn) { window.addEventListener(key + "-changed", fn); window.addEventListener("storage", fn); },
  });
  NP.favStore = store("nextplace:favorites", []);
  NP.homeStore = store("nextplace:home", NP.DEFAULT_HOME);
  NP.ageStore = store("nextplace:age", NP.DEFAULT_AGE, (v) => (NP.AGE_GROUPS.includes(v) ? v : NP.DEFAULT_AGE), (v) => v);
  NP.favs = () => NP.favStore.get();
  NP.isFav = (slug) => NP.favs().includes(slug);
  NP.toggleFav = (slug) => { const f = NP.favs(); NP.favStore.set(f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]); };
  NP.addFavorites = (slugs) => NP.favStore.set(Array.from(new Set([...NP.favs(), ...slugs])));
  NP.home = () => ({ ...NP.DEFAULT_HOME, ...NP.homeStore.get() });
  NP.age = () => NP.ageStore.get();

  // ---------- 資料 ----------
  NP.loadData = async () => {
    if (NP.data) return NP.data;
    const res = await fetch("/data/places.json", { cache: "no-store" });
    NP.data = await res.json();
    NP.data.placesBySlug = Object.fromEntries(NP.data.places.map((p) => [p.slug, p]));
    return NP.data;
  };

  // ---------- Icons ----------
  NP.icons = {
    pin: (c = "h-8 w-8") => `<svg viewBox="0 0 32 32" class="${c}" aria-hidden="true" fill="currentColor"><path d="M16 1C9.9 1 5 5.9 5 12c0 8.3 9.6 17.6 10 18a1.4 1.4 0 0 0 2 0c.4-.4 10-9.7 10-18 0-6.1-4.9-11-11-11zm0 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path></svg>`,
    search: () => `<svg viewBox="0 0 32 32" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="13" cy="13" r="9"></circle><path d="M20 20l8 8"></path></svg>`,
    globe: () => `<svg viewBox="0 0 32 32" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><circle cx="16" cy="16" r="13"></circle><ellipse cx="16" cy="16" rx="6" ry="13"></ellipse><path d="M3 16h26M5 9h22M5 23h22"></path></svg>`,
    menu: () => `<svg viewBox="0 0 32 32" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M2 8h28M2 16h28M2 24h28"></path></svg>`,
    avatar: () => `<svg viewBox="0 0 32 32" class="h-5 w-5" fill="currentColor"><path d="M16 3a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm0 5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 18.5a10.4 10.4 0 0 1-8-3.7c.1-2.7 5.3-4.2 8-4.2s7.9 1.5 8 4.2a10.4 10.4 0 0 1-8 3.7z"></path></svg>`,
    sliders: () => `<svg viewBox="0 0 32 32" class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M7 16h18M3 8h26M11 24h10"></path></svg>`,
    heart: (filled) => `<svg viewBox="0 0 32 32" class="h-6 w-6" aria-hidden="true" style="fill:${filled ? "var(--rausch)" : "rgba(0,0,0,0.5)"};stroke:#fff;stroke-width:2;overflow:visible"><path d="M16 28c7-4.7 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.6.7-5 2.2L16 8.5l-2-2.3C12.6 4.7 10.8 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.3 14 17z"></path></svg>`,
    star: () => `<svg viewBox="0 0 32 32" class="h-3.5 w-3.5" aria-hidden="true" fill="currentColor"><path d="M15.09 1.55a1 1 0 0 1 1.82 0l3.6 8.02 8.73.98a1 1 0 0 1 .56 1.73l-6.48 5.93 1.77 8.6a1 1 0 0 1-1.47 1.07L16 23.5l-7.62 4.38a1 1 0 0 1-1.47-1.07l1.77-8.6L2.2 12.28a1 1 0 0 1 .56-1.73l8.73-.98z"></path></svg>`,
    close: () => `<svg viewBox="0 0 32 32" class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l20 20M26 6L6 26"></path></svg>`,
    share: () => `<svg viewBox="0 0 32 32" class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M27 18v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9M16 3v18M9 10l7-7 7 7"></path></svg>`,
  };

  // ---------- 元件 ----------
  NP.placeImage = (place, cls = "", emojiSize = "text-6xl") => {
    if (place.image) {
      return `<div class="relative overflow-hidden bg-surface ${cls}"><img alt="${esc(place.name)}" loading="lazy" decoding="async" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="${esc(place.image)}"></div>`;
    }
    const [c1, c2] = NP.CATEGORY_COLORS[place.category];
    let g = 0; for (let i = 0; i < place.slug.length; i++) g = (31 * g + place.slug.charCodeAt(i)) | 0; g = Math.abs(g);
    return `<div class="relative overflow-hidden ${cls}" style="background:linear-gradient(${120 + (g % 90)}deg, ${c1}, ${c2})" aria-hidden="true"><div class="absolute inset-0" style="background:radial-gradient(circle at ${15 + (g % 50)}% ${20 + ((g >> 3) % 50)}%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at ${60 + ((g >> 6) % 35)}% ${55 + ((g >> 9) % 35)}%, rgba(0,0,0,0.18), transparent 45%)"></div><div class="absolute inset-0 grid place-items-center ${emojiSize} drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]">${NP.CATEGORY_META[place.category].emoji}</div></div>`;
  };

  NP.heartButton = (slug, cls = "") => {
    const fav = NP.isFav(slug);
    return `<button type="button" data-heart="${esc(slug)}" aria-label="${fav ? NP.t.actions.unsave : NP.t.actions.save}" aria-pressed="${fav}" class="grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95 ${cls}"><span class="inline-block">${NP.icons.heart(fav)}</span></button>`;
  };

  NP.placeCard = (place, age = NP.age(), index = 0) => {
    const c = NP.t.card, fit = NP.ageFit(place, age);
    const line1 = `${place.city} · ${c.driveMin(place.driveMin)}`;
    const line2 = [c.hours(place.durationHours), place.strollerFriendly ? c.stroller : c.carrier, place.reservationsRequired ? c.reservation : null].filter(Boolean).join(" · ");
    const generic = NP.data?.credits?.[place.slug]?.generic;
    return `<a class="fade-up group block" href="/${NP.locale}/place/${esc(place.slug)}" style="animation-delay:${30 * Math.min(index, 16)}ms">
  <div class="relative">
    ${NP.placeImage(place, "aspect-[20/19] w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.01]")}
    ${NP.heartButton(place.slug, "absolute right-2 top-2")}
    ${fit === 5 ? `<span class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">${c.favBadge}</span>` : ""}
    ${generic ? `<span class="absolute bottom-2 left-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white">${c.genericBadge}</span>` : ""}
  </div>
  <div class="mt-2.5">
    <div class="flex items-start justify-between gap-2">
      <h3 class="truncate text-[15px] font-semibold leading-5 text-ink">${esc(place.name)}</h3>
      <span class="flex shrink-0 items-center gap-1 text-[15px] leading-5">${NP.icons.star()}${fit}.0</span>
    </div>
    <p class="truncate text-[15px] leading-5 text-ink-2">${esc(line1)}</p>
    <p class="truncate text-[15px] leading-5 text-ink-2">${esc(line2)}</p>
    <p class="mt-1 truncate text-[15px] leading-5"><span class="font-semibold">${esc(NP.costLabel(place.cost))}</span>${place.parking ? `<span class="text-ink-2"> · ${c.parking}${esc(place.parking)}</span>` : ""}</p>
  </div>
</a>`;
  };

  // 全域：愛心按鈕事件委派（所有頁面共用）
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-heart]");
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    const slug = btn.dataset.heart;
    NP.toggleFav(slug);
    const fav = NP.isFav(slug);
    document.querySelectorAll(`[data-heart="${CSS.escape(slug)}"]`).forEach((b) => {
      b.setAttribute("aria-pressed", String(fav));
      b.setAttribute("aria-label", fav ? NP.t.actions.unsave : NP.t.actions.save);
      const span = b.firstElementChild; span.innerHTML = NP.icons.heart(fav);
      if (b === btn) { span.className = "heart-pop inline-block"; setTimeout(() => (span.className = "inline-block"), 300); }
    });
    window.dispatchEvent(new CustomEvent("np:fav-toggled", { detail: { slug, fav } }));
  });

  // ---------- Modal ----------
  NP.openModal = ({ title, body, footer, width = "max-w-[568px]", onClose }) => {
    const root = NP.el(`<div class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6" role="dialog" aria-modal="true">
  <div class="modal-in flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-[var(--shadow-modal)] sm:rounded-2xl ${width}">
    ${title !== undefined ? `<div class="relative flex h-16 shrink-0 items-center justify-center border-b border-line-2 px-6"><button data-close aria-label="${NP.t.about.close}" class="absolute left-4 grid h-8 w-8 place-items-center rounded-full hover:bg-surface">${NP.icons.close()}</button><div class="text-base font-semibold" data-modal-title>${esc(title)}</div></div>` : ""}
    <div class="min-h-0 flex-1 overflow-y-auto" data-modal-body></div>
    ${footer ? `<div class="shrink-0 border-t border-line-2 px-6 pt-4" style="padding-bottom:calc(1rem + env(safe-area-inset-bottom))" data-modal-footer></div>` : ""}
  </div></div>`);
    const bodyEl = root.querySelector("[data-modal-body]");
    if (typeof body === "string") bodyEl.innerHTML = body; else if (body) bodyEl.appendChild(body);
    if (footer) { const f = root.querySelector("[data-modal-footer]"); if (typeof footer === "string") f.innerHTML = footer; else f.appendChild(footer); }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; root.remove(); onClose && onClose(); };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    root.addEventListener("mousedown", (e) => e.target === root && close());
    root.querySelector("[data-close]")?.addEventListener("click", close);
    document.body.appendChild(root);
    return { root, body: bodyEl, close, setTitle: (t) => { const el = root.querySelector("[data-modal-title]"); if (el) el.textContent = t; } };
  };

  NP.toast = (msg, ms = 1500) => {
    document.querySelectorAll("[data-toast]").forEach((t) => t.remove());
    const t = NP.el(`<div data-toast class="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-white shadow-lg sm:bottom-6">${esc(msg)}</div>`);
    document.body.appendChild(t); setTimeout(() => t.remove(), ms);
  };

  // ---------- Header / Footer ----------
  NP.renderHeader = () => {
    const t = NP.t, home = NP.home(), loc = NP.locale;
    const html = `<header class="sticky top-0 z-40 border-b border-line-2 bg-white">
  <div class="mx-auto flex h-16 max-w-[1760px] items-center justify-between gap-2 px-4 sm:h-20 sm:px-10 lg:px-20">
    <a class="flex items-center gap-1 text-rausch" href="/${loc}">${NP.icons.pin()}<span class="hidden text-[22px] font-bold tracking-tight md:inline">${NP.BRAND}</span></a>
    <button data-location class="flex h-11 min-w-0 items-center rounded-full border border-line pl-4 pr-1.5 text-xs shadow-[var(--shadow-pill)] transition hover:shadow-[var(--shadow-pill-hover)] sm:h-12 sm:pl-6 sm:pr-2 sm:text-sm">
      <span class="truncate font-semibold" data-home-label>${home.custom ? "📍 " : ""}${esc(home.label)}</span>
      <span class="mx-2.5 h-5 w-px shrink-0 bg-line sm:mx-4 sm:h-6"></span>
      <span class="truncate font-semibold">${t.header.who}</span>
      <span class="mx-4 hidden h-6 w-px bg-line sm:block"></span>
      <span class="hidden text-ink-2 sm:block">${t.header.when}</span>
      <span class="ml-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rausch text-white sm:ml-3 sm:h-8 sm:w-8">${NP.icons.search()}</span>
    </button>
    <nav class="flex items-center gap-1">
      <div class="relative" data-lang>
        <button data-lang-btn aria-haspopup="menu" aria-expanded="false" class="flex items-center gap-1.5 rounded-full px-2.5 py-2.5 text-sm font-medium hover:bg-surface sm:px-3">${NP.icons.globe()}<span class="hidden sm:inline">${NP.LOCALE_NAMES[loc]}</span></button>
      </div>
      <a class="hidden rounded-full px-3 py-2.5 text-sm font-medium hover:bg-surface md:block" href="/${loc}/about">${t.header.about}</a>
      <a class="hidden h-11 items-center gap-3 rounded-full border border-line py-1 pl-3.5 pr-1.5 shadow-sm transition hover:shadow-[var(--shadow-pill-hover)] sm:flex" href="/${loc}#all" aria-label="${t.header.menu}">${NP.icons.menu()}<span class="grid h-8 w-8 place-items-center rounded-full bg-ink-2 text-white">${NP.icons.avatar()}</span></a>
    </nav>
  </div>
</header>`;
    const header = NP.el(html);
    // 語言選單
    const langWrap = header.querySelector("[data-lang]"), langBtn = header.querySelector("[data-lang-btn]");
    let menu = null;
    const closeMenu = () => { menu && menu.remove(); menu = null; langBtn.setAttribute("aria-expanded", "false"); };
    langBtn.addEventListener("click", () => {
      if (menu) return closeMenu();
      menu = NP.el(`<div role="menu" class="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-line-2 bg-white py-2 shadow-[var(--shadow-card)]">${NP.LOCALES.map((l) => `<a role="menuitem" href="/${l}${NP.pathWithoutLocale}${location.hash}" class="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-surface ${l === loc ? "font-semibold" : ""}">${NP.LOCALE_NAMES[l]}${l === loc ? '<span aria-hidden="true">✓</span>' : ""}</a>`).join("")}</div>`);
      langWrap.appendChild(menu); langBtn.setAttribute("aria-expanded", "true");
    });
    document.addEventListener("mousedown", (e) => menu && !langWrap.contains(e.target) && closeMenu());
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
    // 出發地 modal
    header.querySelector("[data-location]").addEventListener("click", NP.openLocationModal);
    NP.homeStore.on(() => { const h = NP.home(); header.querySelector("[data-home-label]").textContent = (h.custom ? "📍 " : "") + h.label; });
    return header;
  };

  NP.openLocationModal = () => {
    const t = NP.t;
    const render = (state = {}) => {
      const home = NP.home();
      return `<div class="px-6 py-6">
  <button data-geo ${state.locating ? "disabled" : ""} class="flex w-full items-center justify-center gap-2 rounded-xl border border-ink py-3.5 font-semibold hover:bg-surface disabled:opacity-50">${NP.icons.pin("h-5 w-5 text-rausch")}${state.locating ? t.location.locating : t.location.useCurrent}</button>
  ${state.denied ? `<p class="mt-2 text-center text-sm text-rausch">${t.location.denied}</p>` : ""}
  <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">${NP.ANCHORS.map((a) => `<button data-anchor="${a.id}" class="rounded-xl border px-3 py-3 text-sm transition ${home.anchorId === a.id && !home.custom ? "border-ink bg-ink font-semibold text-white" : "border-line hover:border-ink"}">${a.label}</button>`).join("")}</div>
  <p class="mt-5 text-center text-xs text-ink-2">${t.location.estimateNote}</p>
</div>`;
    };
    const m = NP.openModal({ title: t.location.title, body: render() });
    const bind = () => {
      m.body.querySelectorAll("[data-anchor]").forEach((b) => b.addEventListener("click", () => { const a = NP.ANCHORS.find((x) => x.id === b.dataset.anchor); NP.homeStore.set({ anchorId: a.id, label: a.label, lat: a.lat, lng: a.lng }); m.close(); }));
      m.body.querySelector("[data-geo]").addEventListener("click", () => {
        if (!navigator.geolocation) { m.body.innerHTML = render({ denied: true }); bind(); return; }
        m.body.innerHTML = render({ locating: true }); bind();
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude: lat, longitude: lng } = pos.coords, a = NP.nearestAnchor(lat, lng);
          NP.homeStore.set({ anchorId: a.id, label: a.label, lat, lng, custom: true }); m.close();
        }, () => { m.body.innerHTML = render({ denied: true }); bind(); }, { timeout: 8000, maximumAge: 600000 });
      });
    };
    bind();
  };

  NP.renderFooter = () => {
    const t = NP.t, loc = NP.locale;
    const mail = `mailto:${NP.FEEDBACK_EMAIL}?subject=${encodeURIComponent("nextplace feedback")}&body=${encodeURIComponent(`\n\n---\nPage: ${location.pathname}`)}`;
    return NP.el(`<footer class="border-t border-line-2 bg-surface">
  <div class="mx-auto max-w-[1760px] px-6 py-10 sm:px-10 lg:px-20">
    <div class="grid gap-8 text-sm sm:grid-cols-3">
      <div><div class="font-semibold">${NP.BRAND}</div><p class="mt-3 text-ink-2">${t.footer.blurb}</p></div>
      <div><div class="font-semibold">${t.footer.dataTitle}</div><ul class="mt-3 space-y-2 text-ink-2"><li>${t.footer.dataNote}</li><li>${t.footer.weatherSrc}</li><li>${t.footer.mapsSrc}</li></ul></div>
      <div><div class="font-semibold">${t.footer.linksTitle}</div><ul class="mt-3 space-y-2 text-ink-2">
        <li><a class="hover:underline" href="/${loc}/about">${t.footer.aboutLink}</a></li>
        <li><a class="hover:underline" href="/${loc}#all">${t.footer.allLink}</a></li>
        <li><a class="hover:underline" href="/${loc}/credits">${t.footer.creditsLink}</a></li>
        <li><a class="hover:underline" href="${mail}">${t.footer.feedback} · ${NP.FEEDBACK_EMAIL}</a></li>
      </ul></div>
    </div>
    <div class="mt-8 border-t border-line pt-6 text-xs text-ink-2">© ${new Date().getFullYear()} ${NP.BRAND} · South Bay · 2yo edition</div>
  </div>
</footer>`);
  };

  // 每頁共用啟動：套 lang、放 header/footer
  NP.boot = () => {
    document.documentElement.lang = NP.t.htmlLang;
    document.querySelector("[data-header]")?.replaceWith(NP.renderHeader());
    document.querySelector("[data-footer]")?.replaceWith(NP.renderFooter());
  };
})();
