import { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";

const useMonaco = ({ editorRef, monacoRef }) => {
  const theme = useTheme();

  // const editorDisabled = useRef({ disabled: false });
  const zu = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const setEditorDisabled = (disabled, editorRef) => {
    // disabled
    //   ? editorRef.current.onKeyDown((event) => {
    //       event.preventDefault();
    //       event.stopPropagation();
    //     })
    //   : editorRef.current.onKeyDown();
    // if (disabled) {
    //   editorRef.current.getContainerDomNode().addEventListener("keydown", zu);
    //   editorRef.current
    //     .getContainerDomNode()
    //     .addEventListener("selectionchange", zu2);
    // } else {
    //   editorRef.current
    //     .getContainerDomNode()
    //     .removeEventListener("keydown", zu);
    // }
  };

  function handleEditorDidMount({ editor, monaco, darkmode }) {
    monacoRef.current = monaco;
    editorRef.current = editor;
    monaco.editor.defineTheme("pk", {
      base: "vs-dark",
      inherit: true,
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
    setTheme(darkmode);
    // editor.onKeyDown((event) => {
    //   if (editorDisabled.current.disabled) {
    //     event.preventDefault();
    //   }
    // });
    document.addEventListener(
      "paste",
      (event) => {
        console.log("paste capture in monaco editor contianer");
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
  }

  function setTheme(darkmode) {
    darkmode
      ? monacoRef.current.editor.setTheme("pk")
      : monacoRef.current.editor.setTheme("vs");
  }

  return {
    setEditorDisabled,
    handleEditorDidMount,
    editorRef,
    monacoRef,
  };
};

export default useMonaco;
