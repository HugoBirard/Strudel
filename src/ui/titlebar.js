/**
 * titlebar.js
 * Contrôleur de la barre de titre système personnalisée et du redimensionnement de fenêtre.
 * Inspiré directement du système de TitleBar de ToDoList (GTK4 / Seamless CSD).
 * Gère les contrôles natifs (réduire, agrandir/restaurer, fermer) et les styles visuels :
 * - match-bg    : Monolithique, couleur identique au thème sombre actif
 * - glass       : Verre fumé Glassmorphism avec reflet et ombre portée
 * - neon        : Liseré lumineux cyber indigo avec halo néon
 * - transparent : Transparente & intégrée sans rupture (style Spotify / Discord)
 * - minimal     : Hauteur réduite (28px) sans titre pour surface utile maximale
 */

const STORAGE_KEY = 'strudel_titlebar_style';
export const DEFAULT_STYLE = 'match-bg';

export function initTitlebar() {
  const titlebar = document.getElementById('system-titlebar');
  const btnMin = document.getElementById('win-btn-minimize');
  const btnMax = document.getElementById('win-btn-maximize');
  const btnClose = document.getElementById('win-btn-close');
  const maxIcon = document.getElementById('win-btn-max-icon');
  const statusText = document.getElementById('titlebar-status-text');

  // 1. Raccordement des boutons de contrôle de fenêtre
  if (window.desktopApi) {
    if (btnMin) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        window.desktopApi.windowMinimize?.();
      });
    }

    if (btnMax) {
      btnMax.addEventListener('click', (e) => {
        e.stopPropagation();
        window.desktopApi.windowMaximize?.();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        window.desktopApi.windowClose?.();
      });
    }

    // Double clic sur la zone neutre de la barre pour maximiser / restaurer
    if (titlebar) {
      titlebar.addEventListener('dblclick', (e) => {
        if (!e.target.closest('button') && !e.target.closest('input')) {
          window.desktopApi.windowMaximize?.();
        }
      });
    }

    // Écouteur de changement d'état maximisé
    window.desktopApi.onMaximizeChange?.((isMaximized) => {
      updateMaximizeIcon(isMaximized);
    });

    // Synchronisation initiale
    window.desktopApi.isWindowMaximized?.().then((isMaximized) => {
      updateMaximizeIcon(isMaximized);
    });
  }

  function updateMaximizeIcon(isMaximized) {
    if (!maxIcon || !btnMax) return;
    if (isMaximized) {
      // Icône restaurer (deux rectangles superposés style GNOME/Windows)
      maxIcon.innerHTML = `
        <rect x="7" y="7" width="11" height="11" rx="1.5" stroke="currentColor" fill="none" stroke-width="2"/>
        <path d="M7 11.5V5a1.5 1.5 0 0 1 1.5-1.5H15A1.5 1.5 0 0 1 16.5 5v6.5a1.5 1.5 0 0 1-1.5 1.5H13" stroke="currentColor" fill="none" stroke-width="2"/>
      `;
      btnMax.title = 'Restaurer la taille normale (permet de mettre une fenêtre à côté)';
    } else {
      // Icône agrandir (rectangle unique)
      maxIcon.innerHTML = `<rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" fill="none" stroke-width="2"/>`;
      btnMax.title = 'Agrandir en plein écran';
    }
  }

  // 2. Initialisation des bordures de redimensionnement de la fenêtre (frameless desktop)
  initWindowResizers();

  // 3. Initialisation et persistance du style visuel
  function applyTitlebarStyle(styleKey) {
    if (!titlebar) return;

    // Supprimer tous les styles de classe
    titlebar.classList.remove(
      'titlebar-match-bg',
      'titlebar-glass',
      'titlebar-neon',
      'titlebar-transparent',
      'titlebar-minimal'
    );

    const validStyles = ['match-bg', 'glass', 'neon', 'transparent', 'minimal'];
    const selected = validStyles.includes(styleKey) ? styleKey : DEFAULT_STYLE;

    titlebar.classList.add(`titlebar-${selected}`);
    localStorage.setItem(STORAGE_KEY, selected);

    // Synchroniser l'état actif des boutons de choix dans le modal Thèmes
    document.querySelectorAll('.titlebar-option-btn').forEach((btn) => {
      if (btn.getAttribute('data-titlebar') === selected) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Clic sur les options du modal de thèmes
  document.querySelectorAll('.titlebar-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const style = btn.getAttribute('data-titlebar');
      if (style) applyTitlebarStyle(style);
    });
  });

  const savedStyle = localStorage.getItem(STORAGE_KEY) || DEFAULT_STYLE;
  applyTitlebarStyle(savedStyle);

  // Méthode publique pour mettre à jour le libellé de statut ou de morceau
  function setTitlebarStatus(text) {
    if (statusText) statusText.textContent = text;
  }

  return {
    applyTitlebarStyle,
    setTitlebarStatus
  };
}

/**
 * Gère le redimensionnement fluide de la fenêtre aux 4 bords et 4 coins
 */
function initWindowResizers() {
  if (!window.desktopApi?.windowSetBounds || !window.desktopApi?.windowGetBounds) return;

  const resizers = document.querySelectorAll('.win-resizer');
  resizers.forEach((resizer) => {
    resizer.addEventListener('mousedown', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const dir = resizer.getAttribute('data-direction');
      const startBounds = await window.desktopApi.windowGetBounds();
      const startMouseX = e.screenX;
      const startMouseY = e.screenY;

      let isDragging = true;
      document.body.style.userSelect = 'none';

      function onMouseMove(moveEvent) {
        if (!isDragging) return;

        const deltaX = moveEvent.screenX - startMouseX;
        const deltaY = moveEvent.screenY - startMouseY;

        let newX = startBounds.x;
        let newY = startBounds.y;
        let newWidth = startBounds.width;
        let newHeight = startBounds.height;

        const MIN_W = 480;
        const MIN_H = 360;

        if (dir.includes('e')) {
          newWidth = Math.max(MIN_W, startBounds.width + deltaX);
        }
        if (dir.includes('s')) {
          newHeight = Math.max(MIN_H, startBounds.height + deltaY);
        }
        if (dir.includes('w')) {
          const proposedW = startBounds.width - deltaX;
          if (proposedW >= MIN_W) {
            newWidth = proposedW;
            newX = startBounds.x + deltaX;
          }
        }
        if (dir.includes('n')) {
          const proposedH = startBounds.height - deltaY;
          if (proposedH >= MIN_H) {
            newHeight = proposedH;
            newY = startBounds.y + deltaY;
          }
        }

        window.desktopApi.windowSetBounds({
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        });
      }

      function onMouseUp() {
        isDragging = false;
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  });
}
