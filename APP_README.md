# ⚡ Strudel Studio (Application Desktop Dédiée)

Application Desktop professionnelle de live-coding musical basée sur le moteur sonore de **Strudel**, épurée de toute interface tierce, avec design moderne aux icônes vectorielles SVG, raccourci de bureau et système de mise à jour intégré.

---

## 🚀 Démarrage Rapide

### Option A : Depuis le Terminal
```bash
# 1. Se placer sur la branche app
git checkout app

# 2. Lancer l'application
npm start
```

### Option B : Depuis votre Bureau ou Menu d'applications
Un raccourci **Strudel Studio** a été installé :
- Sur votre **Bureau** (`~/Desktop/strudel-studio.desktop` ou `~/Bureau/strudel-studio.desktop`)
- Dans votre **Menu d'applications système** (`~/.local/share/applications/strudel-studio.desktop`)

Pour réinstaller ou mettre à jour le raccourci :
```bash
npm run install-shortcut
```

---

## 🎨 Interface 100% Épurée & Sur-Mesure

1. **Design Moderne (Icônes Vectorielles SVG)** :
   - Tous les emojis ont été remplacés par des icônes SVG précises et minimalistes (Play, Stop, Fichiers, Outils, Mise à jour).
   - Les presets encombrants ont été retirés pour laisser place à un projet propre dès l'ouverture.

2. **Générateur & Explorateur d'Instruments (Panneau de Gauche)** :
   - **Snippets Rapides** : Insérez en un clic un Beat 909, Beat 808, Hi-Hats, Acid 303, Sub Bass, Rhodes ou Amen Break directement dans votre code au curseur.
   - **Explorateur de Sons** : Cliquez sur n'importe quelle boîte à rythmes (`RolandTR909`, `RolandTR808`, `AkaiLinn`...), Soundfont General MIDI (`gm_piano`, `gm_vibraphone`, `gm_strings`...) ou synthétiseur natif (`sawtooth`, `sine`, `crackle`) pour l'insérer instantanément.

3. **Système de Recherche et d'Installation de Mises à Jour** :
   - Un bouton **Mises à jour** dans la barre supérieure vérifie automatiquement la présence de nouvelles versions sur le dépôt GitHub distant.
   - Si une nouvelle version est disponible, une pastille lumineuse apparaît et une fenêtre présente les détails du changelog.
   - Un clic sur **"Installer et Redémarrer"** effectue la mise à jour et relance l'application automatiquement !

4. **Macros en Direct & Visualiseur Audio Oscilloscope (Panneau de Droite)** :
   - Oscilloscope temps réel connecté à la sortie Web Audio.
   - Sliders `macroLPF` (Cutoff), `macroLPQ` (Résonance), `macroRoom` (Reverb) et `masterVolume` modifiables à la souris en plein jeu sans interrompre la musique.
