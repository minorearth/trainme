import { editor } from "monaco-editor";

export const EditorOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  dragAndDrop: false,
  dropIntoEditor: {
    enabled: false,
  },
  detectIndentation: false,
  fixedOverflowWidgets: false,
  fontFamily: "Monaco",
  fontSize: 16,
  formatOnPaste: true,
  formatOnType: true,
  lineHeight: 1.5,
  lineNumbersMinChars: 0,
  folding: false,

  renderLineHighlight: "none",
  overviewRulerLanes: 0,
  minimap: {
    enabled: false,
  },
  guides: { indentation: true },
  padding: {
    top: 8,
    bottom: 8,
  },
  scrollbar: {
    verticalScrollbarSize: 9,
    horizontalScrollbarSize: 9,
    alwaysConsumeMouseWheel: true,
  },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  tabSize: 4,
  quickSuggestions: true,
  wordBasedSuggestions: "currentDocument",
  wordWrap: "on",
};
