# ⚡ Strudel Studio (Application Desktop Dédiée)

Application Desktop professionnelle de live-coding musical basée sur le moteur sonore de **Strudel**, totalement épurée de tout code pré-fait, avec votre propre système d'enregistrement de snippets, icônes vectorielles SVG, raccourci de bureau et système de mise à jour intégré.

---

## 🚀 Démarrage Rapide

### Option A : Depuis votre Bureau ou Menu d'applications
Un raccourci **Strudel Studio** est installé :
- Sur votre **Bureau** (`~/Desktop/strudel-studio.desktop` ou `~/Bureau/strudel-studio.desktop`)
- Dans votre **Menu d'applications système** (`~/.local/share/applications/strudel-studio.desktop`)

### Option B : Depuis le Terminal
```bash
# 1. Se placer sur la branche app
git checkout app

# 2. Lancer l'application
npm start
```

---

## 🎛️ Fonctionnalités & Personnalisations

### 1. 📄 Espace de Travail 100% Vierge (Zéro Code Pré-fait)
- Aucun code ou pattern imposé au démarrage. L'éditeur s'ouvre sur une page blanche prête à accueillir vos créations.

### 2. 💾 Système Personnel d'Enregistrement de Snippets
- **Enregistrer une ligne ou un bloc** :
  1. Écrivez votre code dans l'éditeur.
  2. Sélectionnez la ligne ou le bloc de votre choix (ex: un beat, un synthé, un filtre).
  3. Cliquez sur **"Sauvegarder la sélection"** (ou sur le bouton `+` en haut à gauche).
  4. Donnez-lui un nom (ex: *Mon Kick 909*, *Basse Acid*, *Arpège Rhodes*).
- **Réutilisation instantanée** :
  - Vos snippets apparaissent dans le panneau latéral gauche.
  - Cliquez sur un snippet ou sur le bouton **"Insérer au curseur"** pour le réinjecter directement dans votre code.
  - Vos snippets sont sauvegardés localement de façon permanente et persistent entre les redémarrages.
  - Vous pouvez supprimer un snippet à tout moment avec l'icône de corbeille.

### 3. ✨ Interface Vectorielle Épurée (SVG)
- Tous les boutons utilisent des icônes vectorielles SVG propres et discrètes (Play, Stop, Nouveau, Ouvrir, Sauvegarder, Supprimer).

### 4. 🔄 Mises à Jour Automatiques en 1 Clic
- Bouton **Mises à jour** dans la barre supérieure connecté directement à GitHub (`origin/app`).
- Détection automatique et installation en un clic avec redémarrage transparent de l'application.

### 5. 🎛️ Macros en Direct & Visualiseur Audio Oscilloscope
- **Oscilloscope Canvas** temps réel branché sur la sortie Web Audio.
- **Sliders temps réel** : `macroLPF` (Cutoff), `macroLPQ` (Résonance), `macroRoom` (Reverb) et `masterVolume` modifiables en direct sans couper le son.
