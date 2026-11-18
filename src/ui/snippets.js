/**
 * snippets.js
 * Gestion et persistance des snippets personnalisés de l'utilisateur (localStorage).
 */

const SNIPPETS_STORAGE_KEY = 'strudel_user_snippets';

const DEFAULT_STARTER_SNIPPETS = [
  {
    id: 'starter-1',
    title: 'Beat Techno Minimal',
    code: 's("bd [~ cp] [bd bd] cp")'
  },
  {
    id: 'starter-2',
    title: 'Basse Acid 303 (Synthé)',
    code: 'note("c2 [c2 eb2] f2 [g2 bb2]").s("sawtooth").lpf(1800).lpq(6)'
  },
  {
    id: 'starter-3',
    title: 'Hi-Hats Trap 16th',
    code: 's("hh*16").gain(0.4)'
  },
  {
    id: 'starter-4',
    title: 'Arpège Ambient (Triangle)',
    code: 'note("c4 eb4 g4 bb4 c5 eb5").s("triangle").fast(2).gain(0.5)'
  }
];

export function initSnippets({ container, onInsert }) {
  if (!container) return;

  function getUserSnippets() {
    try {
      const raw = localStorage.getItem(SNIPPETS_STORAGE_KEY);
      if (raw === null) {
        return DEFAULT_STARTER_SNIPPETS;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Erreur lecture snippets:', e);
      return DEFAULT_STARTER_SNIPPETS;
    }
  }

  function saveUserSnippets(snippets) {
    try {
      localStorage.setItem(SNIPPETS_STORAGE_KEY, JSON.stringify(snippets));
    } catch (e) {
      console.error('Erreur sauvegarde snippets:', e);
    }
  }

  function renderUserSnippets() {
    const snippets = getUserSnippets();
    container.innerHTML = '';

    if (snippets.length === 0) {
      container.innerHTML = `
        <div class="empty-snippets-msg">
          <svg class="svg-icon" viewBox="0 0 24 24" style="width: 28px; height: 28px; color: #475569; margin-bottom: 8px;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <p><strong>Aucun snippet enregistré.</strong></p>
          <p style="margin-top: 4px; font-size: 11px;">Écrivez du code, sélectionnez vos lignes préférées et cliquez sur <em>Sauvegarder la sélection</em> pour les réutiliser quand vous voulez.</p>
        </div>
      `;
      return;
    }

    snippets.forEach(snippet => {
      const card = document.createElement('div');
      card.className = 'user-snippet-card';
      card.innerHTML = `
        <div class="snippet-card-top">
          <span class="snippet-card-title">${escapeHtml(snippet.title || 'Snippet sans titre')}</span>
          <div class="snippet-card-actions">
            <button class="btn-snippet-icon delete" title="Supprimer ce snippet" data-action="delete" data-id="${snippet.id}">
              <svg class="svg-icon" viewBox="0 0 24 24" style="width: 13px; height: 13px;">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="snippet-card-preview" title="Cliquer pour insérer exactement au curseur" data-action="insert" data-id="${snippet.id}">${escapeHtml(snippet.code)}</div>
        <button class="btn-insert-snippet" data-action="insert" data-id="${snippet.id}">
          <svg class="svg-icon" viewBox="0 0 24 24" style="width: 12px; height: 12px;">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Insérer au curseur</span>
        </button>
      `;

      card.querySelectorAll('[data-action="insert"]').forEach(el => {
        el.onclick = () => {
          if (typeof onInsert === 'function') onInsert(snippet.code);
        };
      });

      card.querySelector('[data-action="delete"]').onclick = (e) => {
        e.stopPropagation();
        if (confirm('Voulez-vous supprimer ce snippet ?')) {
          const list = getUserSnippets().filter(s => s.id !== snippet.id);
          saveUserSnippets(list);
          renderUserSnippets();
        }
      };

      container.appendChild(card);
    });
  }

  function openSaveSnippetModal(prefilledCode = '') {
    const modal = document.getElementById('snippet-modal');
    const nameInput = document.getElementById('input-snippet-name');
    const codeInput = document.getElementById('input-snippet-code');

    nameInput.value = '';
    codeInput.value = prefilledCode;
    modal.classList.add('open');
    nameInput.focus();
  }

  function closeSaveSnippetModal() {
    document.getElementById('snippet-modal').classList.remove('open');
  }

  function confirmSaveSnippet() {
    const nameInput = document.getElementById('input-snippet-name');
    const codeInput = document.getElementById('input-snippet-code');

    const title = nameInput.value.trim() || 'Ligne personnalisée';
    const code = codeInput.value;

    if (!code) {
      alert('Veuillez renseigner le code ou la ligne à sauvegarder.');
      return;
    }

    const list = getUserSnippets();
    list.unshift({
      id: Date.now(),
      title: title,
      code: code
    });

    saveUserSnippets(list);
    renderUserSnippets();
    closeSaveSnippetModal();
  }

  // Bindings DOM
  document.getElementById('btn-add-snippet').onclick = () => openSaveSnippetModal('');
  document.getElementById('btn-close-snippet-modal').onclick = closeSaveSnippetModal;
  document.getElementById('btn-cancel-snippet').onclick = closeSaveSnippetModal;
  document.getElementById('btn-confirm-save-snippet').onclick = confirmSaveSnippet;

  renderUserSnippets();

  return {
    openSaveSnippetModal,
    renderUserSnippets
  };
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
