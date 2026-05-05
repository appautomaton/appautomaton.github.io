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
})();
