# ⚡ Strudel Studio (Application Desktop Dédiée)

Application Desktop professionnelle de live-coding musical basée sur le moteur sonore de **Strudel**, totalement épurée de tout code pré-fait, avec éditeur CodeMirror 6, bus audio matériel WebAudio (Filtre Master & Master Gain réels), visualisateur FFT, synchronisation sans dérive, 6 thèmes visuels et système de snippets.

---

## 🚀 Démarrage Rapide

### Option A : Depuis votre Bureau ou Menu d'applications
Un raccourci **Strudel Studio** est installé :
- Sur votre **Bureau** (`~/Desktop/strudel-studio.desktop` ou `~/Bureau/strudel-studio.desktop`)
- Dans votre **Menu d'applications système** (`~/.local/share/applications/strudel-studio.desktop`)

### Option B : Depuis le Terminal
```bash
# 1. Se placer sur la branche
git checkout improvements

# 2. Lancer l'application
npm start
```

### Option C : Compiler un package autonome (AppImage Linux)
```bash
npm run build:linux
```

---

## 🎛️ Nouveautés & Architecture Professionnelle (v2)

### 1. 🎚️ Vrai Bus Audio Matériel (Master Gain & Filtre LPF Réels)
- **Fin des contrôles "placebo"** : Le curseur de **Volume Général** contrôle désormais un véritable `GainNode` matériel WebAudio inséré directement avant la sortie enceintes.
- **Filtre Passe-Bas Master en direct** : Le curseur **macroLPF** et **macroLPQ** agit sur un `BiquadFilterNode` appliqué en temps réel sur l'ensemble du flux sonore (synthés et samples).
- **Raccordement propre sans monkeypatching** : Raccordement natif du contrôleur Superdough et de l'analyseur FFT dans le graphe WebAudio (`Strudel -> Master Filter -> Master Gain -> Analyser -> Speakers`).

### 2. 📝 Éditeur Professionnel CodeMirror 6
- **Coloration syntaxique complète** : Prise en charge native du langage Strudel, des méthodes Tidal, des chiffres, des chaînes et de la mini-notation.
- **Auto-fermeture des parenthèses et guillemets**, numérotation des lignes, indentation automatique avec tabulation.
- **Historique Undo / Redo infaillible** (`Ctrl+Z` / `Ctrl+Y`).
- **Insertion chirurgicale de snippets** : Insertion exacte au curseur sans saut de ligne forcé.

### 3. ⏱️ Métronome Visuel à Dérive Zéro (Zero Drift)
- Remplacement des anciens `setInterval()` imprécis par une synchronisation directe sur l'horloge haute précision de Strudel (`repl.scheduler.now()`) et l'horloge WebAudio (`audioContext.currentTime`).
- Les 4 diodes restent parfaitement calées sur le rythme sonore, même après plusieurs heures de jeu continu.

### 4. 🧩 Architecture Découplée et Modulaire
Le code a été entièrement refactorisé en modules ES6 indépendants :
- `src/audio/audio-engine.js` : Graphe WebAudio, initialisation non-bloquante du REPL et transport.
- `src/ui/editor.js` : Composant d'édition CodeMirror 6 et manipulation du document.
- `src/ui/visualizer.js` : Rendu Canvas 60 FPS (Oscilloscope + Spectre FFT).
- `src/ui/metronome.js` : Logique de pulsation synchrone sur l'horloge audio.
- `src/ui/snippets.js` : Gestion et persistance localStorage des snippets.
- `src/ui/theme.js` : Sélecteur et persistance des 6 thèmes visuels.
- `src/ui/updater.js` : Interface de vérification et d'installation des mises à jour.
- `src/renderer.js` : Coordinateur principal ultra-léger.

### 5. 🎨 6 Thèmes de Fond Personnalisables
1. **Obsidian Dark** : Noir profond, accents vert émeraude et indigo.
2. **Cyberpunk Night** : Néon cyan, rose fuchsia et violet électrique.
3. **Tokyo Midnight** : Bleu nuit, violet profond et indigo.
4. **Deep Space** : Bleu marine cosmique et touches cyan.
5. **Matrix Emerald** : Vert phosphore terminal et noir sombre.
6. **Retro Synthwave** : Coucher de soleil orange 80s et magenta fluo.
