/* 地點詳情頁 /{locale}/place/{slug} */
(async function () {
  "use strict";
  const NP = window.NP, t = NP.t, loc = NP.locale, esc = NP.esc;
  NP.boot();
  const data = await NP.loadData();
  const slug = decodeURIComponent(location.pathname.split("/place/")[1] || "").replace(/\/$/, "");
  const main = document.querySelector("main");
  const home = NP.home();
  const raw = data.placesBySlug[slug];
  if (!raw) {
    document.title = `${t.about.notFound} · ${NP.BRAND}`;
    main.innerHTML = `<div class="rounded-2xl border border-line-2 p-12 text-center"><p class="text-lg font-semibold">${t.about.notFound}</p><a href="/${loc}" class="mt-5 inline-block rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold hover:bg-surface">${t.about.backHome}</a></div>`;
    return;
  }
  const p = { ...raw, driveMin: NP.driveMinFrom(raw, home) };
  document.title = `${p.name} · ${NP.BRAND}`;
  const age = NP.age(), d = t.detail, L = t.labels, cat = NP.CATEGORY_META[p.category];
  const similar = data.places.filter((x) => x.category === p.category && x.slug !== p.slug)
    .map((x) => ({ ...x, driveMin: NP.driveMinFrom(x, home) }))
    .sort((a, b) => NP.ageFit(b, age) - NP.ageFit(a, age) || a.driveMin - b.driveMin).slice(0, 4);
  const credit = data.credits?.[p.slug];
  const forecast = NP.fakeForecastFor(p.lat, p.lng);
  const fmtDate = (iso) => { const [, m, dd] = iso.split("-"); return `${m}/${dd}`; };
  const shadeEmoji = { low: "☀️", medium: "🌳", high: "🌲" }[p.shade] || "🌳";
  const bbox = `${(p.lng - 0.03).toFixed(4)}%2C${(p.lat - 0.02).toFixed(4)}%2C${(p.lng + 0.03).toFixed(4)}%2C${(p.lat + 0.02).toFixed(4)}`;

  main.innerHTML = `
<div class="flex flex-wrap items-start justify-between gap-3">
  <h1 class="text-[26px] font-semibold leading-tight">${esc(p.name)}</h1>
  <div class="flex items-center gap-1">
    <button data-share class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium underline underline-offset-2 hover:bg-surface">${NP.icons.share()}<span>${t.actions.share}</span></button>
    <span class="flex items-center gap-1 rounded-lg pl-1 pr-3 text-sm font-medium underline underline-offset-2 hover:bg-surface">${NP.heartButton(p.slug)}${t.actions.save}</span>
  </div>
</div>
<div class="mt-4 grid grid-cols-1 gap-2 overflow-hidden rounded-xl sm:h-[420px] sm:grid-cols-4 sm:grid-rows-2">
  ${NP.placeImage(p, "aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full", "text-8xl")}
  ${similar.map((s) => `<a class="relative hidden sm:block" href="/${loc}/place/${esc(s.slug)}">${NP.placeImage(s, "h-full w-full opacity-90 transition hover:opacity-100", "text-5xl")}<span class="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium">${d.similar} · ${esc(s.name)}</span></a>`).join("")}
</div>
${credit ? `<p class="mt-2 text-right text-[11px] text-ink-3">${credit.generic ? d.generic : ""}${d.photo}<a class="underline-offset-2 hover:underline" href="${esc(credit.source)}" target="_blank" rel="noreferrer">${esc(credit.artist)}</a> · ${esc(credit.license)} · Wikimedia Commons</p>` : ""}
<div class="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
  <div>
    <div class="border-b border-line-2 pb-6">
      <h2 class="text-[22px] font-semibold">${cat.emoji} ${NP.catName(p.category)} · ${esc(p.city)}</h2>
      <p class="mt-1 text-ink-2">${d.hours(p.durationHours)} · ${esc(NP.costLabel(p.cost))} · ${p.reservationsRequired ? d.resYes : d.resNo}</p>
      <div class="mt-4">
        <div class="mb-2 flex items-center gap-2 text-sm text-ink-2">${NP.icons.star()}${d.fitLabel}</div>
        <div class="grid max-w-md grid-cols-4 gap-1.5 text-center text-sm">${NP.AGE_GROUPS.map((g) => `<div class="rounded-lg bg-surface px-1 py-2"><div class="text-xs text-ink-2">${t.age.groups[g]}</div><div class="mt-0.5 font-semibold">★ ${NP.ageFit(p, g)}.0</div></div>`).join("")}</div>
      </div>
    </div>
    <ul class="divide-y divide-line-2 border-b border-line-2">
      <li class="flex gap-4 py-5"><span class="text-2xl leading-none">🚗</span><div><div class="font-medium">${d.aboutDrive(p.driveMin)}</div><div class="text-sm text-ink-2">${d.fromHome(esc(home.label))}${p.parking ? ` · ${d.parkingLabel}: ${esc(p.parking)}` : ""}</div></div></li>
      <li class="flex gap-4 py-5"><span class="text-2xl leading-none">🍼</span><div><div class="font-medium">${p.strollerFriendly ? d.strollerTitle : d.carrierTitle}</div><div class="text-sm text-ink-2">${p.strollerFriendly ? d.strollerDesc : d.carrierDesc}</div></div></li>
      <li class="flex gap-4 py-5"><span class="text-2xl leading-none">${shadeEmoji}</span><div><div class="font-medium">${L.shade[p.shade]}</div><div class="text-sm text-ink-2">${p.weather.map((w) => L.weatherTag[w]).join(" · ")}</div></div></li>
      <li class="flex gap-4 py-5"><span class="text-2xl leading-none">⏱️</span><div><div class="font-medium">${d.typicalVisit(p.durationHours)}</div><div class="text-sm text-ink-2">${d.bestSeason}${p.bestSeason.map((s) => L.season[s]).join(" · ")}</div></div></li>
    </ul>
    <section class="border-b border-line-2 py-8">
      <p class="text-[17px] leading-relaxed">${esc(p.highlight)}</p>
      <div class="mt-5 rounded-xl bg-surface p-5 leading-relaxed"><div class="mb-1 font-semibold">${d.tips}</div>${esc(p.tips)}</div>
    </section>
    <section class="border-b border-line-2 py-8">
      <h3 class="text-[22px] font-semibold">${d.offers}</h3>
      <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">${p.tags.map((tag) => `<div class="flex items-center gap-3"><span class="text-ink-2">✓</span>${esc(tag)}</div>`).join("")}</div>
    </section>
    <section class="border-b border-line-2 py-8">
      <h3 class="text-[22px] font-semibold">${d.weekendIn(esc(p.city))}</h3>
      <p class="mt-1 text-sm text-ink-2">${d.destNote}</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">${forecast.map((f) => `<div class="flex items-center gap-4 rounded-xl border border-line-2 p-4"><span class="text-4xl">${f.emoji}</span><div><div class="font-semibold">${t.weather.day[f.day]} ${fmtDate(f.date)}</div><div class="text-sm text-ink-2">${t.weather.summary[f.summaryKey]} · ${NP.fmtTemp(f)} · ${t.weather.rain(f.rainChance)}</div></div></div>`).join("")}</div>
    </section>
    <section class="py-8">
      <h3 class="text-[22px] font-semibold">${d.location}</h3>
      <p class="mt-1 text-ink-2">${esc(p.city)}, California</p>
      <div class="mt-4 overflow-hidden rounded-xl border border-line-2"><iframe title="${t.about.mapTitle}" class="h-[360px] w-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${p.lat}%2C${p.lng}"></iframe></div>
    </section>
  </div>
  <aside class="lg:sticky lg:top-28 lg:self-start">
    <div class="rounded-xl border border-line-2 p-6 shadow-[var(--shadow-card)]">
      <div class="flex items-baseline justify-between"><div><span class="text-[22px] font-semibold">${esc(NP.costLabel(p.cost))}</span> <span class="text-ink-2">${d.perFamily}</span></div><span class="flex items-center gap-1 text-sm">${NP.icons.star()}${NP.ageFit(p, age)}.0</span></div>
      <div class="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-line text-sm">
        <div class="border-r border-line p-3"><div class="text-[10px] font-semibold uppercase">${t.pick.duration}</div><div>${d.hours(p.durationHours)}</div></div>
        <div class="p-3"><div class="text-[10px] font-semibold uppercase">${t.filterModal.drive}</div><div>${t.card.driveMin(p.driveMin)}</div></div>
        <div class="col-span-2 border-t border-line p-3"><div class="text-[10px] font-semibold uppercase">${d.parkingLabel}</div><div class="truncate">${esc(p.parking || "—")}</div></div>
      </div>
      <a class="mt-4 block rounded-lg bg-gradient-to-r from-[#e61e4d] via-[#e31c5f] to-[#d70466] py-3.5 text-center font-semibold text-white hover:brightness-105" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noreferrer">${d.gmaps}</a>
      <a class="mt-2 block rounded-lg border border-ink py-3 text-center text-sm font-semibold hover:bg-surface" href="https://maps.apple.com/?daddr=${p.lat},${p.lng}&dirflg=d" target="_blank" rel="noreferrer">${d.amaps}</a>
      <a class="mt-3 block text-center text-sm underline underline-offset-2" href="${esc(p.url)}" target="_blank" rel="noreferrer">${d.website}</a>
      <p class="mt-4 text-center text-xs text-ink-2">${d.confirm}</p>
    </div>
  </aside>
</div>
<section class="mt-6 border-t border-line-2 pt-10">
  <h2 class="text-[22px] font-semibold">${d.moreLikeThis}</h2>
  <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">${similar.map((s, i) => NP.placeCard(s, age, i)).join("")}</div>
</section>`;

  main.querySelector("[data-share]").addEventListener("click", async () => {
    const url = location.href;
    try { if (navigator.share) return void (await navigator.share({ title: document.title, url })); } catch {}
    try { await navigator.clipboard.writeText(url); NP.toast(t.actions.copied); } catch {}
  });
})();
