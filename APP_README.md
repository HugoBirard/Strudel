# ⚡ Strudel Studio (Application Desktop Dédiée)

Application Desktop professionnelle de live-coding musical basée sur le moteur sonore de **Strudel**, totalement épurée de tout code pré-fait, avec système d'enregistrement de snippets, personnalisation d'arrière-plan & thèmes, sécurité renforcée, et auto-update.

---

## 🚀 Démarrage Rapide

### Option A : Depuis votre Bureau ou Menu d'applications
Un raccourci **Strudel Studio** est installé :
- Sur votre **Bureau** (`~/Desktop/strudel-studio.desktop` ou `~/Bureau/strudel-studio.desktop`)
- Dans votre **Menu d'applications système** (`~/.local/share/applications/strudel-studio.desktop`)

### Option B : Depuis le Terminal
```bash
# 1. Se placer sur la branche update
git checkout update

# 2. Lancer l'application
npm start
```

---

## 🎛️ Nouveautés & Améliorations Récentes

### 1. 🎯 Correction de l'Insertion de Snippets (Inline sans saut de ligne)
- **Insertion chirurgicale** : L'insertion d'un snippet se fait désormais **exactement à l'emplacement du curseur**, sans aucun saut de ligne forcé avant ou après.
- Vous pouvez désormais insérer une méthode ou un effet (ex: `.lpf(1200)`) directement à la suite d'un pattern sans casser la ligne.
- Compatible avec le raccourci `Ctrl + Z` (Annulation / Rétablissement natif).

### 2. 🎨 Barre Système Modernisée & 6 Thèmes de Fond
- **Barre supérieure Glassmorphism** : Refonte visuelle avec flou d'arrière-plan (`backdrop-filter: blur`), liseré lumineux subtil et boutons aux contours soignés.
- **Sélecteur de Thèmes (Bouton "Thème")** :
  1. **Obsidian Dark** : Noir profond, accents vert émeraude et indigo.
  2. **Cyberpunk Night** : Néon cyan, rose fuchsia et violet électrique.
  3. **Tokyo Midnight** : Bleu nuit, violet profond et indigo.
  4. **Deep Space** : Bleu marine cosmique et touches cyan.
  5. **Matrix Emerald** : Vert phosphore terminal et noir sombre.
  6. **Retro Synthwave** : Coucher de soleil orange 80s et magenta fluo.
- Votre choix de thème est sauvegardé automatiquement en local.

### 3. 🛡️ Audit de Cybersécurité & Durcissement (Hardening)
- **Correction `webSecurity: true`** : Réactivation complète de la politique de sécurité Same-Origin d'Electron (auparavant désactivée).
- **Protection contre les Injections de Commandes Shell** : Remplacement de `exec` par `execFile` sans sous-shell avec tableau d'arguments isolés et validation stricte par expression régulière du nom de branche (`VALID_BRANCH_REGEX`).
- **Content Security Policy (CSP)** : Ajout d'une politique CSP stricte dans le document HTML restreignant les sources de scripts, de médias et de connexions réseau.
- **Protection Navigation & Liens Externes** : Blocage de toute redirection non autorisée (`will-navigate`) et ouverture sécurisée des liens Web dans le navigateur par défaut du système (`shell.openExternal`).
- **Validation des Entrées** : Contrôle et nettoyage des chemins et contenus de fichiers lors de la sauvegarde et du chargement.

---

## 💾 Système Personnel de Snippets
1. Écrivez votre code dans l'éditeur.
2. Sélectionnez une portion de code (ou placez simplement votre curseur sur la ligne).
3. Cliquez sur **"Sauvegarder la sélection"** (ou sur le bouton `+`).
4. Donnez un titre à votre snippet.
5. Cliquez sur **"Insérer au curseur"** sur n'importe quel snippet pour le réinjecter instantanément dans votre flux de travail.
