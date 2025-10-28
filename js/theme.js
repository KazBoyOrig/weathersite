
document.addEventListener('DOMContentLoaded', () => {
  const btns = document.querySelectorAll('#themeToggle');
  const apply = (isDark) => {
    if (isDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    try { localStorage.setItem('kaz_theme_dark', isDark ? '1' : '0'); } catch(e) {}
  };
  let preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let saved = null;
  try { saved = localStorage.getItem('kaz_theme_dark'); } catch(e){}
  if (saved !== null) apply(saved === '1'); else apply(preferDark);

  btns.forEach(b => {
    b.addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark');
      apply(dark);
    });
  });
});
