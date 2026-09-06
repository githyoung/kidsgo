/* 首頁 Explorer：分類、年齡、天氣、篩選、排序、收藏、🎯 幫我決定 */
(async function () {
  "use strict";
  const NP = window.NP, t = NP.t, loc = NP.locale;
  NP.boot();
  const data = await NP.loadData();
  document.title = t.siteTitle;

  const DEFAULT_FILTERS = { categories: [], maxDrive: 60, strollerOnly: false, freeOnly: false, mood: "any", maxHours: null };
  const MOODS = ["any", "nice", "hot", "cool", "rainy"], MOOD_EMOJI = { any: "🎲", nice: "☀️", hot: "🥵", cool: "🧥", rainy: "🌧️" };
  const CATS = Object.keys(NP.CATEGORY_META);

  const S = {
    filters: { ...DEFAULT_FILTERS, mood: data.suggestedMood },
    favMode: false,
    sort: "rec",
    picked: new Set(),
  };

  const passes = (p, f) =>
    (!f.categories.length || f.categories.includes(p.category)) && !(p.driveMin > f.maxDrive) && (!f.strollerOnly || !!p.strollerFriendly) &&
    (!f.freeOnly || p.cost === "free") && (f.maxHours === null || !(p.durationHours > f.maxHours)) &&
    (f.mood !== "rainy" || p.weather.includes("rain-ok")) && (f.mood !== "hot" || p.weather.includes("hot") || p.shade === "high");

  // 目前出發地下的地點（車程重算）＋ 該出發地的預報（Sunnyvale 用內建，其它城市用假的目的地預報）
  const view = () => {
    const home = NP.home();
    const places = data.places.map((p) => ({ ...p, driveMin: NP.driveMinFrom(p, home) }));
    const isDefault = home.anchorId === "sunnyvale" && !home.custom;
    const forecast = isDefault ? data.forecast : NP.fakeForecastFor(home.lat, home.lng);
    const mood = isDefault ? data.suggestedMood : NP.moodFromDay(forecast.find((d) => d.day === "sat") ?? forecast[0]);
    return { home, places, forecast, mood };
  };
  let lastAutoMood = data.suggestedMood;

  const score = (p, f, age) => {
    let s = 14 * NP.ageFit(p, age);
    if (p.bestSeason.includes(data.season)) s += 12;
    if (f.mood === "hot" && p.shade === "high") s += 8;
    if (f.mood === "hot" && p.weather.includes("hot")) s += 6;
    if (f.mood === "cool" && p.weather.includes("cool")) s += 6;
    if (f.mood === "rainy" && p.weather.includes("rain-ok")) s += 10;
    if (f.mood === "nice" && p.weather.includes("sunny")) s += 6;
    s -= Math.min(25, 0.35 * Math.max(0, p.driveMin - 20));
    if (p.strollerFriendly) s += 3;
    return Math.max(0, Math.min(100, Math.round(s)));
  };
  const results = (v = view()) => {
    const age = NP.age(), favs = NP.favs(), f = S.filters;
    return v.places
      .filter((p) => S.favMode || passes(p, f)).filter((p) => S.favMode || NP.ageFit(p, age) >= 3).filter((p) => !S.favMode || favs.includes(p.slug))
      .map((p) => ({ place: p, score: score(p, f, age) }))
      .sort((a, b) => (S.sort === "near" ? a.place.driveMin - b.place.driveMin : (S.sort === "fit" && NP.ageFit(b.place, age) - NP.ageFit(a.place, age)) || b.score - a.score));
  };
  const activeFilterCount = (f) => +(f.maxDrive !== DEFAULT_FILTERS.maxDrive) + +(f.mood !== "any") + +!!f.strollerOnly + +!!f.freeOnly + +(f.maxHours !== null);

  // ---------- 骨架 ----------
  const main = document.querySelector("main");
  main.innerHTML = `
<div class="sticky top-16 z-30 border-b border-line-2 bg-white sm:top-20">
  <div class="mx-auto flex max-w-[1760px] items-center gap-4 px-6 sm:px-10 lg:px-20">
    <div class="no-scrollbar flex flex-1 items-stretch gap-6 overflow-x-auto pt-3 sm:gap-8" data-tabs></div>
    <div class="hidden shrink-0 items-center gap-3 pb-1 pt-3 sm:flex">
      <button data-open-filters class="flex h-12 items-center gap-2 rounded-xl border border-line px-4 text-sm font-medium hover:border-ink">${NP.icons.sliders()}${t.actions.filters}<span data-filter-count class="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-white"></span></button>
      <button data-decide class="h-12 rounded-xl bg-gradient-to-r from-[#e61e4d] via-[#e31c5f] to-[#d70466] px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-[0.98] disabled:opacity-40">${t.actions.decide}</button>
    </div>
  </div>
</div>
<div class="mx-auto max-w-[1760px] px-6 pt-5 sm:px-10 lg:px-20">
  <div class="flex flex-wrap items-center gap-2 pb-3" data-ages></div>
  <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" data-weather></div>
  <div class="mt-4 flex items-baseline justify-between">
    <h2 class="text-[22px] font-semibold" data-heading></h2>
    <div class="flex items-center gap-1.5 text-sm" data-sort></div>
  </div>
</div>
<div id="all" class="mx-auto max-w-[1760px] px-6 pb-24 pt-6 sm:px-10 lg:px-20" data-grid></div>
<div class="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 border-t border-line-2 bg-white px-4 pt-3 sm:hidden" style="padding-bottom:calc(0.75rem + env(safe-area-inset-bottom))">
  <button data-open-filters class="flex h-11 items-center gap-2 rounded-full border border-ink px-5 text-sm font-semibold">${NP.icons.sliders()}${t.actions.filters}<span data-filter-count-m></span></button>
  <button data-decide class="h-11 flex-1 rounded-full bg-gradient-to-r from-[#e61e4d] to-[#d70466] text-sm font-semibold text-white disabled:opacity-40">${t.actions.decide}</button>
</div>`;
  const $ = (sel) => main.querySelector(sel);

  // ---------- 渲染 ----------
  const tabBtn = (active, emoji, label, attrs) => `<button ${attrs} class="group flex shrink-0 flex-col items-center gap-2 border-b-2 pb-3 pt-1 text-xs transition-colors ${active ? "border-ink text-ink" : "border-transparent text-ink-2 hover:border-line hover:text-ink"}"><span class="text-2xl leading-none transition ${active ? "" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"}" aria-hidden="true">${emoji}</span><span class="whitespace-nowrap font-medium">${label}</span></button>`;
  const renderTabs = () => {
    const favs = NP.favs(), f = S.filters;
    $("[data-tabs]").innerHTML =
      tabBtn(!S.favMode && f.categories.length === 0, "🧭", t.cats.all, 'data-cat="all"') +
      tabBtn(S.favMode, "❤️", `${t.cats.favs}${favs.length ? ` ${favs.length}` : ""}`, "data-favs") +
      CATS.map((c) => tabBtn(!S.favMode && f.categories.includes(c), NP.CATEGORY_META[c].emoji, NP.catName(c), `data-cat="${c}"`)).join("");
  };
  const renderAges = () => {
    const age = NP.age();
    $("[data-ages]").innerHTML = `<span class="mr-1 text-sm text-ink-2">🧒 ${t.age.question}</span>` +
      NP.AGE_GROUPS.map((g) => `<button data-age="${g}" class="rounded-full border px-3.5 py-1.5 text-sm transition ${age === g ? "border-ink bg-ink font-semibold text-white" : "border-line hover:border-ink"}">${t.age.groups[g]}</button>`).join("");
  };
  const renderWeather = (v) => {
    const days = v.forecast;
    $("[data-weather]").innerHTML = (days && days.length
      ? days.map((d) => `<span class="flex items-center gap-2"><span class="text-xl" aria-hidden="true">${d.emoji}</span><span><b class="font-semibold">${t.weather.day[d.day]}</b> <span class="text-ink-2">${t.weather.summary[d.summaryKey]} · ${NP.fmtTemp(d)} · ${t.weather.rain(d.rainChance)}</span></span></span>`).join("")
      : `<span class="text-ink-2">${t.weather.unavailable}</span>`) +
      (days && days[0] ? `<span class="text-ink-2">· ${t.weather.mood[v.mood]}<button data-open-filters class="ml-1 font-semibold text-ink underline underline-offset-2">${t.actions.adjust}</button></span>` : "");
  };
  const renderHeadingSort = (rows) => {
    const f = S.filters, favs = NP.favs();
    $("[data-heading]").textContent = S.favMode ? t.list.headingFavs(rows.length) : f.categories.length ? t.list.headingCat(NP.catName(f.categories[0]), rows.length) : t.list.headingAll(rows.length);
    $("[data-sort]").innerHTML =
      (S.favMode && favs.length > 0 ? `<button data-share-favs class="mr-2 flex items-center gap-1.5 rounded-full border border-line px-3 py-1 hover:border-ink">${NP.icons.share()}<span>${t.favShare.share}</span></button>` : "") +
      ["rec", "near", "fit"].map((k) => `<button data-sort-key="${k}" class="rounded-full border px-3 py-1 transition ${S.sort === k ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-ink hover:text-ink"}">${t.sort[k]}</button>`).join("");
  };
  const renderGrid = (rows) => {
    const age = NP.age();
    $("[data-grid]").innerHTML = rows.length === 0
      ? `<div class="rounded-2xl border border-line-2 p-12 text-center"><p class="text-lg font-semibold">${S.favMode ? t.list.emptyFavsTitle : t.list.emptyTitle}</p><p class="mt-1 text-ink-2">${S.favMode ? t.list.emptyFavsDesc : t.list.emptyDesc}</p>${S.favMode ? "" : `<button data-clear-filters class="mt-5 rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold hover:bg-surface">${t.actions.clearFilters}</button>`}</div>`
      : `<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">${rows.map((r, i) => NP.placeCard(r.place, age, i)).join("")}</div>`;
  };
  const renderCounts = (rows) => {
    const n = activeFilterCount(S.filters);
    const c = $("[data-filter-count]"); c.textContent = n || ""; c.hidden = !n;
    $("[data-filter-count-m]").textContent = n ? ` · ${n}` : "";
    main.querySelectorAll("[data-decide]").forEach((b) => (b.disabled = !rows.length));
  };
  let currentRows = [];
  const renderAll = () => {
    const v = view();
    if (v.mood !== lastAutoMood) { if (S.filters.mood === lastAutoMood) S.filters.mood = v.mood; lastAutoMood = v.mood; }
    currentRows = results(v);
    renderTabs(); renderAges(); renderWeather(v); renderHeadingSort(currentRows); renderGrid(currentRows); renderCounts(currentRows);
  };

  // ---------- 事件 ----------
  main.addEventListener("click", (e) => {
    const cat = e.target.closest("[data-cat]");
    if (cat) { const c = cat.dataset.cat; S.favMode = false; S.filters.categories = c === "all" || (S.filters.categories.length === 1 && S.filters.categories[0] === c) ? [] : [c]; S.picked.clear(); return renderAll(); }
    if (e.target.closest("[data-favs]")) { S.favMode = !S.favMode; S.picked.clear(); return renderAll(); }
    const age = e.target.closest("[data-age]");
    if (age) { NP.ageStore.set(age.dataset.age); S.picked.clear(); return renderAll(); }
    const sort = e.target.closest("[data-sort-key]");
    if (sort) { S.sort = sort.dataset.sortKey; return renderAll(); }
    if (e.target.closest("[data-open-filters]")) return openFilters();
    if (e.target.closest("[data-decide]")) return decide();
    if (e.target.closest("[data-clear-filters]")) { S.filters = { ...DEFAULT_FILTERS, mood: "any", categories: [] }; return renderAll(); }
    if (e.target.closest("[data-share-favs]")) return shareFavs();
  });
  window.addEventListener("np:fav-toggled", () => { renderTabs(); if (S.favMode) { currentRows = results(); renderHeadingSort(currentRows); renderGrid(currentRows); renderCounts(currentRows); } });
  NP.homeStore.on(renderAll);

  async function shareFavs() {
    const url = `${location.origin}/${loc}?favs=${NP.favs().join(",")}`;
    try { if (navigator.share) return void (await navigator.share({ title: document.title, url })); } catch {}
    try { await navigator.clipboard.writeText(url); const b = $("[data-share-favs] span"); if (b) { b.textContent = t.actions.copied; setTimeout(() => (b.textContent = t.favShare.share), 1500); } } catch {}
  }

  // ?favs=a,b 匯入收藏（原站的分享收藏連結）
  (() => {
    const qs = new URLSearchParams(location.search), favs = qs.get("favs");
    if (!favs) return;
    const valid = favs.split(",").filter((s) => data.placesBySlug[s]);
    if (valid.length) { NP.addFavorites(valid); S.favMode = true; NP.toast(t.favShare.imported(valid.length), 3000); }
    qs.delete("favs"); const q = qs.toString();
    history.replaceState(null, "", location.pathname + (q ? `?${q}` : "") + location.hash);
  })();

  // ---------- 篩選 modal ----------
  function openFilters() {
    const draft = { ...S.filters }, v = view(), home = v.home;
    const chip = (active, attrs, label) => `<button ${attrs} class="rounded-full border px-4 py-2.5 text-sm transition ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}">${label}</button>`;
    const toggle = (key, title, desc) => `<div class="flex items-center justify-between py-4"><div><div class="font-medium">${title}</div><div class="text-sm text-ink-2">${desc}</div></div><button role="switch" aria-checked="${draft[key]}" data-toggle="${key}" class="relative h-8 w-12 shrink-0 rounded-full transition-colors ${draft[key] ? "bg-ink" : "bg-ink-3"}"><span class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${draft[key] ? "translate-x-5" : "translate-x-1"}"></span></button></div>`;
    const count = () => v.places.filter((p) => passes(p, draft)).filter((p) => NP.ageFit(p, NP.age()) >= 3).filter((p) => !S.favMode || NP.favs().includes(p.slug)).length;
    const body = () => `<div class="divide-y divide-line-2 px-6">
  <section class="py-7"><h3 class="text-lg font-semibold">${t.filterModal.drive}</h3><p class="mt-1 text-sm text-ink-2" data-drive-desc>${t.filterModal.driveDesc(draft.maxDrive, home.label)}</p>
    <input type="range" min="10" max="150" step="5" value="${draft.maxDrive}" data-drive class="range mt-6 w-full" style="--pct:${((draft.maxDrive - 10) / 140) * 100}%">
    <div class="mt-2 flex justify-between text-xs text-ink-2"><span>${t.filterModal.min10}</span><span>${t.filterModal.min90}</span></div></section>
  <section class="py-7"><h3 class="text-lg font-semibold">${t.filterModal.weather}</h3><p class="mt-1 text-sm text-ink-2">${t.filterModal.weatherAuto(t.weather.moodNames[v.mood])}</p>
    <div class="mt-4 flex flex-wrap gap-2">${MOODS.map((m) => chip(draft.mood === m, `data-mood="${m}"`, `${MOOD_EMOJI[m]} ${t.weather.moodNames[m]}`)).join("")}</div></section>
  <section class="py-7"><h3 class="text-lg font-semibold">${t.filterModal.duration}</h3>
    <div class="mt-4 flex flex-wrap gap-2">${[[null, t.filterModal.durAny], [1.5, t.filterModal.dur15], [2.5, t.filterModal.dur25], [4, t.filterModal.dur4]].map(([val, l]) => chip(draft.maxHours === val, `data-hours="${val}"`, l)).join("")}</div></section>
  <section class="py-7"><h3 class="text-lg font-semibold">${t.filterModal.needs}</h3>
    <div class="mt-2 divide-y divide-line-2">${toggle("strollerOnly", t.filterModal.strollerTitle, t.filterModal.strollerDesc)}${toggle("freeOnly", t.filterModal.freeTitle, t.filterModal.freeDesc)}</div></section>
</div>`;
    const footer = `<div class="flex items-center justify-between"><button data-clear-all class="text-sm font-semibold underline underline-offset-2">${t.actions.clearAll}</button><button data-apply class="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-black">${t.actions.showN(count())}</button></div>`;
    const m = NP.openModal({ title: t.filterModal.title, body: body(), footer });
    const refresh = () => { m.body.innerHTML = body(); m.root.querySelector("[data-apply]").textContent = t.actions.showN(count()); };
    m.body.addEventListener("input", (e) => {
      if (e.target.matches("[data-drive]")) { draft.maxDrive = Number(e.target.value); e.target.style.setProperty("--pct", `${((draft.maxDrive - 10) / 140) * 100}%`); m.body.querySelector("[data-drive-desc]").textContent = t.filterModal.driveDesc(draft.maxDrive, home.label); m.root.querySelector("[data-apply]").textContent = t.actions.showN(count()); }
    });
    m.body.addEventListener("click", (e) => {
      const mood = e.target.closest("[data-mood]"), hrs = e.target.closest("[data-hours]"), tg = e.target.closest("[data-toggle]");
      if (mood) draft.mood = mood.dataset.mood;
      else if (hrs) draft.maxHours = hrs.dataset.hours === "null" ? null : Number(hrs.dataset.hours);
      else if (tg) draft[tg.dataset.toggle] = !draft[tg.dataset.toggle];
      else return;
      refresh();
    });
    m.root.querySelector("[data-clear-all]").addEventListener("click", () => { Object.assign(draft, { ...DEFAULT_FILTERS, mood: "any", categories: draft.categories }); refresh(); });
    m.root.querySelector("[data-apply]").addEventListener("click", () => { S.filters = { ...draft }; S.picked.clear(); m.close(); renderAll(); });
  }

  // ---------- 🎯 幫我決定 ----------
  let picking = false;
  function decide(existing) {
    if (!currentRows.length || picking) return;
    picking = true;
    const rows = currentRows, names = rows.map((r) => r.place.name);
    const rolling = () => `<div class="grid h-80 place-items-center px-6 text-center"><div><div class="text-5xl">🎯</div><div class="rolling-text mt-4 text-2xl font-semibold" data-rolling>…</div><p class="mt-2 text-sm text-ink-2">${t.pick.weightedNote(rows.length)}</p></div></div>`;
    const m = existing || NP.openModal({ title: t.pick.picking, body: rolling(), width: "max-w-[640px]", onClose: () => (picking = false) });
    if (existing) { m.setTitle(t.pick.picking); m.body.innerHTML = rolling(); }
    let n = 0;
    const timer = setInterval(() => {
      const el = m.body.querySelector("[data-rolling]"); if (el) el.textContent = names[Math.floor(Math.random() * names.length)];
      if (++n > 12) {
        clearInterval(timer);
        const fresh = rows.filter((r) => !S.picked.has(r.place.slug)), pool = fresh.length ? fresh : rows;
        let x = Math.random() * pool.reduce((a, r) => a + r.score ** 2, 0), win = pool[pool.length - 1];
        for (const r of pool) { if ((x -= r.score ** 2) <= 0) { win = r; break; } }
        S.picked.add(win.place.slug); if (S.picked.size >= Math.max(1, rows.length - 1)) S.picked.clear();
        picking = false; m.setTitle(t.pick.goHere); m.body.innerHTML = pickCard(win.place);
        m.body.querySelector("[data-again]").addEventListener("click", () => decide(m));
      }
    }, 90);
  }
  function pickCard(p) {
    const age = NP.age(), fit = NP.ageFit(p, age), R = t.reasons, f = S.filters, reasons = [];
    if (fit >= 5) reasons.push(R.top); else if (fit === 4) reasons.push(R.great);
    if (p.bestSeason.includes(data.season)) reasons.push(R.inSeason);
    if (f.mood === "hot" && p.shade === "high") reasons.push(R.shadeHot);
    if (f.mood === "rainy" && p.weather.includes("rain-ok")) reasons.push(R.rainOk);
    if (p.driveMin <= 20) reasons.push(R.close(p.driveMin));
    if (p.strollerFriendly) reasons.push(R.stroller);
    if (p.cost === "free") reasons.push(R.free);
    const stat = (l, v) => `<div class="rounded-xl border border-line-2 px-3 py-2.5"><div class="text-xs text-ink-2">${l}</div><div class="font-semibold">${v}</div></div>`;
    return `<div class="fade-up">
  <div class="relative m-4 mb-0">${NP.placeImage(p, "aspect-[5/2] w-full rounded-xl", "text-7xl")}${NP.heartButton(p.slug, "absolute right-3 top-3")}</div>
  <div class="px-6 pb-6 pt-5">
    <div class="text-sm text-ink-2">${NP.CATEGORY_META[p.category].emoji} ${NP.catName(p.category)} · ${NP.esc(p.city)} · ${t.card.driveMin(p.driveMin)}</div>
    <div class="mt-1 flex items-start justify-between gap-3"><h3 class="text-2xl font-semibold leading-tight">${NP.esc(p.name)}</h3><span class="flex shrink-0 items-center gap-1 pt-1 text-sm">${NP.icons.star()} ${fit}.0</span></div>
    <p class="mt-3 text-[15px] leading-relaxed text-ink">${NP.esc(p.highlight)}</p>
    <ul class="mt-4 flex flex-wrap gap-2">${reasons.slice(0, 4).map((r) => `<li class="rounded-full border border-line px-3 py-1 text-sm">✓ ${r}</li>`).join("")}</ul>
    <div class="mt-4 rounded-xl bg-surface p-4 text-sm leading-relaxed"><b>${t.pick.tips}</b>${NP.esc(p.tips)}</div>
    <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">${stat(t.pick.duration, t.card.hours(p.durationHours))}${stat(t.pick.cost, NP.costLabel(p.cost))}${stat(t.pick.stroller, p.strollerFriendly ? t.pick.strollerOk : t.pick.strollerCarrier)}</div>
    <div class="mt-5 flex flex-col gap-2 sm:flex-row">
      <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noreferrer" class="flex-1 rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] px-5 py-3 text-center text-sm font-semibold text-white hover:brightness-105">${t.actions.navigate}</a>
      <a href="/${loc}/place/${NP.esc(p.slug)}" class="flex-1 rounded-lg border border-ink px-5 py-3 text-center text-sm font-semibold hover:bg-surface">${t.actions.details}</a>
      <button data-again class="rounded-lg px-5 py-3 text-sm font-semibold underline underline-offset-2">${t.actions.again}</button>
    </div>
  </div>
</div>`;
  }

  renderAll();
})();
