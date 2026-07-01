document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  window.updateThemeUI = function() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    
    if (window.AxentroLang && window.AxentroLang.updateThemeText) {
      window.AxentroLang.updateThemeText(isLight);
    }
  };

  themeToggle.addEventListener('click', (e) => {
    if (window.createRipple) window.createRipple(e);
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.updateThemeUI();
  });

  window.updateThemeUI();
});
