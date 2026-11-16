# ⚡ Strudel Studio (Application Desktop Dédiée)

Une application Desktop complète de live-coding musical basée sur le moteur sonore de **Strudel**, débarrassée de toute l'interface par défaut de strudel.cc pour vous offrir votre propre environnement DAW sur-mesure.

---

## 🚀 Démarrage Rapide

Dans le terminal :

```bash
# 1. Installer les dépendances (si ce n'est pas déjà fait)
npm install

# 2. Lancer l'application Desktop
npm start
```

---

## 🎛️ Ce qui a été personnalisé (Votre Interface)

1. **Barre de Transport Supérieure** :
   - Bouton **PLAY** lumineux (raccourci `Ctrl + Entrée`).
   - Bouton **STOP** immédiat (raccourci `Ctrl + .`).
   - **Métronome Visuel 4 Temps** : 4 LED dynamiques qui clignotent en temps réel au rythme de vos cycles.
   - **Contrôleur de BPM** : Ajustement direct du tempo, boutons +/- et bouton **TAP TEMPO**.
   - **Gestion de fichiers natifs** : Ouvrir et Sauvegarder vos fichiers `.strudel` directement sur votre disque dur.

2. **Panneau Latéral Gauche (Presets & Insertion)** :
   - **6 Presets complets intégrés** : Techno Acid 303, Jungle Amen Break, Lo-Fi Rhodes, Synthwave 80s, Ambient Éthéré, Minimal Groovy.
   - **Boutons d'insertion 1-clic** : Ajoutez instantanément un beat 909, une ligne de basse, des charlestons, un piano Rhodes ou un découpage de breakbeat à l'endroit de votre curseur.

3. **Éditeur Central Dédié** :
   - Police monospace claire avec coloration moderne.
   - Évaluation instantanée sans rechargement.
   - Barre d'état en temps réel indiquant les erreurs de syntaxe éventuelles sans bloquer l'application.

4. **Panneau Latéral Droit (Sound Design & Visuels)** :
   - **Visualiseur Audio Oscilloscope en Temps Réel** : Dessine l'onde sonore générée par Web Audio sur un Canvas fluide.
   - **4 Macro-Contrôleurs en Direct** :
     - `macroLPF` : Fréquence de coupure du filtre passe-bas (utilisable directement dans votre code : `.lpf(macroLPF)`).
     - `macroLPQ` : Résonance du filtre.
     - `macroRoom` : Taux de réverbération / espace.
     - `Volume Général` : Atténuation générale.
   - **Aide-Mémoire Sons Rapide** : Noms des banques de boîtes à rythmes (909, 808, LinnDrum...) et Soundfonts General MIDI.
