/* 照片版權頁 */
(async function () {
  "use strict";
  const NP = window.NP, t = NP.t, loc = NP.locale, esc = NP.esc;
  NP.boot();
  const data = await NP.loadData();
  document.title = `${t.about.credits} · ${NP.BRAND}`;
  const list = data.places.filter((p) => data.credits?.[p.slug]);
  document.querySelector("[data-credits-list]").innerHTML = list.map((p) => {
    const c = data.credits[p.slug];
    return `<li class="flex flex-wrap items-baseline gap-x-3 py-3"><a class="font-medium hover:underline" href="/${loc}/place/${esc(p.slug)}">${esc(p.name)}</a><span class="text-ink-2"><a class="hover:underline" href="${esc(c.source)}" target="_blank" rel="noreferrer">${esc(c.file.replace(/^File:/, "").replace(/_/g, " "))}</a> · ${esc(c.artist)} · ${c.licenseUrl ? `<a class="hover:underline" href="${esc(c.licenseUrl)}" target="_blank" rel="noreferrer">${esc(c.license)}</a>` : esc(c.license)}</span></li>`;
  }).join("");
})();
