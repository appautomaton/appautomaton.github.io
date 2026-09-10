export const escapeHTML = value => String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')
export const editorial = value => String(value??'').replace(/\s*[—–]\s*/g, ', ').replaceAll(';', ',').trim()
const paths={
 arrow:'<path d="M5 19 19 5M5 5h14v14"/>',
 down:'<path d="M12 4v16M5 13l7 7 7-7"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 moon:'<path d="M16 3A9 9 0 1 0 21 17 9 9 0 0 1 16 3Z"/>',
 search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
 plus:'<path d="M12 3v18M3 12h18"/>',
 grid:'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 play:'<path d="m7 4 13 8-13 8Z"/>',
 layers:'<path d="m2 7 10-5 10 5-10 5Zm0 5 10 5 10-5M2 17l10 5 10-5"/>',
 frame:'<path d="M3 21V3h18v18M8 21V8h8v13"/>',
 wave:'<path d="M2 12c3-13 5-13 8 0s5 13 8 0 3-13 4 0"/>',
 circle:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/>',
}
export function icon(name, cls='') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>` }
export function logo() { return '<svg class="brand-mark" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" aria-hidden="true"><path d="M5 40V18a9.5 9.5 0 0 1 19 0v22M24 40V26a9.5 9.5 0 0 1 19 0v14M5 28h19M24 33h19"/></svg>' }
