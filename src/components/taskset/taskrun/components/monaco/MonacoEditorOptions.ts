import { editor } from "monaco-editor";

export const EditorOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  contextmenu: false,
  dragAndDrop: false,
  //TODO:smth in types
  // alwaysConsumeMouseWheel: false,
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
  //TODO:smth in types
  // renderIndentGuides: false,
  overviewRulerLanes: 0,
  minimap: {
    enabled: false,
  },
  padding: {
    top: 8,
    bottom: 8,
  },
  scrollbar: {
    verticalScrollbarSize: 9,
    horizontalScrollbarSize: 9,
    // alwaysConsumeMouseWheel: false,
  },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  tabSize: 4,
  quickSuggestions: true,
  wordBasedSuggestions: "currentDocument",
  wordWrap: "on",
};
