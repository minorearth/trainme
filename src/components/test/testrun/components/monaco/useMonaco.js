import { useEffect, useState } from "react";

const useMonaco = ({ editorRef, monacoRef, currTask }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    currTask && console.log("herer", currTask);
    if (!editorRef.current || Object.keys(currTask).length === 0) {
      return;
    }
    console.log("OOO", editorRef, editorRef.current, currTask);
    editorRef.current.setValue(currTask?.code);

    currTask.tasktype == "guide"
      ? editorRef.current.updateOptions({ lineNumbers: "off" })
      : editorRef.current.updateOptions({ lineNumbers: "on" });
  }, [mounted, currTask?.taskuuid]);

  const setEditorDisabled = (disabled, editorRef) => {
    editorRef.current.updateOptions({ readOnly: disabled });
  };

  function handleEditorDidMount({ editor, monaco, darkmode }) {
    monacoRef.current = monaco;
    editorRef.current = editor;
    setMounted((state) => !state);
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      // https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts
      rules: [
        {
          token: "identifier",
          foreground: "9CDCFE",
        },
        {
          token: "identifier.function",
          foreground: "DCDCAA",
        },
        {
          token: "type",
          foreground: "1AAFB0",
        },
      ],
      colors: {
        "editor.background": "#121212",
      },
    });
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#FFFFFF",
      },
    });
    setTheme(darkmode);
    document.addEventListener(
      "paste",
      (event) => {
        // TODO: uncomment
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );

    const handleTouchMove = (event) => {
      const model = editor.getModel();
      if (!model) return;
      const scrollTop = editor.getScrollTop();
      const scrollHeight = editor.getScrollHeight();
      const lastLineHeight = editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
      const deltaY =
        event.touches[0].clientY -
        (editor.getDomNode().getBoundingClientRect().top + scrollTop);
      if (scrollTop + deltaY >= scrollHeight - lastLineHeight) {
        event.preventDefault();
        window.scrollBy(0, deltaY);
      } else {
        event.preventDefault();
      }
    };

    const editorElement = editor.getDomNode();
    if (editorElement) {
      editorElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }
  }

  function setTheme(darkmode) {
    darkmode
      ? monacoRef.current.editor.setTheme("dark")
      : monacoRef.current.editor.setTheme("light");
  }

  return {
    setEditorDisabled,
    handleEditorDidMount,
  };
};

export default useMonaco;
