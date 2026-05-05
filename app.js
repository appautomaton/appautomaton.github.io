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
