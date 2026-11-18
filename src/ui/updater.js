/**
 * updater.js
 * Gestionnaire de mises à jour élégant et intégré au design sombre de Strudel Studio.
 * Remplace tout alert() natif par des cartes d'états visuelles dans une modale dédiée.
 */

export function initUpdater() {
  const btnUpdate = document.getElementById('btn-update');
  const updateIcon = document.getElementById('update-icon');
  const updateLabel = document.getElementById('update-label');
  const updateDot = document.getElementById('update-dot');

  const modal = document.getElementById('update-modal');
  const modalBody = document.getElementById('modal-update-body');
  const modalFooter = document.getElementById('modal-update-footer');
  const btnCloseModal = document.getElementById('btn-close-modal');

  function openModal() {
    if (modal) modal.classList.add('open');
  }

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (btnCloseModal) {
    btnCloseModal.onclick = closeModal;
  }

  // Fermeture si clic sur le fond flouté
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  /**
   * ÉTAT 1 : Recherche en cours
   */
  function showCheckingState() {
    openModal();
    modalBody.innerHTML = `
      <div class="update-hero">
        <div class="update-icon-circle checking">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="feather-icon spin-anim">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </div>
        <div class="update-title">Recherche de mises à jour...</div>
        <div class="update-subtitle">Connexion au dépôt GitHub <code>HugoBirard/Strudel</code> et vérification des commits...</div>
        <div class="update-progress-bar-wrap">
          <div class="update-progress-bar-fill"></div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn-action" id="btn-update-cancel">Fermer</button>
    `;
    const btnCancel = document.getElementById('btn-update-cancel');
    if (btnCancel) btnCancel.onclick = closeModal;
  }

  /**
   * ÉTAT 2 : Application parfaitement à jour
   */
  function showUpToDateState(info) {
    openModal();
    const repoName = info.repo?.repoName || 'HugoBirard/Strudel';
    const branch = info.branch || 'main';
    const commit = info.currentVersion || 'Dernier';

    modalBody.innerHTML = `
      <div class="update-hero">
        <div class="update-icon-circle success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="update-title">Strudel Studio est parfaitement à jour</div>
        <div class="update-subtitle">Vous disposez déjà de la version la plus récente avec tous les derniers correctifs et optimisations.</div>
        
        <div class="update-info-grid">
          <div class="update-info-card">
            <span class="update-info-label">Dépôt officiel</span>
            <span class="update-info-val" style="color: #10b981;">✓ ${repoName}</span>
          </div>
          <div class="update-info-card">
            <span class="update-info-label">Branche active</span>
            <span class="update-info-val">${branch}</span>
          </div>
          <div class="update-info-card">
            <span class="update-info-label">Version / Commit</span>
            <span class="update-info-val"><code>${commit}</code></span>
          </div>
          <div class="update-info-card">
            <span class="update-info-label">Statut système</span>
            <span class="update-info-val" style="color: #10b981;">Synchronisé</span>
          </div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn-action" id="btn-update-recheck">Revérifier</button>
      <button class="btn-play" id="btn-update-done" style="padding: 7px 18px;">
        <span>Compris</span>
      </button>
    `;

    const btnRecheck = document.getElementById('btn-update-recheck');
    if (btnRecheck) btnRecheck.onclick = () => checkUpdates(false);

    const btnDone = document.getElementById('btn-update-done');
    if (btnDone) btnDone.onclick = closeModal;
  }

  /**
   * ÉTAT 3 : Mise à jour disponible
   */
  function showUpdateAvailableState(info) {
    openModal();
    const branch = info.branch || 'main';
    const curVer = info.currentVersion || 'actuelle';
    const newVer = info.latestVersion || 'nouvelle';
    const changelog = info.changelog || 'Mise à jour des composants et améliorations diverses.';

    modalBody.innerHTML = `
      <div class="update-hero">
        <div class="update-icon-circle update-avail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="feather-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div class="update-title">Nouvelle mise à jour disponible !</div>
        <div class="update-subtitle">Une nouvelle version est disponible sur la branche <code>${branch}</code>.</div>

        <div class="update-diff-badge">
          <span>${curVer}</span>
          <span>➔</span>
          <span style="color: #4ade80;">${newVer}</span>
        </div>

        <div class="update-changelog-wrapper">
          <span class="update-changelog-title">Détails des améliorations :</span>
          <div class="update-changelog-content">${escapeHtml(changelog)}</div>
        </div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn-action" id="btn-update-later">Plus tard</button>
      <button class="btn-play" id="btn-update-install-now" style="padding: 7px 20px;">
        <svg class="svg-icon" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Mettre à jour & Redémarrer</span>
      </button>
    `;

    const btnLater = document.getElementById('btn-update-later');
    if (btnLater) btnLater.onclick = closeModal;

    const btnInstall = document.getElementById('btn-update-install-now');
    if (btnInstall) btnInstall.onclick = triggerInstallUpdate;
  }

  /**
   * ÉTAT 4 : Installation en cours
   */
  function showInstallingState() {
    openModal();
    modalBody.innerHTML = `
      <div class="update-hero">
        <div class="update-icon-circle update-avail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="feather-icon spin-anim">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </div>
        <div class="update-title">Installation en cours...</div>
        <div class="update-subtitle">Téléchargement des commits et recompilation des modules. L'application va redémarrer automatiquement dès que l'opération sera terminée.</div>
        <div class="update-progress-bar-wrap">
          <div class="update-progress-bar-fill"></div>
        </div>
      </div>
    `;
    modalFooter.innerHTML = '';
  }

  /**
   * ÉTAT 5 : Erreur ou réseau inaccessible
   */
  function showErrorState(errMessage) {
    openModal();
    modalBody.innerHTML = `
      <div class="update-hero">
        <div class="update-icon-circle error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="feather-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="update-title">Vérification impossible</div>
        <div class="update-subtitle">${escapeHtml(errMessage || 'Impossible de joindre le serveur GitHub. Vérifiez votre connexion Internet ou réessayez dans quelques instants.')}</div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button class="btn-action" id="btn-update-close-err">Fermer</button>
      <button class="btn-play" id="btn-update-retry" style="padding: 7px 18px;">
        <span>Réessayer</span>
      </button>
    `;

    const btnClose = document.getElementById('btn-update-close-err');
    if (btnClose) btnClose.onclick = closeModal;

    const btnRetry = document.getElementById('btn-update-retry');
    if (btnRetry) btnRetry.onclick = () => checkUpdates(false);
  }

  /**
   * Lance la vérification des mises à jour
   */
  async function checkUpdates(silent = false) {
    if (!window.desktopApi || !window.desktopApi.checkForUpdates) {
      if (!silent) {
        showErrorState('La vérification automatique est uniquement disponible dans l\'application Desktop native.');
      }
      return;
    }

    try {
      if (!silent) showCheckingState();

      if (updateLabel) updateLabel.textContent = 'Vérification...';
      if (updateIcon) updateIcon.style.animation = 'spin 1s linear infinite';

      const res = await window.desktopApi.checkForUpdates();

      if (updateIcon) updateIcon.style.animation = '';
      if (updateLabel) updateLabel.textContent = 'Mises à jour';

      if (res && res.hasUpdate) {
        if (btnUpdate) btnUpdate.classList.add('has-update');
        if (updateDot) updateDot.style.display = 'inline-block';
        showUpdateAvailableState(res);
      } else {
        if (btnUpdate) btnUpdate.classList.remove('has-update');
        if (updateDot) updateDot.style.display = 'none';
        if (!silent) {
          showUpToDateState(res || {});
        }
      }
    } catch (err) {
      console.warn('Erreur vérification maj:', err);
      if (updateIcon) updateIcon.style.animation = '';
      if (updateLabel) updateLabel.textContent = 'Mises à jour';
      if (!silent) {
        showErrorState(err.message || 'Erreur lors de la communication avec Git.');
      }
    }
  }

  /**
   * Déclenche le téléchargement et l'installation
   */
  async function triggerInstallUpdate() {
    showInstallingState();

    try {
      const res = await window.desktopApi.installUpdate();
      if (res && res.success) {
        setTimeout(() => {
          window.desktopApi.restartApp();
        }, 1200);
      } else {
        showErrorState('Échec de l\'installation : ' + (res?.error || 'Erreur inconnue'));
      }
    } catch (err) {
      showErrorState('Erreur lors de l\'application des fichiers : ' + err.message);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Raccordement bouton du transport
  if (btnUpdate) {
    btnUpdate.onclick = () => checkUpdates(false);
  }

  // Vérification silencieuse 3s après le démarrage
  setTimeout(() => {
    checkUpdates(true);
  }, 3000);

  return {
    checkUpdates
  };
}
