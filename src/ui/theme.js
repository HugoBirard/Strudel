/**
 * theme.js
 * Gestion et persistance des thèmes visuels (6 thèmes complets).
 */

const THEME_STORAGE_KEY = 'strudel_active_theme';

export function initThemes() {
  function applyTheme(themeClass) {
    document.body.className = themeClass;
    localStorage.setItem(THEME_STORAGE_KEY, themeClass);

    document.querySelectorAll('.theme-card').forEach(card => {
      if (card.getAttribute('data-theme') === themeClass) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function loadSavedTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || 'theme-obsidian';
    applyTheme(saved);
  }

  function openThemeModal() {
    document.getElementById('theme-modal').classList.add('open');
  }

  function closeThemeModal() {
    document.getElementById('theme-modal').classList.remove('open');
  }

  // Bindings DOM
  document.getElementById('btn-open-theme-modal').onclick = openThemeModal;
  document.getElementById('btn-close-theme-modal').onclick = closeThemeModal;

  document.querySelectorAll('.theme-card').forEach(card => {
    card.onclick = () => {
      const selected = card.getAttribute('data-theme');
      applyTheme(selected);
    };
  });

  loadSavedTheme();

  return {
    applyTheme,
    loadSavedTheme
  };
}
