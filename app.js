(function () {
  const tabs    = document.querySelectorAll('.aa-install-tab');
  const cmdSpan = document.querySelector('.aa-install-cmd .aa-cmd');
  const pkgSpan = document.querySelector('.aa-install-cmd .pkg');
  const copyBtn = document.querySelector('.aa-install-copy');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      cmdSpan.textContent = tab.dataset.cmd;
      pkgSpan.textContent = tab.dataset.pkg;
    });
  });

  let copyTimer = null;
  copyBtn.addEventListener('click', () => {
    const text = cmdSpan.textContent + pkgSpan.textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    copyBtn.classList.add('is-copied');
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => copyBtn.classList.remove('is-copied'), 1400);
  });

  // Lucide replaces <i data-lucide="…"> with inline SVGs. Wait for the script
  // to load before calling — the CDN tag is async-by-default in some browsers.
  function initIcons() { if (window.lucide) window.lucide.createIcons(); }
  if (document.readyState === 'complete') initIcons();
  else window.addEventListener('load', () => setTimeout(initIcons, 50));

  // Disclosure trace — appends one trace line per tick once the anatomy
  // section scrolls into view, loops indefinitely with a brief pause.
  const traceEl = document.querySelector('.aa-trace');
  if (traceEl) {
    const stepEl = document.querySelector('.aa-trace-step');
    const EVENTS = [
      { t: 'L1', tag: 'meta', cls: 'plan',
        html: 'Frontmatter scanned <span class="tok">→ name + description registered</span>' },
      { t: 'L1', tag: 'meta', cls: 'plan',
        html: 'Always loaded <span class="tok">·</span> <span class="num">~140 tokens</span>' },
      { t: 'L2', tag: 'body', cls: 'tool',
        html: 'User asks: <span class="arg">"build a PDF report from sales.csv"</span>' },
      { t: 'L2', tag: 'body', cls: 'tool',
        html: 'SKILL.md body loaded <span class="tok">·</span> <span class="num">workflow + safety</span>' },
      { t: 'L2', tag: 'llm',  cls: 'llm',
        html: 'Agent reads "Quick start" <span class="tok">→ chooses extract path</span>' },
      { t: 'L3', tag: 'ref',  cls: 'mem',
        html: 'references/forms.md loaded <span class="tok">on demand</span>' },
      { t: 'L3', tag: 'tool', cls: 'tool',
        html: 'scripts/extract.py invoked <span class="tok">· uv run · PEP 723</span>' },
      { t: 'OK', tag: 'done', cls: 'done',
        html: 'skill.complete <span class="tok">·</span> <span class="num">3 files</span> <span class="tok">·</span> <span class="num">12.4kB ctx</span>' },
    ];

    let i = 0;
    let timer = null;
    const setStep = (n) => { if (stepEl) stepEl.textContent = n + ' / ' + EVENTS.length + ' steps'; };

    function tick() {
      if (i < EVENTS.length) {
        const e = EVENTS[i];
        const line = document.createElement('div');
        line.className = 'aa-trace-line';
        line.innerHTML =
          '<span class="aa-trace-time">' + e.t + '</span>' +
          '<span class="aa-trace-tag ' + e.cls + '">' + e.tag + '</span>' +
          '<span class="aa-trace-msg">' + e.html + '</span>';
        traceEl.appendChild(line);
        i += 1;
        setStep(i);
        timer = setTimeout(tick, 520);
      } else {
        timer = setTimeout(() => {
          traceEl.innerHTML = '';
          i = 0;
          setStep(0);
          timer = setTimeout(tick, 600);
        }, 3400);
      }
    }

    function start() { if (timer == null) timer = setTimeout(tick, 600); }

    if ('IntersectionObserver' in window) {
      const target = document.getElementById('anatomy') || traceEl;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { start(); obs.disconnect(); }
        });
      }, { rootMargin: '0px 0px -15% 0px' });
      obs.observe(target);
    } else {
      start();
    }
  }
})();

/* Mobile header dropdown — toggles the #aa-menu sheet under the bar.
   Theme controls live inside the sheet and keep working via the
   document-level delegation in theme.js. */
(function () {
  var toggle = document.querySelector('.aa-menu-toggle');
  var menu = document.getElementById('aa-menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close after picking a nav destination.
  menu.querySelectorAll('.aa-nav-link').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  // Close on outside tap (theme dots are inside the sheet, so they don't close it).
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') &&
        !menu.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on Escape.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // Reset when the viewport grows back to desktop so the state can't get stuck.
  if (window.matchMedia) {
    var mq = matchMedia('(min-width: 901px)');
    var reset = function (ev) { if (ev.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', reset);
    else if (mq.addListener) mq.addListener(reset);
  }
})();

/* Hero cursor spotlight — a soft accent glow that tracks the pointer and reacts
   to how it moves. A rAF loop eases the glow toward the cursor (so it trails),
   stretches it along the axis of motion, and brightens it with speed; when the
   pointer rests it settles to a calm circle with a faint breathing pulse, and
   it fades out on leave. Pointer (fine-hover) devices only, never under reduced
   motion. */
(function () {
  var hero = document.querySelector('.aa-hero');
  if (!hero || !window.matchMedia) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var BASE = 300, MAX_ADD = 240;            // glow radius range, px
  var tx = 0, ty = 0, cx = 0, cy = 0;       // target + eased position
  var lpx = 0, lpy = 0, vx = 0, vy = 0;     // last pointer pos + velocity
  var rx = BASE, ry = BASE, o = 0;          // eased radii + opacity
  var inside = false, raf = null, t = 0;

  function lerp(a, b, n) { return a + (b - a) * n; }
  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  function onMove(e) {
    var r = hero.getBoundingClientRect();
    var nx = e.clientX - r.left, ny = e.clientY - r.top;
    vx = nx - lpx; vy = ny - lpy;
    lpx = nx; lpy = ny; tx = nx; ty = ny;
  }

  function frame() {
    t += 1;
    cx = lerp(cx, tx, 0.14);
    cy = lerp(cy, ty, 0.14);
    var speed = clamp01(Math.hypot(vx, vy) / 38);
    vx *= 0.82; vy *= 0.82;                  // velocity decays so it settles
    var breathe = Math.sin(t * 0.028) * 9;   // gentle idle pulse
    rx = lerp(rx, BASE + Math.min(MAX_ADD, Math.abs(vx) * 9) + breathe, 0.1);
    ry = lerp(ry, BASE + Math.min(MAX_ADD, Math.abs(vy) * 9) + breathe, 0.1);
    var targetO = inside ? 0.5 + speed * 0.85 : 0;
    o = lerp(o, targetO, inside ? 0.14 : 0.07);

    hero.style.setProperty('--hero-mx', cx + 'px');
    hero.style.setProperty('--hero-my', cy + 'px');
    hero.style.setProperty('--hero-rx', rx + 'px');
    hero.style.setProperty('--hero-ry', ry + 'px');
    hero.style.setProperty('--hero-o', o.toFixed(3));

    if (inside || o > 0.01) raf = requestAnimationFrame(frame);
    else raf = null;
  }
  function start() { if (raf == null) raf = requestAnimationFrame(frame); }

  hero.addEventListener('pointerenter', function (e) {
    var r = hero.getBoundingClientRect();
    lpx = e.clientX - r.left; lpy = e.clientY - r.top;
    tx = cx = lpx; ty = cy = lpy;
    inside = true; start();
  });
  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', function () { inside = false; start(); });
})();
