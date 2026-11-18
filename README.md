# 🌊 Strudel Studio Desktop (Application Live-Coding Musical)

> **Strudel Studio** est une application Desktop dédiée à la création musicale algorithmique et au live-coding en temps réel. Elle embarque le moteur sonore natif de **Strudel** / **TidalCycles WebAudio**, enveloppé dans une interface studio sombre, sur-mesure, hautement réactive, sans aucun code imposé, avec éditeur CodeMirror 6, bus matériel WebAudio réel et visualisateur FFT 60 FPS.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/HugoBirard/Strudel)
[![Engine](https://img.shields.io/badge/engine-Strudel%20WebAudio-success.svg)](https://strudel.cc)
[![Editor](https://img.shields.io/badge/editor-CodeMirror%206-indigo.svg)](https://codemirror.net)
[![License](https://img.shields.io/badge/license-AGPL--3.0-orange.svg)](LICENSE)
[![Documentation PDF](https://img.shields.io/badge/doc-Manuel%20PDF%20(17%20pages)-red.svg)](docs/Strudel_Studio_Documentation.pdf)

---

## 📑 Sommaire
1. [Guide d'Installation](#-guide-dinstallation)
   - [Prérequis Système](#prérequis-système)
   - [Installation depuis Git](#installation-depuis-git)
   - [Installation du Raccourci Bureau](#installation-du-raccourci-bureau)
   - [Génération d'un Binaire Autonome (AppImage)](#génération-dun-binaire-autonome-appimage)
2. [Explication Complète de l'Interface Graphique](#-explication-complète-de-linterface-graphique)
   - [1. Barre de Titre Système CSD (Style ToDoList & 5 Thèmes)](#1-barre-de-titre-système-csd-style-todolist--5-thèmes)
   - [2. Barre de Transport & Système](#2-barre-de-transport--système)
   - [3. Panneau Gauche (Snippets & Tiroir Mobile)](#3-panneau-gauche-snippets--tiroir-mobile)
   - [4. Panneau Central (Éditeur CodeMirror 6 & Mode Split-Screen)](#4-panneau-central-éditeur-professionnel-codemirror-6--mode-split-screen)
   - [5. Panneau Droit (Visualisateur & Bus Matériel)](#5-panneau-droit-visualisateur--bus-matériel)
   - [6. Système de Mises à Jour Graphique Intégré](#6-système-de-mises-à-jour-graphique-intégré)
3. [Manuel PDF Complet à Télécharger](#-manuel-pdf-complet-à-télécharger)
4. [Tutoriel Débutant : Composer Pas-à-Pas](#-tutoriel-débutant--composer-un-morceau-étape-par-étape-avec-liens-découte)
5. [Toutes les Catégories d'Instruments & Banques Sonores](#-toutes-les-catégories-dinstruments--banques-sonores)
6. [La Mini-Notation (Rythmes & Patterns)](#-la-mini-notation-rythme-et-patterns)
7. [Effets Audio & Modulation](#-effets-audio--modulation)

---

## 🚀 Guide d'Installation

### Prérequis Système
- **Système d'exploitation :** Linux (Ubuntu, Debian, Fedora, Arch, etc.), Windows 10/11 ou macOS.
- **Node.js :** Version 18 ou supérieure recommandée (`node -v`).
- **Gestionnaire de paquets :** `npm` (inclus avec Node.js).
- **Système audio :** ALSA, PulseAudio ou PipeWire.

### Installation depuis Git
Clonez le dépôt officiel et installez les dépendances :
```bash
# 1. Cloner le projet
git clone git@github.com:HugoBirard/Strudel.git
cd Strudel

# 2. Installer les paquets npm
npm install

# 3. Lancer l'application en mode desktop
npm start
```

### Installation du Raccourci Bureau
Pour intégrer l'application à votre environnement de bureau (icône sur le bureau et dans votre menu d'applications système) :
```bash
npm run install-shortcut
# ou directement :
bash scripts/install-shortcut.sh
```
L'entrée de bureau est automatiquement configurée dans :
- Votre **Bureau** : `~/Desktop/strudel-studio.desktop` ou `~/Bureau/strudel-studio.desktop`
- Votre **Menu d'applications** : `~/.local/share/applications/strudel-studio.desktop`

### Génération d'un Binaire Autonome (AppImage)
Pour distribuer l'application ou l'exécuter sur une autre machine Linux sans avoir besoin d'installer Node.js :
```bash
npm run build:linux
```
L'exécutable autonome est produit dans le dossier `dist/` sous le nom `Strudel Studio-1.0.0.AppImage`.

---

## 🎛️ Explication Complète de l'Interface Graphique

L'interface de Strudel Studio a été conçue pour éliminer toute friction visuelle et maximiser la concentration lors de sessions de live-coding, que vous soyez sur grand écran ou en écran scindé côte-à-côte avec une autre fenêtre.

```
+-----------------------------------------------------------------------------------------+
| [LOGO] Strudel Studio  ● Prêt                      [Style Titre]   [—]  [口/❐]  [✕]    |
+-----------------------------------------------------------------------------------------+
| [▶ PLAY] [■ STOP]  [● ● ● ●]  BPM [ 128 ] [-] [+] [TAP]    [🎨 Thèmes] [📁 Fichiers] [🔄]|
+-----------------------+-----------------------------------------+-----------------------+
| MES SNIPPETS & LIGNES | ÉDITEUR CODEMIRROR 6                     | VISUALISEUR AUDIO     |
| [+] [Sauvegarder Sél] | [📋 Snippets] [🎛️ Effets] (Mode Compact) | (Oscilloscope + FFT)  |
|                       |                                         |                       |
| - Kick 808            |  setcps(128/60/4)                       | CONTRÔLES MASTER      |
| - Bass Acid 303       |  stack(                                 | Filtre Master (LPF)   |
| - Nappe Rhodes        |    s("bd [~ cp]").bank("RolandTR909"),  | Résonance (Q)         |
| - Ambient Arp         |    s("sawtooth").note("c2 eb2")         | Reverb (Room)         |
|                       |  )                                      | Volume Général (Gain) |
| [Insérer au curseur]  |                                         |                       |
+-----------------------+-----------------------------------------+-----------------------+
| ↖ ↑ ↗  Bordures et coins de redimensionnement 8 directions fluides               ↙ ↓ ↘  |
+-----------------------------------------------------------------------------------------+
```

### 1. Barre de Titre Système CSD (Style ToDoList & 5 Thèmes)
* **Design CSD Frameless :** Barre de titre personnalisée intégrée au corps de l'application, supprimant les lourdeurs de bordures blanches de l'OS tout en restant fluide et native.
* **Contrôles de Fenêtre Intégrés :**
  - **Réduire (`[—]`) :** Réduit l'application dans la barre des tâches système.
  - **Agrandir / Restaurer (`[口]` / `[❐]`) :** Permet de basculer instantanément entre le plein écran et la taille normale restaurée pour placer facilement une autre fenêtre à côté (navigateur, terminal, doc).
  - **Fermer (`[✕]`) :** Quitte l'application proprement.
  - **Double-clic rapide :** Double-cliquer sur la zone neutre de la barre bascule également entre l'état agrandi et restauré.
* **Redimensionnement 8 Directions :** 8 poignées invisibles actives (`n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`) permettent de redimensionner la fenêtre à la souris depuis n'importe quel bord ou coin sous tous les gestionnaires de fenêtres (GNOME Wayland/X11, KDE, Windows, tiling WMs).
* **5 Styles Visuels Personnalisables (menu Thèmes) :**
  1. `match-bg` *(Par défaut)* : Teinte monolithique parfaitement unie avec le thème sombre en cours.
  2. `glass` : Effet verre dépoli *Glassmorphism* avec transparence, lueur subtile et ombre portée.
  3. `neon` : Liseré supérieur cyberpunk illuminé avec halo indigo phosphorescent.
  4. `transparent` : Barre totalement transparente sans délimitation visuelle (style Spotify / Discord).
  5. `minimal` : Hauteur extra-plate ultra-discrète (28px) sans titre pour libérer un maximum d'espace de code.

### 2. Barre de Transport & Système
* **Bouton PLAY (`Ctrl + Entrée`) :** Évalue le code présent dans l'éditeur et démarre immédiatement la lecture. Réveille automatiquement l'`AudioContext` matériel si l'OS avait suspendu la lecture automatique.
* **Bouton STOP (`Ctrl + .`) :** Coupe instantanément tous les oscillateurs, patterns et cycles sonores.
* **Métronome Visuel 4 Temps (Zero-Drift) :** 4 diodes lumineuses indiquent les 4 temps de chaque cycle musical. Directement cadencé sur l'horloge interne de Strudel (`repl.scheduler.now()`), garantissant une précision absolue sans aucun décalage temporel.
* **Contrôleur de Tempo & TAP :** Réglage fin du tempo (BPM) par boutons `+` / `-`, saisie au clavier, ou en tapant manuellement la cadence sur le bouton **TAP**.
* **Sélecteur de Thèmes (Bouton "Thèmes") :** Choix parmi 6 ambiances sombres professionnelles sauvegardées localement (*Obsidian Dark*, *Cyberpunk Night*, *Tokyo Midnight*, *Deep Space*, *Matrix Emerald*, *Retro Synthwave*), avec prévisualisation et sélection directe du style de barre de titre.
* **Gestion des Fichiers :** Création d'un document vierge, ouverture d'un fichier existant (`.strudel` / `.js`) et sauvegarde rapide (`Ctrl + S`).

### 3. Panneau Gauche (Snippets & Tiroir Mobile)
* **Préréglages Immédiats & Personnalisation :** Fourni avec des patrons sonores prêts à jouer (Kick 808/909, Bass Acid 303, Nappe Rhodes, Arpège d'ambiance) tout en vous laissant enrichir votre bibliothèque personnelle.
* **Insertion Chirurgicale au Curseur :** Le code d'un snippet s'insère à la position précise du curseur dans l'éditeur sans retour à la ligne involontaire, idéal pour enchaîner des modificateurs (ex: `.lpf(800)`).
* **Sauvegarde de Sélection Rapide :** Surlignez n'importe quelle ligne dans l'éditeur et cliquez sur *« Sauvegarder la sélection »* pour l'enregistrer instantanément.
* **Tiroir Tactile / Compact :** Lorsque l'application est réduite en largeur (ex: écran partagé), ce panneau se replie élégamment et s'ouvre d'un clic via le bouton d'en-tête `[📋 Snippets]` sans écraser votre éditeur.

### 4. Panneau Central (Éditeur Professionnel CodeMirror 6 & Mode Split-Screen)
* **Mode Split-Screen & Écran Partagé (Largeur Mini 480px) :**
  - Conçu pour fonctionner côte-à-côte avec une autre fenêtre (documentation, navigateur web, synthétiseur externe, terminal).
  - En largeur compacte ($\le$ 920px), l'éditeur de code bénéficie de **100% de la surface utile verticale** avec défilement fluide (`.cm-scroller`). **Le code reste toujours parfaitement visible et accessible, sans être caché ou comprimé**.
  - Deux boutons d'accès rapide apparaissent directement au-dessus du code (`[📋 Snippets]` et `[🎛️ Effets & Visu]`) pour déployer les panneaux latéraux sous forme de tiroirs en surimpression.
* **Coloration Syntaxique Intégrale :** Coloration soignée des fonctions Strudel (`s`, `note`, `stack`, `cpm`), des notes, accords, métriques temporelles et symboles de la mini-notation.
* **Productivité & Ergonomie :** Numérotation des lignes, fermeture automatique des parenthèses/crochets/guillemets, gestion fluide de la tabulation, historique d'annulation/rétablissement (`Ctrl + Z` / `Ctrl + Y`).
* **Starter Prêt à l'Emploi :** Au premier lancement, l'application démarre avec un motif rythmique TR-909 et une ligne de basse acide préchargés pour entendre immédiatement le son dès le clic sur **PLAY**.

### 5. Panneau Droit (Visualisateur & Bus Matériel)
* **Visualisateur Audio Temps Réel 60 FPS :**
  - *Oscilloscope temporel :* Onde illuminée réactive traduisant fidèlement la vibration sonore (sinus, carré, bruit, impulsions).
  - *Spectre de fréquences FFT :* 28 bandes de fréquences réagissant dynamiquement au signal de sortie master.
* **Filtre Passe-Bas Master (Cutoff) :** Connecté physiquement à un vrai composant WebAudio `BiquadFilterNode` (200 Hz à 20 000 Hz).
* **Résonance Master (Q) :** Ajuste l'intensité de la pointe de résonance du filtre.
* **Reverb Master (macroRoom) :** Dosage spatial global de la réverbération.
* **Volume Général Master :** Ajustement direct du gain matériel avant la sortie vers vos haut-parleurs ou votre casque.

### 6. Système de Mises à Jour Graphique Intégré
Strudel Studio intègre un centre de mise à jour moderne, propre et silencieux, **sans aucune popup d'alerte intrusive (`alert()`)** :
* **Recherche Intelligente (`checking`) :** Animation discrète et vérification des derniers commits sur la branche principale du dépôt `HugoBirard/Strudel`.
* **État À Jour (`up-to-date`) :** Badge de confirmation visuelle avec numéro de révision et SHA du dernier commit actif.
* **Mise à Jour Détectée (`update-available`) :**
  - Affichage clair du nombre de commits d'écart.
  - **Changelog complet :** Liste détaillée des derniers commits et modifications apportées au projet.
  - Bouton interactif *« Mettre à jour maintenant »*.
* **Installation Automatique en Un Clic (`installing`) :**
  - Téléchargement des modifications via `git pull` et installation des dépendances éventuelles via `npm install`.
  - Jauge de progression animée et redémarrage automatique en fin d'installation.
* **Résilience Réseau (`error` / `offline`) :** Diagnostic explicatif sans jamais bloquer ou interrompre votre session musicale en cours.

---

## 📄 Manuel PDF Complet à Télécharger

Pour consulter le manuel complet hors-ligne, imprimer le guide ou approfondir toutes les possibilités de live-coding, un document PDF de 17 pages rédigé et compilé avec soin est disponible dans le projet :

👉 **[Consulter / Télécharger le Manuel Complet (PDF 17 pages)](docs/Strudel_Studio_Documentation.pdf)**

Ce fichier contient l'intégralité du catalogue des 128 instruments General MIDI, les boîtes à rythmes, les synthétiseurs Superdough, le dictionnaire complet de la mini-notation rythmique et les fonctions algorithmiques.

---

## 🎧 Tutoriel Débutant : Composer un Morceau Étape par Étape (avec Liens d'Écoute)

Pour un débutant, produire un morceau se fait couche par couche, de la pulsation corporelle jusqu'aux finesses mélodiques. Cliquez sur les liens **▶️ Écouter sur Strudel.cc** pour charger et entendre immédiatement chaque étape dans votre navigateur !

---

### Étape 1 : Le Tempo & le Kick (La pulsation cardiaque)
On commence toujours par fixer la vitesse (`setcps` en cycles par seconde) et poser le rythme de base (4 coups de grosse caisse réguliers).

```javascript
setcps(128/60/4)
s("bd*4")
```
👉 **[▶️ Écouter l'Étape 1 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0As(%22bd*4%22))**

---

### Étape 2 : Le Contretemps (Clap / Caisse Claire sur les temps 2 et 4)
On ajoute le clap `cp` sur les temps pairs pour donner le rebond et la signature rythmique, ici avec la boîte à rythmes `RolandTR909`.

```javascript
setcps(128/60/4)
s("bd [~ cp] bd [~ cp]").bank("RolandTR909")
```
👉 **[▶️ Écouter l'Étape 2 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0As(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22))**

---

### Étape 3 : Le Groove des Charleston (Hi-Hats en doubles-croches)
Pour que la batterie prenne vie et avance, on superpose (`stack`) des charlestons fermés `hh` et un charleston ouvert `oh` sur le contretemps.

```javascript
setcps(128/60/4)

stack(
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  s("hh*8 [oh hh]").gain(0.8)
)
```
👉 **[▶️ Écouter l'Étape 3 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.8)%0A))**

---

### Étape 4 : La Ligne de Basse (L'Énergie & la Note Fondamentale)
La basse connecte la batterie à l'harmonie. On utilise une onde en dents de scie (`sawtooth`) sculptée avec un filtre passe-bas (`lpf`) et de la résonance (`lpq`).

```javascript
setcps(128/60/4)

stack(
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  s("hh*8 [oh hh]").gain(0.8),
  note("c2 [~ c2] eb2 [~ f2] g2 [~ bb1] c2 ~")
    .s("sawtooth")
    .lpf(900)
    .lpq(4)
    .decay(0.18)
)
```
👉 **[▶️ Écouter l'Étape 4 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.8)%2C%0A%20%20note(%22c2%20%5B~%20c2%5D%20eb2%20%5B~%20f2%5D%20g2%20%5B~%20bb1%5D%20c2%20~%22).s(%22sawtooth%22).lpf(900).lpq(4).decay(0.18)%0A))**

---

### Étape 5 : L'Harmonie (Les Accords avec un Piano Rhodes)
On habille le groove avec une progression d'accords mineurs planante (`Cm7`, `Fm7`, `Gm7`, `Bb`). On utilise le piano électrique `gm_electric_piano_1` avec de la réverbération (`room`).

```javascript
setcps(128/60/4)

stack(
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  s("hh*8 [oh hh]").gain(0.8),
  note("c2 [~ c2] eb2 [~ f2] g2 [~ bb1] c2 ~")
    .s("sawtooth")
    .lpf(900)
    .lpq(4)
    .decay(0.18),
  chord("<Cm7 Fm7 Gm7 Bb>")
    .s("gm_electric_piano_1")
    .room(0.5)
    .gain(0.65)
)
```
👉 **[▶️ Écouter l'Étape 5 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.8)%2C%0A%20%20note(%22c2%20%5B~%20c2%5D%20eb2%20%5B~%20f2%5D%20g2%20%5B~%20bb1%5D%20c2%20~%22).s(%22sawtooth%22).lpf(900).lpq(4).decay(0.18)%2C%0A%20%20chord(%22%3CCm7%20Fm7%20Gm7%20Bb%3E%22).s(%22gm_electric_piano_1%22).room(0.5).gain(0.65)%0A))**

---

### Étape 6 : L'Arpège ou Lead Mélodique (La touche finale entraînante)
Pour finir, on superpose un arpège rapide en onde triangulaire (`triangle`) avec de l'écho (`delay`) qui survole le morceau.

```javascript
setcps(128/60/4)

stack(
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  s("hh*8 [oh hh]").gain(0.8),
  note("c2 [~ c2] eb2 [~ f2] g2 [~ bb1] c2 ~")
    .s("sawtooth")
    .lpf(900)
    .lpq(4)
    .decay(0.18),
  chord("<Cm7 Fm7 Gm7 Bb>")
    .s("gm_electric_piano_1")
    .room(0.5)
    .gain(0.65),
  note("c4 eb4 g4 bb4 c5 bb4 g4 eb4")
    .fast(2)
    .s("triangle")
    .decay(0.12)
    .sustain(0.02)
    .delay(0.35)
    .gain(0.7)
)
```
👉 **[▶️ Écouter le Morceau Complet Terminé sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.8)%2C%0A%20%20note(%22c2%20%5B~%20c2%5D%20eb2%20%5B~%20f2%5D%20g2%20%5B~%20bb1%5D%20c2%20~%22).s(%22sawtooth%22).lpf(900).lpq(4).decay(0.18)%2C%0A%20%20chord(%22%3CCm7%20Fm7%20Gm7%20Bb%3E%22).s(%22gm_electric_piano_1%22).room(0.5).gain(0.65)%2C%0A%20%20note(%22c4%20eb4%20g4%20bb4%20c5%20bb4%20g4%20eb4%22).fast(2).s(%22triangle%22).decay(0.12).sustain(0.02).delay(0.35).gain(0.7)%0A))**

---

## 🎹 Toutes les Catégories d'Instruments & Banques Sonores

### 1. Synthétiseurs WebAudio Internes (Superdough)
Ces synthétiseurs sont générés en direct par l'AudioContext sans aucun téléchargement réseau nécessaire :
* `s("sawtooth")` : Onde en dent de scie brillante (basses puissantes, leads).
* `s("square")` : Onde carrée creuse (sons rétro 8-bit, chiptune).
* `s("triangle")` : Onde triangulaire douce (flûtes, mélodies épurées).
* `s("sine")` : Onde sinusoïdale pure (sub-basses, cloches).

### 2. Boîtes à Rythmes Classiques (`.bank(...)`)
Activez une boîte à rythmes légendaire en ajoutant `.bank("Nom")` :
* `RolandTR808` : La référence universelle Hip-hop, Trap et Electro.
* `RolandTR909` : La légende Techno et House music.
* `RolandTR707` : Percussions numériques 80s / Synthwave.
* `LinnDrum` : Boîte à rythmes pop vintage (Prince, Michael Jackson).
* `AkaiMPC60` : Grain chaud et percutant du hip-hop 90s.

---

## 🔤 La Mini-Notation (Rythme et Patterns)

| Symbole | Exemple | Effet |
| :--- | :--- | :--- |
| **Espace** | `c3 e3 g3` | Joue les notes successivement dans le cycle |
| **Crochets `[]`** | `[bd sd]` | Subdivise le temps pour loger plusieurs notes |
| **Tilde `~`** | `[~ sd]` | Silence (pause) |
| **Multiplication `*`** | `hh*4` | Répète la note 4 fois plus vite |
| **Division `/`** | `c3/2` | Ralentit la note sur 2 cycles |
| **Virgule `,`** | `[bd, hh*4]` | Joue simultanément (polyphonie) |
| **Chevrons `<>`** | `<c3 f3 g3>` | Alterne une note par cycle |
| **Point d'exclamation `!`**| `c3!3` | Répète la même note 3 fois |
| **Point d'interrogation `?`**| `hh?` | 50% de probabilité de jouer la note |
| **Euclidien `(k, n)`** | `bd(3, 8)` | Répartit 3 frappes sur 8 subdivisions |

---

## 🔊 Effets Audio & Modulation

* `.lpf(freq)` : Filtre Passe-Bas (Low-Pass Filter) en Hz.
* `.lpq(val)` : Résonance du filtre passe-bas.
* `.hpf(freq)` : Filtre Passe-Haut (High-Pass Filter).
* `.decay(sec)` : Temps d'extinction de la note.
* `.gain(val)` : Volume individuel de la piste (0 à 1.5).
* `.room(val)` : Quantité de réverbération.
* `.delay(val)` : Quantité d'écho.
* `.shape(val)` : Saturation et distorsion harmonique.

---

## 📜 Licence
Projet sous licence libre **AGPL-3.0**. Auteur : Hugo Birard.
