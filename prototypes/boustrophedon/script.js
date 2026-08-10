/* 只做三件 CSS 做不到的事。内容一个字都不由这里生成。 */

/* 1 · 日夜 */
const root = document.documentElement
const KEY = 'aa-motion-mode'
const setMode = (m) => {
  root.dataset.mode = m
  localStorage.setItem(KEY, m)
  document.querySelectorAll('.toggle button').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.mode === m)))
}
setMode(localStorage.getItem(KEY) ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'))
document.querySelectorAll('.toggle button').forEach((b) =>
  b.addEventListener('click', () => setMode(b.dataset.mode)))

if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  /* 用户要求减弱动态效果：速度驱动整个不装，版口标记也不跳。 */
} else {
  /* 2 · 滚动速度。位置回答「滚到哪了」，速度回答「滚得多急」。
     这一版把幅度压到样例页的三分之一 —— 它该是纸的质感，不是特效。 */
  let last = scrollY, vel = 0
  const tick = () => {
    const now = scrollY
    vel += ((now - last) / 42 - vel) * 0.15
    vel *= 0.9
    last = now
    root.style.setProperty('--vel-abs', Math.min(1, Math.abs(vel)).toFixed(4))
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  /* 3 · 版口上高亮当前那一幕。用 IntersectionObserver 而不是 scroll 监听，
     因为前者不在主线程上每帧跑。 */
  const marks = new Map([...document.querySelectorAll('.margin li')].map((li) => [li.dataset.act, li]))
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      const letter = e.target.id.replace(/^shelf-/, '')
      marks.get(letter)?.setAttribute('data-on', e.isIntersecting ? '1' : '0')
    }),
    { rootMargin: '-45% 0px -45% 0px' },
  )
  document.querySelectorAll('[id^="shelf-"], .coda').forEach((el) => io.observe(el))
}

/* 4 · 换幕：只给被点中的那张卡片挂名字。同源才生效，本地样例不同源，
   部署到 appautomaton.renocrypt.com 上 hub 与 15 个子站同源，自动生效。 */
addEventListener('pageswap', (e) => {
  if (!e.viewTransition) return
  const to = e.activation?.entry?.url
  const hit = to && [...document.querySelectorAll('.unit')].find((a) => a.href === to)
  if (hit) hit.querySelector('.lid').style.viewTransitionName = 'unit-lid'
})
