# 🌊 Le Guide Ultime de Strudel (Live Coding Audio en JavaScript)

> **Strudel** est un environnement de live coding musical basé sur JavaScript et le Web Audio API, portant la syntaxe et la philosophie de **TidalCycles** directement dans le navigateur (accessible sur [strudel.cc](https://strudel.cc)).

---

## 📑 Sommaire
1. [Tutoriel Débutant : Composer un Morceau Étape par Étape (avec Liens d'Écoute)](#-tutoriel-débutant--composer-un-morceau-étape-par-étape-avec-liens-découte)
2. [Introduction & Principes de base](#1-introduction--principes-de-base)
3. [Toutes les Catégories d'Instruments & Banques Sonores](#2-toutes-les-catégories-dinstruments--banques-sonores)
   - [A. Synthétiseurs WebAudio internes (Superdough)](#a-synthétiseurs-webaudio-internes-superdough)
   - [B. Les Soundfonts General MIDI (`gm_*`) — 128 Instruments](#b-les-soundfonts-general-midi-gm_--128-instruments)
   - [C. Boîtes à rythmes classiques (`.bank(...)`)](#c-boîtes-à-rythmes-classiques-bank)
   - [D. Samples Dirt / TidalCycles intégrés](#d-samples-dirt--tidalcycles-intégrés)
   - [E. Orchestre & Instruments VCSL](#e-orchestre--instruments-vcsl)
   - [F. Générateur d'effets Chiptune (ZZFX)](#f-générateur-deffets-chiptune-zzfx)
   - [G. Charger ses propres Samples (GitHub / URLs externes)](#g-charger-ses-propres-samples-github--urls-externes)
   - [H. Contrôle MIDI externe (Web MIDI)](#h-contrôle-midi-externe-web-midi)
4. [La Mini-Notation (Rythme et Patterns)](#3-la-mini-notation-rythme-et-patterns)
5. [Harmonie, Notes et Accords](#4-harmonie-notes-et-accords)
6. [Effets Audio & Modulation](#5-effets-audio--modulation)
7. [Fonctions de Transformation Algorithmique](#6-fonctions-de-transformation-algorithmique)
8. [Exemples Complets Prêts à Jouer](#7-exemples-complets--prêts-à-jouer)

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
    .lpf(850).lpq(6).decay(0.3).sustain(0.1)
)
```
👉 **[▶️ Écouter l'Étape 4 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.8)%2C%0A%20%20note(%22c2%20%5B~%20c2%5D%20eb2%20%5B~%20f2%5D%20g2%20%5B~%20bb1%5D%20c2%20~%22)%0A%20%20%20%20.s(%22sawtooth%22)%0A%20%20%20%20.lpf(850).lpq(6).decay(0.3).sustain(0.1)%0A))**

---

### Étape 5 : L'Harmonie (Progression d'Accords & Émotion)
On habille le morceau avec une grille d'accords jouée sur un piano électrique vintage Rhodes (`gm_electric_piano_1`) avec de la réverbération (`room`).
Grille : Do mineur 7 -> Lab majeur 7 -> Mib majeur 7 -> Sib 7.

```javascript
setcps(128/60/4)

note("<[c3'm7] [ab2'maj7] [eb3'maj7] [bb2'dom7]>")
  .s("gm_electric_piano_1")
  .slow(2)
  .room(0.6)
  .lpf(1600)
```
👉 **[▶️ Écouter l'Étape 5 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Anote(%22%3C%5Bc3%27m7%5D%20%5Bab2%27maj7%5D%20%5Beb3%27maj7%5D%20%5Bbb2%27dom7%5D%3E%22)%0A%20%20.s(%22gm_electric_piano_1%22)%0A%20%20.slow(2)%0A%20%20.room(0.6)%0A%20%20.lpf(1600))**

---

### Étape 6 : La Mélodie & l'Arpège (Le Thème Céleste)
On crée une mélodie accrocheuse en brisant les accords en arpège (`.arp("updown")`) sur un vibraphone (`gm_vibraphone`) avec du delay.

```javascript
setcps(128/60/4)

note("<c4'm7 ab3'maj7 eb4'maj7 bb3'dom7>")
  .arp("updown")
  .s("gm_vibraphone")
  .delay(0.4)
  .delaytime(0.25)
  .gain(0.8)
```
👉 **[▶️ Écouter l'Étape 6 sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Anote(%22%3Cc4%27m7%20ab3%27maj7%20eb4%27maj7%20bb3%27dom7%3E%22)%0A%20%20.arp(%22updown%22)%0A%20%20.s(%22gm_vibraphone%22)%0A%20%20.delay(0.4)%0A%20%20.delaytime(0.25)%0A%20%20.gain(0.8))**

---

### Étape 7 : Le Morceau Complet Assemblé
On rassemble l'ensemble des éléments dans un seul bloc `stack(...)` : le beat, la basse, les accords et l'arpège jouent en symbiose parfaite.

```javascript
setcps(128/60/4)

stack(
  // 1 & 2. Batterie Kick + Clap 909
  s("bd [~ cp] bd [~ cp]").bank("RolandTR909"),
  
  // 3. Hi-Hats groove
  s("hh*8 [oh hh]").gain(0.75),
  
  // 4. Ligne de basse filtrée
  note("c2 [~ c2] eb2 [~ f2] g2 [~ bb1] c2 ~")
    .s("sawtooth")
    .lpf(850).lpq(6).decay(0.3).sustain(0.1),
    
  // 5. Progression d'accords Rhodes
  note("<[c3'm7] [ab2'maj7] [eb3'maj7] [bb2'dom7]>")
    .s("gm_electric_piano_1")
    .slow(2).room(0.6).lpf(1600).gain(0.8),
    
  // 6. Arpège mélodique au Vibraphone
  note("<c4'm7 ab3'maj7 eb4'maj7 bb3'dom7>")
    .arp("updown")
    .s("gm_vibraphone")
    .delay(0.4).delaytime(0.25).gain(0.7)
)
```
👉 **[▶️ Écouter le Morceau Complet sur Strudel.cc](https://strudel.cc/#setcps(128%2F60%2F4)%0Astack(%0A%20%20s(%22bd%20%5B~%20cp%5D%20bd%20%5B~%20cp%5D%22).bank(%22RolandTR909%22)%2C%0A%20%20s(%22hh*8%20%5Boh%20hh%5D%22).gain(0.75)%2C%0A%20%20note(%22c2%20%5B~%20c2%5D%20eb2%20%5B~%20f2%5D%20g2%20%5B~%20bb1%5D%20c2%20~%22)%0A%20%20%20%20.s(%22sawtooth%22)%0A%20%20%20%20.lpf(850).lpq(6).decay(0.3).sustain(0.1)%2C%0A%20%20note(%22%3C%5Bc3%27m7%5D%20%5Bab2%27maj7%5D%20%5Beb3%27maj7%5D%20%5Bbb2%27dom7%5D%3E%22)%0A%20%20%20%20.s(%22gm_electric_piano_1%22)%0A%20%20%20%20.slow(2).room(0.6).lpf(1600).gain(0.8)%2C%0A%20%20note(%22%3Cc4%27m7%20ab3%27maj7%20eb4%27maj7%20bb3%27dom7%3E%22)%0A%20%20%20%20.arp(%22updown%22)%0A%20%20%20%20.s(%22gm_vibraphone%22)%0A%20%20%20%20.delay(0.4).delaytime(0.25).gain(0.7)%0A))**

---

---

## 1. Introduction & Principes de base

Dans Strudel, le temps est structuré en **cycles** continus (par défaut 1 cycle = ~2 secondes, ajustable via `cpm` ou `bpm` / `setcps`).
Une ligne de code génère un pattern infini :

```javascript
// Raccourci de base : s() pour sound, note() pour la hauteur
s("bd sd")

// Régler le tempo (ex: 120 BPM avec 4 temps par cycle)
setcps(120 / 60 / 4)
```

Chaque événement est une tuile sonore ordonnée dans le cycle. Plusieurs motifs peuvent être superposés avec la fonction `stack(...)` :

```javascript
stack(
  s("bd [~ bd] sd [~ bd]"),
  s("hh*8").gain(0.8),
  note("c3 eb3 g3 bb3").s("sawtooth").lpf(1200)
)
```

---

## 2. Toutes les Catégories d'Instruments & Banques Sonores

Strudel propose 8 manières distinctes de produire du son.

---

### A. Synthétiseurs WebAudio internes (Superdough)

Le moteur **Superdough** génère des ondes synthétisées en temps réel sans échantillonnage lourd.

#### Formes d'ondes fondamentales (`.s(...)`) :
- `"sawtooth"` (ou `"saw"`) : Riche en harmoniques, idéal pour les leads tranchants, basses acid, synthwave.
- `"square"` : Son creux, typique 8-bit / chiptune, orgues ou basses rondes.
- `"triangle"` (ou `"tri"`) : Synthé doux par défaut si aucun instrument n'est spécifié.
- `"sine"` : Onde pure, idéale pour sub-basses 808, flûtes épurées ou sons de sinus purs.

#### Générateurs de bruit :
- `"white"` : Bruit blanc dur et brillant (hi-hats, snares synthétiques, sweepers).
- `"pink"` : Bruit rose équilibré (effet vinyle, textures chaudes).
- `"brown"` : Bruit brun très sourd et lourd (grondements, vagues, séismes).
- `"crackle"` : Crépitements organiques de surface (lo-fi, pluie).

#### Synthèse FM & Additive :
Superdough permet d'ajouter de la modulation de fréquence (FM) ou des harmoniques partielles sur n'importe quelle onde :

```javascript
// Synthèse FM métallique / Cloche
note("c3 eb3 g3 c4")
  .s("sine")
  .fm(4)         // Indice de modulation
  .fmh(2.5)      // Ratio harmonique du modulateur
  .decay(0.8)
  .sustain(0)

// Synthèse Additive avec partielles
note("c2 g2")
  .s("sine")
  .partials([1, 0.5, 0.25, 0.125]) // Intensité des harmoniques 1x, 2x, 3x, 4x
```

---

### B. Les Soundfonts General MIDI (`gm_*`) — 128 Instruments

Strudel intègre l'ensemble de la spécification **General MIDI** (128 instruments échantillonnés haute qualité). Il suffit d'appeler leur identifiant dans `.s("gm_<nom>")` avec des notes.

#### 1. Pianos & Claviers
- `gm_acoustic_grand_piano` (ou `gm_piano`)
- `gm_bright_acoustic_piano`
- `gm_electric_grand_piano`
- `gm_honkytonk_piano`
- `gm_electric_piano_1` (ou `gm_epiano1` style Rhodes/DX7)
- `gm_electric_piano_2` (ou `gm_epiano2` style Wurlitzer/FM)
- `gm_harpsichord` (Clavecin)
- `gm_clavinet` (Clavinet funk)

#### 2. Percussions Mélodiques
- `gm_celesta`
- `gm_glockenspiel`
- `gm_music_box` (Boîte à musique)
- `gm_vibraphone`
- `gm_marimba`
- `gm_xylophone`
- `gm_tubular_bells`
- `gm_dulcimer` (Tympanon / Dulcimer)

#### 3. Orgues & Accordéons
- `gm_drawbar_organ` (Orgue Hammond)
- `gm_percussive_organ`
- `gm_rock_organ`
- `gm_church_organ` (Orgue d'église liturgique)
- `gm_reed_organ` (Harmonium)
- `gm_accordion`
- `gm_harmonica`
- `gm_tango_accordion` (Bandoneón)

#### 4. Guitares
- `gm_acoustic_guitar_nylon`
- `gm_acoustic_guitar_steel`
- `gm_electric_guitar_jazz`
- `gm_electric_guitar_clean`
- `gm_electric_guitar_muted`
- `gm_overdriven_guitar`
- `gm_distortion_guitar`
- `gm_guitar_harmonics`

#### 5. Basses
- `gm_acoustic_bass` (Contrebasse jazz)
- `gm_electric_bass_finger`
- `gm_electric_bass_pick`
- `gm_fretless_bass`
- `gm_slap_bass_1`
- `gm_slap_bass_2`
- `gm_synth_bass_1`
- `gm_synth_bass_2`

#### 6. Cordes & Orchestre Solo
- `gm_violin`
- `gm_viola`
- `gm_cello` (Violoncelle)
- `gm_contrabass`
- `gm_tremolo_strings`
- `gm_pizzicato_strings`
- `gm_orchestral_harp` (Harpe)
- `gm_timpani` (Timbales)

#### 7. Ensembles & Voix
- `gm_string_ensemble_1` (Cordes symphoniques)
- `gm_string_ensemble_2`
- `gm_synth_strings_1`
- `gm_synth_strings_2`
- `gm_choir_aahs` (Chœur Aah)
- `gm_voice_oohs` (Chœur Ooh)
- `gm_synth_choir`
- `gm_orchestra_hit` (Hit d'orchestre typique 90s)

#### 8. Cuivres (Brass)
- `gm_trumpet`
- `gm_trombone`
- `gm_tuba`
- `gm_muted_trumpet`
- `gm_french_horn` (Cor d'harmonie)
- `gm_brass_section` (Section cuivres funk/pop)
- `gm_synth_brass_1`
- `gm_synth_brass_2`

#### 9. Bois & Anches (Reeds)
- `gm_soprano_sax`
- `gm_alto_sax`
- `gm_tenor_sax`
- `gm_baritone_sax`
- `gm_oboe` (Hautbois)
- `gm_english_horn` (Cor anglais)
- `gm_bassoon` (Basson)
- `gm_clarinet`

#### 10. Flûtes & Pipes
- `gm_piccolo`
- `gm_flute`
- `gm_recorder` (Flûte à bec)
- `gm_pan_flute` (Flûte de pan)
- `gm_blown_bottle`
- `gm_shakuhachi` (Flûte japonaise)
- `gm_whistle` (Sifflet)
- `gm_ocarina`

#### 11. Leads de Synthé
- `gm_lead_1_square`
- `gm_lead_2_sawtooth`
- `gm_lead_3_calliope`
- `gm_lead_4_chiff`
- `gm_lead_5_charang`
- `gm_lead_6_voice`
- `gm_lead_7_fifths`
- `gm_lead_8_bass__lead`

#### 12. Pads de Synthé (Nappes)
- `gm_pad_1_new_age`
- `gm_pad_2_warm`
- `gm_pad_3_polysynth`
- `gm_pad_4_choir`
- `gm_pad_5_bowed`
- `gm_pad_6_metallic`
- `gm_pad_7_halo`
- `gm_pad_8_sweep`

#### 13. Effets de Synthé (FX)
- `gm_fx_1_rain`
- `gm_fx_2_soundtrack`
- `gm_fx_3_crystal`
- `gm_fx_4_atmosphere`
- `gm_fx_5_brightness`
- `gm_fx_6_goblins`
- `gm_fx_7_echoes`
- `gm_fx_8_sci_fi`

#### 14. Instruments Traditionnels du Monde
- `gm_sitar` (Sitar indien)
- `gm_banjo`
- `gm_shamisen`
- `gm_koto`
- `gm_kalimba` (Mbira africaine)
- `gm_bagpipe` (Cornemuse)
- `gm_fiddle`
- `gm_shanai`

#### 15. Percussions Diverses & Bruitages
- `gm_tinkle_bell`, `gm_agogo`, `gm_steel_drums`, `gm_woodblock`, `gm_taiko_drum`, `gm_melodic_tom`, `gm_synth_drum`, `gm_reverse_cymbal`
- `gm_bird_tweet`, `gm_seashore`, `gm_telephone_ring`, `gm_helicopter`, `gm_applause`, `gm_gunshot`

```javascript
// Exemple d'arpège avec vibraphone et piano Rhodes
stack(
  note("c3'maj9 eb3'm9 ab3'maj7").s("gm_electric_piano_1").slow(2).room(0.5),
  note("g4 bb4 c5 eb5 f5").s("gm_vibraphone").fast(2).delay(0.4)
)
```

---

### C. Boîtes à rythmes classiques (`.bank(...)`)

Grâce à la bibliothèque `tidal-drum-machines`, vous pouvez basculer un rythme entier vers une boîte à rythmes légendaire en une ligne avec `.bank(...)`.

#### Les abréviations standards :
- `bd` : Bass Drum / Kick
- `sd` : Snare Drum
- `hh` : Closed Hi-Hat
- `oh` : Open Hi-Hat
- `cp` : Clap
- `rim` : Rimshot
- `cb` : Cowbell
- `cr` : Crash Cymbal
- `ride` : Ride Cymbal
- `ht`, `mt`, `lt` : High, Mid, Low Tom
- `conga`, `bongo`, `shaker`, `claves`

#### Banques disponibles :
- `"RolandTR808"` (Trap, Electro, Hip-hop)
- `"RolandTR909"` (Techno, House)
- `"RolandTR707"` (Chicago House, Synthpop)
- `"RolandTR606"` (Acid techno, Minimal)
- `"AkaiLinn"` / `"LinnDrum"` (Pop 80s, Prince, Michael Jackson)
- `"OberheimDMX"` (Oldschool Hip-Hop, New Order)
- `"BossDR220"`
- `"EmuSP1200"` (Boom-Bap 90s)
- `"KorgKPR77"`, `"YamahaRX5"`

```javascript
// Exemple de beat 808 vs 909 alterné un cycle sur deux
s("bd [~ bd] [sd,cp] [~ bd], hh*8 [oh hh]")
  .bank("<RolandTR808 RolandTR909>")
```

---

### D. Samples Dirt / TidalCycles intégrés

Strudel a accès aux centaines de banques de samples issues de SuperDirt. On peut accéder aux variations numériques d'un sample avec l'index `:num` ou `.n(...)`.

#### Kicks & Basses :
- `bd` (kicks acoustiques et électroniques de 0 à 23)
- `clubkick`, `bass`, `hardcore`, `gretsch`, `dr`, `dr55`, `808bd`

#### Caisses claires & Claps :
- `sd`, `sn`, `snare`, `rim`, `tok`
- `cp`, `clap`, `hand`

#### Charleston & Cymbales :
- `hh`, `hc`, `ho`, `oh`, `cr`, `ride`, `cc`

#### Percussions ethniques & métalliques :
- `tabla`, `tabla2`, `bongos`, `conga`, `cowbell`, `cb`, `can`, `clak`, `metal`, `industrial`, `glitch`, `tink`, `bottle`

#### Éléments mélodiques, voix et textures :
- `casio` (Sons du Casio VL-Tone)
- `juno` (Basses et accords Roland Juno-106)
- `moog` (Basses Minimoog)
- `arpy` (Sons d'arpèges synthétiques)
- `kurt` (Stabs vocaux et samples rétro)
- `future` (Basses et stabs futuristes)
- `sax`, `flute`, `sitar`, `birds`, `space`, `speech`
- `amencutup` (Découpes du fameux break Amen)

```javascript
// Sélection d'index par mini-notation
s("bd:0 bd:3 [sd:1 cp:2] bd:5")

// Séquencer l'index avec .n()
s("casio").n("0 1 2 3").scale("c:minor")
```

---

### E. Orchestre & Instruments VCSL

La bibliothèque **VCSL** (Versilian Community Sample Library) est accessible directement :
- `piano` (Piano de concert acoustique)
- `vcsl_violin_arco`, `vcsl_violin_pizz`
- `vcsl_cello_arco`, `vcsl_cello_pizz`
- `vcsl_flute`, `vcsl_trumpet`, `vcsl_french_horn`

```javascript
note("c3 e3 g3 b3").s("piano").room(0.8)
```

---

### F. Générateur d'effets Chiptune (ZZFX)

Pour les jeux vidéo rétro et bruitages arcade 8-bit, Strudel intègre **ZZFX** directement :
- Sons prédéfinis : `z_shoot`, `z_jump`, `z_explosion`, `z_powerup`, `z_hit`, `z_blip`, `z_laser`

```javascript
s("z_shoot [~ z_jump] z_blip [~ z_explosion]")
```

---

### G. Charger ses propres Samples (GitHub / URLs externes)

Vous pouvez charger n'importe quel fichier audio `.wav`, `.mp3` ou `.flac` directement dans le navigateur.

#### Méthode 1 : Dépôt GitHub complet avec `strudel.json`
```javascript
samples('github:tidalcycles/dirt-samples')
```

#### Méthode 2 : Dictionnaire d'URLs directes
```javascript
samples({
  myKick: 'https://raw.githubusercontent.com/tidalcycles/dirt-samples/master/bd/BT0A0A7.WAV',
  mySnare: 'https://raw.githubusercontent.com/tidalcycles/dirt-samples/master/sd/ST0T0S3.WAV',
  myVocal: 'https://mon-serveur.com/audio/vocal_hook.mp3'
});

s("myKick [~ myKick] mySnare myKick, myVocal/4")
```

---

### H. Contrôle MIDI externe (Web MIDI)

Strudel peut envoyer des notes et des signaux Control Change (CC) à vos synthétiseurs physiques ou logiciels (Ableton Live, FL Studio, Bitwig, VCV Rack, synthés USB) :

```javascript
// Envoyer des notes au canal MIDI 1
note("c3 eb3 g3 bb3")
  .midi("NomDeVotreInterfaceMIDI")
  .channel(1)

// Moduler un bouton CC (ex: CC 74 = Cutoff)
cc("74:64 74:127 74:32")
```

---

## 3. La Mini-Notation (Rythme et Patterns)

La mini-notation est le cœur expressif de Strudel hérité de TidalCycles.

| Syntaxe | Action | Exemple | Description |
| :--- | :--- | :--- | :--- |
| `"a b c d"` | **Séquence** | `s("bd sd hh cp")` | Joue 4 sons répartis équitablement dans le cycle. |
| `"[a b]"` | **Subdivision** | `s("bd [sd sd]")` | `sd` joue 2 fois plus vite dans sa sous-partie. |
| `"~"` | **Silence** | `s("bd ~ sd ~")` | Crée une pause / silence d'une division. |
| `"<a b c>"` | **Alternance** | `s("bd <sd cp hh>")` | Joue `sd` au cycle 1, `cp` au cycle 2, `hh` au cycle 3. |
| `"a, b"` | **Polyrythmie** | `s("bd*4, hh*8")` | Joue les deux couches simultanément dans le même cycle. |
| `"{a b c, d e}"`| **Polymétrie** | `s("{bd sd cp, hh hh hh hh hh}")` | Les patterns avancent à la même vitesse de pas et se déphasent. |
| `"a*3"` | **Multiplication**| `s("hh*16")` | Répète le son 16 fois dans son pas. |
| `"a/2"` | **Division** | `s("bd/2")` | Le son s'étale sur 2 cycles (joue 2 fois moins souvent). |
| `"a(3,8)"` | **Euclidien** | `s("bd(3,8)")` | Répartit 3 pulsations de manière optimale sur 8 pas (rythme tresillo). |
| `"a(5,16,1)"`| **Euclidien décalé** | `s("hh(5,16,1)")` | 5 pas sur 16 avec une rotation de 1 pas vers la droite. |
| `"a?0.8"` | **Dégradation** | `s("hh?0.7")` | Le son a 70% de chance d'être joué (aléatoire). |
| `"a\|b"` | **Choix aléatoire** | `s("bd [sd\|cp]")` | Choisit aléatoirement soit `sd`, soit `cp`. |
| `"a@2 b"` | **Élongation** | `s("bd@3 sd")` | Le `bd` prend 3 parts du temps et le `sd` 1 part (sur 4). |
| `"!3"` | **Répétition valeur**| `s("bd!3 sd")` | Raccourci pour `s("bd bd bd sd")`. |

---

## 4. Harmonie, Notes et Accords

### Formats de notes
- **Nom anglais + octave** : `"c3"`, `"eb4"` (mi bémol 4), `"f#2"` (fa dièse 2).
- **Numéros MIDI** : `60` (= Do central / C4), `62`, `64`.
- **Degrés relatifs** : `0 2 4 7` combinés avec `.scale()`.

### Gammes (`.scale(...)`)
```javascript
// Arpège en Do mineur pentatonique
note("0 2 3 4 6 7 9")
  .scale("c4:minor:pentatonic")
  .s("sawtooth")
```
*Gammes disponibles :* `major`, `minor`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `aeolian`, `locrian`, `pentatonic`, `blues`, `chromatic`, `hirajoshi`, `iwato`, etc.

### Accords et Voicings
On utilise le symbole `'` (apostrophe) pour spécifier la nature de l'accord :
- `"c3'maj"`, `"c3'min"` (Triades)
- `"c3'maj7"`, `"d3'm7"`, `"g3'dom7"`, `"b2'm7b5"` (Tétrades Jazz)
- `"c3'sus4"`, `"c3'dim7"`, `"f3'maj9"`, `"a2'm11"`

#### Arpégiateur automatique (`.arp(...)`) :
```javascript
note("<c3'maj7 f3'maj7 g3'dom7 e3'm7>")
  .arp("up down")
  .s("gm_electric_piano_1")
```
*Modes d'arpège :* `"up"`, `"down"`, `"updown"`, `"downup"`, `"converge"`, `"diverge"`, `"random"`.

---

## 5. Effets Audio & Modulation

Ajoutez des effets en chaînant les méthodes :

### Filtres
- `.lpf(freq)` : Filtre passe-bas (ex: `800` Hz).
- `.lpq(val)` : Résonance du passe-bas (ex: `1` à `20`).
- `.hpf(freq)` : Filtre passe-haut (ex: `200` Hz pour nettoyer les sub).
- `.bpf(freq)` : Filtre passe-bande.

### Espace & Temps
- `.room(amount)` : Quantité de réverbération (de `0` à `1`).
- `.size(val)` : Taille de la pièce réverbérée.
- `.delay(amount)` : Envoi vers le delay (de `0` à `1`).
- `.delaytime(sec)` : Vitesse du delay (ex: `0.25` pour une croche).
- `.delayfeedback(val)` : Répétitions du delay (de `0` à `0.95`).
- `.pan(pos)` : Panoramique stéréo (`0` = gauche, `0.5` = centre, `1` = droite).

### Dynamique, Saturation & Dégradation
- `.gain(amount)` : Volume (ex: `0.8`).
- `.distort(val)` : Saturation / Overdrive chaleureuse.
- `.crush(bits)` : Bitcrusher rétro (de `1` à `16` bits, ex: `4` pour gros grain 8-bit).
- `.coarse(val)` : Réduction de la fréquence d'échantillonnage.

### Enveloppe ADSR
- `.attack(sec)` : Temps d'attaque.
- `.decay(sec)` : Déclin.
- `.sustain(val)` : Niveau de maintien (`0` à `1`).
- `.release(sec)` : Temps de relâchement.

### LFO & Modulations continues
Strudel permet d'utiliser des générateurs continus (`sine`, `saw`, `tri`, `perlin`) pour moduler n'importe quel paramètre :

```javascript
// Le filtre LPF oscille entre 400Hz et 3000Hz avec une sinusoïde lente
note("c2 g2 bb2 c3")
  .s("sawtooth")
  .lpf(sine.range(400, 3000).slow(4))
  .lpq(8)
```

---

## 6. Fonctions de Transformation Algorithmique

### Vitesse & Sens
- `.fast(n)` : Accélère le pattern n fois.
- `.slow(n)` : Ralentit le pattern n fois.
- `.rev()` : Inverse le sens de lecture (reverse).
- `.palindrome()` : Joue à l'endroit puis à l'envers sur 2 cycles.

### Manipulation temporelle
- `.early(amount)` / `.late(amount)` : Décale le timing (crée du swing / groove humain).
- `.jux(fn)` : Applique une fonction sur l'oreille droite et garde l'originale à gauche (stéréo immense).
- `.off(time, fn)` : Duplique le pattern avec un décalage temporel et lui applique un effet (ex: delay polyrythmique).

### Probabilités & Conditions
- `.sometimes(fn)` : Applique la transformation environ 50% du temps.
- `.often(fn)` : Applique environ 75% du temps.
- `.rarely(fn)` : Applique environ 25% du temps.
- `.every(n, fn)` : Applique tous les n cycles (ex: `.every(4, rev)`).

```javascript
// Exemple de stéréo spatiale avec jux et transformation
note("c3 eb3 g3 c4")
  .s("sawtooth")
  .jux(rev) // Oreille droite jouée à l'envers !
```

---

## 7. Exemples Complets & Prêts à Jouer

Copiez et collez directement ces morceaux dans l'éditeur [strudel.cc](https://strudel.cc) !

### 1. Acid Techno 303 (TB-303 + TR-909)
```javascript
setcps(135/60/4)

stack(
  // Beat TR-909
  s("bd [~ bd] bd [~ bd], [~ cp]*2, hh*16?0.9")
    .bank("RolandTR909")
    .gain(1.1),

  // Bassline Acid 303
  note("c2 [~ c2] eb2 c2 [f2 c2] [g2 c2] bb1 [c2 c3]")
    .s("sawtooth")
    .decay(0.2)
    .sustain(0.1)
    .lpf(sine.range(300, 3500).slow(8))
    .lpq(14)
    .distort(0.4)
)
```

---

### 2. Jungle / Drum & Bass (Amen Break Slice + 808 Sub)
```javascript
setcps(174/60/4)

stack(
  // Amen Break découpé et réarrangé
  s("amencutup")
    .n("<0 [4 2] 3 [5 7]>")
    .gain(1.2),

  // Sub-Bass 808 glissante
  note("<[c1 ~] [~ eb1] [f1 ~] [g1 ~]>")
    .s("sine")
    .gain(1.4)
    .decay(1.5),

  // Nappe atmosphérique
  note("<c4'min7 f4'min7 bb3'maj7 g3'dom7>")
    .s("gm_pad_2_warm")
    .slow(2)
    .room(0.8)
    .gain(0.6)
)
```

---

### 3. Lo-Fi Hip Hop (Rhodes Jazz, Beat feutré & Pluie)
```javascript
setcps(84/60/4)

stack(
  // Ambiance de fond (Crackle Lo-Fi)
  s("crackle").gain(0.15),

  // Beat feutré SP-1200
  s("bd [~ bd] sd [~ bd], hh*4")
    .bank("EmuSP1200")
    .lpf(2200)
    .gain(0.9),

  // Accords de Piano Électrique Rhodes
  note("<[d3'm9] [g3'13] [c3'maj9] [a3'7b9]>")
    .s("gm_electric_piano_1")
    .room(0.6)
    .lpf(1600)
    .slow(2),

  // Petite mélodie de vibraphone aléatoire
  note("a4 c5 e5 g5 a5")
    .s("gm_vibraphone")
    .degradeBy(0.4)
    .delay(0.5)
    .delaytime(0.33)
)
```

---

### 4. Synthwave / Cyberpunk 80s
```javascript
setcps(110/60/4)

stack(
  // Batterie LinnDrum punchy
  s("bd [~ bd] [sd,cp] [~ bd], hh*8")
    .bank("AkaiLinn")
    .gain(1.1),

  // Basse 16e de note roulante
  note("c2*16")
    .s("sawtooth")
    .decay(0.15)
    .lpf(1200)
    .lpq(4),

  // Synth Lead néon avec Jux Stéréo
  note("<c4 eb4 g4 bb4 c5 eb5>*2")
    .s("gm_lead_2_sawtooth")
    .jux(rev)
    .delay(0.4)
    .room(0.7)
    .gain(0.75)
)
```

---

### 5. Ambient Éthéré & Génératif
```javascript
setcps(60/60/4)

stack(
  // Piano acoustique avec grands espaces
  note("c3 g3 eb4 bb4 f5")
    .s("gm_acoustic_grand_piano")
    .euclid(5, 12)
    .room(0.95)
    .size(0.9)
    .delay(0.6)
    .delaytime(0.5),

  // Nappe de cordes lentes
  note("<c3'sus2 f3'maj7 g3'sus4>")
    .s("gm_string_ensemble_1")
    .slow(4)
    .attack(2)
    .release(3)
    .gain(0.7)
)
```

---

## 🎯 Raccourcis Clavier indispensables sur strudel.cc
- **Ctrl + Entrée** (ou **Cmd + Entrée**) : Évaluer / Lancer le code.
- **Ctrl + .** (ou **Cmd + .**) : Arrêter la lecture (Stop audio).
- **Alt + Entrée** : Évaluer seulement le bloc de code sous le curseur.
- **Onglet "Sounds" (dans le panneau latéral droit)** : Explorer en temps réel la liste des milliers d'échantillons et instruments disponibles.
