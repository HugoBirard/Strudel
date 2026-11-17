# 🌊 Strudel Studio Desktop (Application Live-Coding Musical)

> **Strudel Studio** est une application Desktop dédiée à la création musicale algorithmique et au live-coding en temps réel. Elle embarque le moteur sonore natif de **Strudel** / **TidalCycles WebAudio**, enveloppé dans une interface studio sombre, sur-mesure, hautement réactive, sans aucun code imposé, avec éditeur CodeMirror 6, bus matériel WebAudio réel et visualisateur FFT 60 FPS.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/HugoBirard/Strudel)
[![Engine](https://img.shields.io/badge/engine-Strudel%20WebAudio-success.svg)](https://strudel.cc)
[![Editor](https://img.shields.io/badge/editor-CodeMirror%206-indigo.svg)](https://codemirror.net)
[![License](https://img.shields.io/badge/license-AGPL--3.0-orange.svg)](LICENSE)
[![Documentation PDF](https://img.shields.io/badge/doc-Manuel%20PDF%20(16%20pages)-red.svg)](docs/Strudel_Studio_Documentation.pdf)

---

## 📑 Sommaire
1. [Guide d'Installation](#-guide-dinstallation)
   - [Prérequis Système](#prérequis-système)
   - [Installation depuis Git](#installation-depuis-git)
   - [Installation du Raccourci Bureau](#installation-du-raccourci-bureau)
   - [Génération d'un Binaire Autonome (AppImage)](#génération-dun-binaire-autonome-appimage)
2. [Explication Complète de l'Interface Graphique](#-explication-complète-de-linterface-graphique)
   - [1. Barre Supérieure (Transport \& Système)](#1-barre-supérieure-transport--système)
   - [2. Panneau Gauche (Snippets Personnels)](#2-panneau-gauche-snippets-personnels)
   - [3. Panneau Central (Éditeur Professionnel CodeMirror 6)](#3-panneau-central-éditeur-professionnel-codemirror-6)
   - [4. Panneau Droit (Visualisateur \& Bus Matériel)](#4-panneau-droit-visualisateur--bus-matériel)
3. [Manuel PDF Complet à Télécharger](#-manuel-pdf-complet-à-télécharger)
4. [Tutoriel Débutant : Composer Pas-à-Pas](#-tutoriel-débutant--composer-un-morceau-étape-par-étape-avec-liens-découte)
5. [Toutes les Catégories d'Instruments \& Banques Sonores](#-toutes-les-catégories-dinstruments--banques-sonores)
6. [La Mini-Notation (Rythmes \& Patterns)](#-la-mini-notation-rythme-et-patterns)
7. [Effets Audio \& Modulation](#-effets-audio--modulation)

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

L'interface de Strudel Studio a été conçue pour éliminer toute friction visuelle et maximiser la concentration lors de sessions de live-coding.

```
+-----------------------------------------------------------------------------------------+
| [LOGO] STRUDEL STUDIO   [PLAY] [STOP]  [● ● ● ●]  BPM [128] [TAP]   [THEME] [FICHIER] [MAJ]|
+-----------------------+-----------------------------------------+-----------------------+
| MES SNIPPETS & LIGNES | ÉDITEUR CODEMIRROR 6                     | VISUALISEUR AUDIO     |
| [+] [Sauvegarder Sél] | (Coloration syntaxique, auto-close,     | (Oscilloscope + FFT)  |
|                       |  line numbers, Ctrl+Entrée pour évaluer)|                       |
| - Kick 808            |                                         | CONTRÔLES MASTER      |
| - Bass Acid           |  s("sawtooth")                          | Filtre Master (LPF)   |
| - Nappe Rhodes        |    .note("<c2 [c2 eb2] g2 bb1>")        | Résonance (Q)         |
|                       |    .lpf(1200)                           | Reverb (Room)         |
| [Insérer au curseur]  |                                         | Volume Général (Gain) |
+-----------------------+-----------------------------------------+-----------------------+
|  ● Prêt (Arrêté)      | mon_morceau.strudel                     | WebAudio Master Bus   |
+-----------------------------------------------------------------------------------------+
```

### 1. Barre Supérieure (Transport & Système)
* **Bouton PLAY (`Ctrl + Entrée`) :** Évalue le code présent dans l'éditeur et démarre la lecture immédiate du pattern. Gère automatiquement le réveil de l'`AudioContext` en cas de suspension d'autoplay par le système.
* **Bouton STOP (`Ctrl + .`) :** Arrête instantanément tous les flux sonores et coupe l'ensemble des oscillateurs.
* **Métronome Visuel 4 Temps (Zero-Drift) :** 4 diodes lumineuses indiquent en direct les 4 pulsations du cycle musical. Directement synchronisé sur l'horloge interne de Strudel (`repl.scheduler.now()`), garantissant une absence totale de décalage dans le temps.
* **Contrôleur de Tempo & TAP :** Réglage fin du tempo en battements par minute (BPM) avec les boutons `+` / `-`, saisie numérique directe, ou en tapant le tempo avec le bouton **TAP**.
* **Sélecteur de Thèmes (Bouton "Thèmes") :** Permet de choisir parmi 6 ambiances sombres personnalisées sauvegardées automatiquement en local :
  1. *Obsidian Dark* : Noir profond avec accents vert émeraude et indigo.
  2. *Cyberpunk Night* : Cyan néon, rose fuchsia et violet électrique.
  3. *Tokyo Midnight* : Bleu nuit et reflets néons japonais.
  4. *Deep Space* : Bleu cosmique et touches stellaires.
  5. *Matrix Emerald* : Noir terminal et vert phosphoreux.
  6. *Retro Synthwave* : Dégradé coucher de soleil 80s orange et magenta.
* **Gestion des Fichiers :** Boutons natifs pour créer un nouveau document vide, ouvrir un fichier `.strudel` / `.js`, ou sauvegarder votre session en local (`Ctrl + S`).
* **Mises à Jour :** Dialogue de mise à jour sécurisé connecté directement au dépôt GitHub officiel `HugoBirard/Strudel` avec vérification des versions et installation en un clic.

### 2. Panneau Gauche (Snippets Personnels)
* **Zéro pré-réglage imposé :** Vous commencez d'une page vierge et constituez votre propre bibliothèque de snippets.
* **Insertion chirurgicale au curseur :** Le code d'un snippet s'insère exactement à la position du curseur dans l'éditeur, sans ajouter de saut de ligne forcé. Vous pouvez insérer une méthode (ex: `.lpf(800)`) directement à la suite d'un pattern.
* **Bouton "Sauvegarder la sélection" :** Sélectionnez n'importe quel bloc de texte à la souris dans l'éditeur et cliquez sur le bouton pour enregistrer la ligne en un instant.

### 3. Panneau Central (Éditeur Professionnel CodeMirror 6)
* **Coloration syntaxique intégrale :** Met en valeur les fonctions Strudel (`s`, `note`, `stack`, `cpm`), les notes musicales, les accords, les chiffres, les chaînes et les opérateurs de la mini-notation TidalCycles.
* **Fonctions de productivité :** Numérotation des lignes, auto-fermeture des parenthèses/crochets/guillemets, gestion fluide de l'indentation avec Tab, et pile d'annulation/rétablissement native (`Ctrl + Z` / `Ctrl + Y`).
* **Barre d'état dynamique :** Affiche le statut du moteur audio (Lecture, Arrêté, Erreur de syntaxe détaillée).

### 4. Panneau Droit (Visualisateur & Bus Matériel)
* **Visualisateur Audio Temps Réel 60 FPS :**
  - *Oscilloscope temporel :* Tracé en surbrillance reproduisant la forme d'onde physique générée.
  - *Spectre de fréquences FFT :* 28 bandes de fréquences réagissant dynamiquement au signal audio.
* **Curseur Master Cutoff (Filtre Passe-Bas) :** Connecté physiquement à un `BiquadFilterNode` filtrant l'ensemble du flux sonore en direct (200 Hz à 20000 Hz).
* **Curseur Résonance (Q) :** Ajuste le pic de résonance du filtre master.
* **Curseur Reverb (macroRoom) :** Variable globale d'espace acoustique et de réverbération.
* **Curseur Volume Général :** Contrôle un vrai `GainNode` matériel sur le bus master avant les enceintes.

---

## 📄 Manuel PDF Complet à Télécharger

Pour consulter le manuel complet hors-ligne, imprimer le guide ou approfondir toutes les possibilités de live-coding, un document PDF de 16 pages rédigé et compilé avec soin est disponible dans le projet :

👉 **[Consulter / Télécharger le Manuel Complet (PDF 16 pages)](docs/Strudel_Studio_Documentation.pdf)**

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
