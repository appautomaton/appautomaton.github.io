/* 用真实目录数据生成「回行」这一版。

   数据从 src/data/catalog.ts 导出，不是手抄的 —— 这一版要能直接对上
   真站，所以链接、描述、chips、plate 编号全部来自同一个源。 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(DIR, '..', '..', 'prototypes', 'catalog.snapshot.json'), 'utf8'))

const PLATES = [
  'camera-obscura', 'gears', 'magic-lantern', 'serinette', 'duck', 'cloud-machine',
  'imprimerie', 'durer-perspective', 'schouwburg', 'stage-trio', 'cartouche', 'comedie-section',
]
const ROMAN = ['I', 'II', 'III', 'IV']
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

let plateIdx = 0
const unit = (p) => {
  const plate = PLATES[plateIdx++ % PLATES.length]
  return `
          <a class="unit" href="${p.site ?? `https://github.com/appautomaton/${p.repo}`}">
            <span class="lid"><img src="../../src/plates/${plate}.webp" alt=""></span>
            <span class="meat">
              <span class="plate-no">PLATE ${p.tag}</span>
              <h3>${esc(p.repo)}</h3>
              <p>${esc(p.description)}</p>
              <span class="chips">${p.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</span>
              <span class="go">Open →</span>
            </span>
          </a>`
}

/* A 向右读，B 掉头向左，C 再向右，D 是尾声不做带。
   方向交替本身就是这一版的主张，所以它由序号决定，不由数据决定。 */

/* 转行：牛走到地头掉头。纯装饰，aria-hidden，而且它落在两幕之间，
   不会插进任何标题与它的单元中间 —— DOM 的那条直线没有被打断。
   pathLength="100" 把描边长度归一化，dasharray 就不必跟着坐标改。 */
const turn = (to, numeral) => `
    <div class="turn" data-to="${to}" aria-hidden="true" style="--len:100">
      <span class="no">${numeral}</span>
      <svg viewBox="0 0 1060 220" role="presentation">
        <path pathLength="100" d="M 12 34 H 936 A 74 74 0 0 1 936 182 H 12 M 12 182 l 26 -12 M 12 182 l 26 12"/>
      </svg>
      <span class="cap">${to === 'rtl' ? 'the turn · now reading left' : 'the turn · now reading right'}</span>
    </div>`

const acts = catalog
  .filter((s) => s.items.length > 1)
  .map((shelf, i) => {
    const dir = i % 2 === 0 ? 'ltr' : 'rtl'
    const id = `act-${shelf.letter.toLowerCase()}`
    /* 单元多到一条犁沟装不下时，折成上下两条反向并行的。DOM 不变：
       标题、上行的单元、下行的单元，依然是一条直线。 */
    const double = shelf.items.length > 6
    const head = `<header class="act-head">
              <p class="no">ACT ${ROMAN[i]} · ${shelf.items.length} UNITS${double ? ' · DOUBLE FURROW' : ''}</p>
              <h2 id="${id}">${esc(shelf.label)}</h2>
              <p>${esc(shelf.blurb)}</p>
              <p class="dir">${double ? 'reading ⇄ both ways' : dir === 'ltr' ? 'reading ————→ right' : 'left ←———— reading'}</p>
            </header>`
    return `
    <section class="act" data-dir="${dir}"${double ? ' data-plow="double"' : ''} aria-labelledby="${id}" id="shelf-${shelf.letter}">
      <div class="act-rail" style="--units:${shelf.items.length}">
        <div class="act-stage">
          <span class="act-no" aria-hidden="true">${ROMAN[i]}</span>
          ${double ? `
          <div class="reel reel-a">
            ${head}
${shelf.items.slice(0, Math.ceil(shelf.items.length / 2)).map(unit).join('')}
          </div>
          <div class="reel reel-b">
${shelf.items.slice(Math.ceil(shelf.items.length / 2)).map(unit).join('')}
          </div>` : `
          <div class="reel">
            ${head}
${shelf.items.map(unit).join('')}
          </div>`}
        </div>
      </div>
    </section>`
  })
  .flatMap((html, i, all) => (i < all.length - 1 ? [html, turn(i % 2 === 0 ? 'rtl' : 'ltr', ROMAN[i + 1])] : [html]))
  .join('\n')

const coda = catalog.find((s) => s.items.length === 1)
const total = catalog.reduce((n, s) => n + s.items.length, 0)

const ld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://appautomaton.renocrypt.com/#website',
      name: 'App Automaton',
      url: 'https://appautomaton.renocrypt.com/',
      publisher: { '@id': 'https://appautomaton.renocrypt.com/#org' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://appautomaton.renocrypt.com/#org',
      name: 'App Automaton',
      url: 'https://appautomaton.renocrypt.com/',
    },
    ...catalog.flatMap((s) =>
      s.items.map((p) => ({
        '@type': 'SoftwareSourceCode',
        '@id': `${p.site ?? `https://github.com/appautomaton/${p.repo}`}#project`,
        name: p.repo,
        description: p.description,
        url: p.site ?? `https://github.com/appautomaton/${p.repo}`,
        codeRepository: `https://github.com/appautomaton/${p.repo}`,
        isPartOf: { '@id': 'https://appautomaton.renocrypt.com/#website' },
      })),
    ),
  ],
}

writeFileSync(
  join(DIR, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>App Automaton — an open workshop for engineering with coding agents</title>
<meta name="description" content="Twenty open-source units across four shelves: portable SKILLs, stage-gated harnesses, on-device MLX runtimes, and creative production. An AppCubic workshop.">
<link rel="canonical" href="https://appautomaton.renocrypt.com/">
<link rel="stylesheet" href="./style.css">
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
</head>
<body>
<a class="skip" href="#catalog">Skip to the catalog</a>

<div class="margin" aria-hidden="true">
  <span class="hair"></span><span class="run"></span>
  <ol>${catalog.map((s) => `<li data-act="${s.letter}">${s.letter}</li>`).join('')}</ol>
</div>

<div class="top">
  <span class="mark">App Automaton</span>
  <nav>
    <a href="https://github.com/appautomaton">GitHub</a>
    <div class="toggle">
      <button data-mode="day" aria-pressed="true">Day</button>
      <button data-mode="night" aria-pressed="false">Night</button>
    </div>
  </nav>
</div>

<header class="head">
  <div class="plate-bed" aria-hidden="true"><img src="../../src/plates/schouwburg.webp" alt=""></div>
  <div class="say">
    <p class="kicker">The open workshop of AppCubic</p>
    <h1>App<br>Automaton</h1>
    <p class="sub">An open-source workshop for engineering with coding agents. Portable SKILLs, stage-gated harnesses, on-device MLX runtimes, and one creative harness pointed at club music.</p>
    <p class="count">${total} units · ${catalog.length} shelves · read boustrophedon ⇄</p>
  </div>
</header>

<main id="catalog">
${acts}

${turn("rtl", ROMAN[catalog.length - 1])}

  <section class="coda" aria-labelledby="act-d">
    <div class="inner">
      <div>
        <p class="kicker">Act ${ROMAN[catalog.length - 1]} · coda</p>
        <h2 id="act-d">${esc(coda.label)}</h2>
        <p class="blurb">${esc(coda.blurb)}</p>
      </div>
      ${unit(coda.items[0])}
    </div>
  </section>
</main>

<footer class="colophon">
  <p>Boustrophedon: as the ox plows. One line runs right, the next turns and runs left. It is how early Greek inscriptions were cut, and it is how this catalog reads. The direction alternates in the presentation only. In the document, every unit follows its heading in a single straight line.</p>
  <p class="mono">
    ${total} units · ${catalog.length} shelves<br>
    League Gothic · Gambetta · Martian Mono<br>
    Plates public domain, sources recorded<br>
  </p>
</footer>

<script src="./script.js"></script>
</body>
</html>
`,
)

console.log(`wrote index.html — ${total} units, ${acts.split('<section').length - 1} horizontal acts + 1 coda`)
