/**
 * updater.js
 * Gestion de la vérification et de l'installation des mises à jour de l'application.
 */

export function initUpdater() {
  const btnUpdate = document.getElementById('btn-update');
  const updateIcon = document.getElementById('update-icon');
  const updateLabel = document.getElementById('update-label');
  const updateDot = document.getElementById('update-dot');

  async function checkUpdates(silent = false) {
    if (!window.desktopApi || !window.desktopApi.checkForUpdates) {
      if (!silent) alert('Vérification des mises à jour disponible dans l\'application desktop.');
      return;
    }

    try {
      updateLabel.textContent = 'Vérification...';
      updateIcon.style.animation = 'spin 1s linear infinite';

      const res = await window.desktopApi.checkForUpdates();

      updateIcon.style.animation = '';
      updateLabel.textContent = 'Mises à jour';

      if (res && res.hasUpdate) {
        btnUpdate.classList.add('has-update');
        updateDot.style.display = 'inline-block';
        openUpdateModal(res);
      } else {
        btnUpdate.classList.remove('has-update');
        updateDot.style.display = 'none';
        if (!silent) {
          const repoMsg = res.repo && res.repo.isMatching 
            ? `sur le dépôt ${res.repo.repoName}` 
            : '';
          alert(`Votre version de Strudel Studio est parfaitement à jour (${res.currentVersion || 'Dernier commit'}) ${repoMsg}.`);
        }
      }
    } catch (err) {
      console.warn('Erreur vérification maj:', err);
      updateIcon.style.animation = '';
      updateLabel.textContent = 'Mises à jour';
      if (!silent) alert('Impossible de vérifier les mises à jour pour le moment.');
    }
  }

  function openUpdateModal(updateInfo) {
    const modal = document.getElementById('update-modal');
    const title = document.getElementById('modal-update-title');
    const msg = document.getElementById('modal-update-msg');
    const changelog = document.getElementById('modal-changelog');

    const repoStatus = updateInfo.repo && updateInfo.repo.isMatching 
      ? `<span style="color: #10b981;">✓ Dépôt vérifié : ${updateInfo.repo.repoName}</span>` 
      : `<span style="color: #f59e0b;">⚠ Dépôt : ${updateInfo.repo?.url || 'inconnu'}</span>`;

    title.textContent = 'Mise à jour disponible (' + updateInfo.latestVersion + ')';
    msg.innerHTML = `
      <div style="margin-bottom: 8px;">${repoStatus} (branche: <code>${updateInfo.branch || 'main'}</code>)</div>
      <div>Votre version locale est <code>${updateInfo.currentVersion}</code>. Une version plus récente est prête à être installée.</div>
    `;
    changelog.textContent = updateInfo.changelog || 'Mise à jour des composants et améliorations diverses.';

    modal.classList.add('open');
  }

  function closeUpdateModal() {
    document.getElementById('update-modal').classList.remove('open');
  }

  async function triggerInstallUpdate() {
    const btn = document.getElementById('btn-confirm-install');
    const label = document.getElementById('btn-install-label');

    btn.disabled = true;
    label.textContent = 'Téléchargement & Installation...';

    try {
      const res = await window.desktopApi.installUpdate();
      if (res && res.success) {
        label.textContent = 'Redémarrage en cours...';
        setTimeout(() => {
          window.desktopApi.restartApp();
        }, 1000);
      } else {
        alert('Erreur lors de l\'installation : ' + (res.error || 'Erreur inconnue'));
        btn.disabled = false;
        label.textContent = 'Mettre à jour maintenant';
      }
    } catch (err) {
      alert('Erreur d\'installation : ' + err.message);
      btn.disabled = false;
      label.textContent = 'Mettre à jour maintenant';
    }
  }

  // Bindings DOM
  btnUpdate.onclick = () => checkUpdates(false);
  document.getElementById('btn-close-modal').onclick = closeUpdateModal;
  document.getElementById('btn-cancel-update').onclick = closeUpdateModal;
  document.getElementById('btn-confirm-install').onclick = triggerInstallUpdate;

  // Vérification silencieuse au démarrage
  setTimeout(() => {
    checkUpdates(true);
  }, 3000);

  return {
    checkUpdates
  };
}
