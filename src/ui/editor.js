/**
 * editor.js
 * Intégration du composant d'édition CodeMirror 6 officiel de Strudel.
 * Fournit coloration syntaxique Strudel / Mini-notation, auto-indentation,
 * gestion native des sélections, et raccourcis clavier.
 */

import { initEditor } from './codemirror-bundle.js';

let editorView = null;

/**
 * Initialise l'éditeur CodeMirror dans l'élément conteneur
 */
export function initCodeEditor({ container, initialCode = '', onEvaluate, onStop, onChange }) {
  if (!container) throw new Error('Conteneur de l\'éditeur introuvable');

  container.innerHTML = '';

  editorView = initEditor({
    root: container,
    initialCode: initialCode,
    onEvaluate: (code) => {
      if (typeof onEvaluate === 'function') onEvaluate(code);
    },
    onStop: () => {
      if (typeof onStop === 'function') onStop();
    },
    onChange: (code) => {
      if (typeof onChange === 'function') onChange(code);
    }
  });

  return editorView;
}

/**
 * Récupère le texte complet du code
 */
export function getEditorCode() {
  if (!editorView) return '';
  return editorView.state.doc.toString();
}

/**
 * Remplace tout le contenu de l'éditeur
 */
export function setEditorCode(code) {
  if (!editorView) return;
  const currentLen = editorView.state.doc.length;
  editorView.dispatch({
    changes: { from: 0, to: currentLen, insert: code }
  });
}

/**
 * Insère du code à l'emplacement précis du curseur sans sauter de ligne
 */
export function insertAtCursor(code) {
  if (!editorView) return;
  editorView.focus();
  const sel = editorView.state.selection.main;
  editorView.dispatch({
    changes: { from: sel.from, to: sel.to, insert: code },
    selection: { anchor: sel.from + code.length }
  });
}

/**
 * Récupère le texte actuellement sélectionné (ou tout le texte si aucune sélection)
 */
export function getSelectedCode() {
  if (!editorView) return '';
  const sel = editorView.state.selection.main;
  if (sel.from !== sel.to) {
    return editorView.state.sliceDoc(sel.from, sel.to);
  }
  return '';
}

/**
 * Donne le focus à l'éditeur
 */
export function focusEditor() {
  if (editorView) editorView.focus();
}
