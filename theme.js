/* Theme switcher — palette dots + day/night toggle.
   The pre-paint boot script in <head> sets the initial
   data-palette / data-mode attributes; this file only handles
   interaction, persistence, and OS-scheme tracking. */
(function () {
  var root = document.documentElement;
  var PALETTES = ['amber', 'blue', 'graphite', 'verdigris', 'mono'];
  var THEME_COLOR = {
    day:   { amber: '#1a1714', blue: '#0c1726', graphite: '#131218', verdigris: '#0f1a15', mono: '#151515' },
    night: { amber: '#16110d', blue: '#0a1322', graphite: '#0f0e14', verdigris: '#0a120e', mono: '#0d0d0d' }
  };

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  function sync() {
    var palette = root.getAttribute('data-palette');
    var mode = root.getAttribute('data-mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && THEME_COLOR[mode] && THEME_COLOR[mode][palette]) {
      meta.setAttribute('content', THEME_COLOR[mode][palette]);
    }
    document.querySelectorAll('.aa-theme-dot').forEach(function (dot) {
      dot.setAttribute('aria-pressed', String(dot.getAttribute('data-set-palette') === palette));
    });
    document.querySelectorAll('.aa-theme-mode').forEach(function (btn) {
      btn.setAttribute('aria-label', mode === 'night' ? 'Switch to day mode' : 'Switch to night mode');
    });
  }

  document.addEventListener('click', function (e) {
    var dot = e.target.closest('.aa-theme-dot');
    if (dot) {
      var palette = dot.getAttribute('data-set-palette');
      if (PALETTES.indexOf(palette) > -1) {
        root.setAttribute('data-palette', palette);
        store('aa-palette', palette);
        sync();
      }
      return;
    }
    var btn = e.target.closest('.aa-theme-mode');
    if (btn) {
      var mode = root.getAttribute('data-mode') === 'night' ? 'day' : 'night';
      root.setAttribute('data-mode', mode);
      store('aa-mode', mode);
      sync();
    }
  });

  // Follow OS changes until the user picks a mode explicitly.
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var follow = function (ev) {
      var stored = null;
      try { stored = localStorage.getItem('aa-mode'); } catch (e) {}
      if (!stored) {
        root.setAttribute('data-mode', ev.matches ? 'night' : 'day');
        sync();
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', follow);
    else if (mq.addListener) mq.addListener(follow);
  }

  sync();
})();
