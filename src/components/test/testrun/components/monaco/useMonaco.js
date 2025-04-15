import { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { Background } from "@xyflow/react";
import { useEffect, useState } from "react";
import "./custom.css";

const useMonaco = ({ editorRef, monacoRef, currTask }) => {
  const theme = useTheme();
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("currTask", currTask, editorRef.current);
    if (!mounted || !currTask) {
      return;
    }

    setValue(currTask.code);

    currTask.tasktype == "guide"
      ? editorRef.current.updateOptions({ lineNumbers: "off" })
      : editorRef.current.updateOptions({ lineNumbers: "on" });
  }, [currTask, mounted]);

  // const editorDisabled = useRef({ disabled: false });
  const zu = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const setEditorDisabled = (disabled, editorRef) => {
    editorRef.current.updateOptions({ readOnly: disabled });
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
    setMounted(true);
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
  }

  // function handleContentChange({ editor, monaco, darkmode }) {
  //   const items = document.querySelectorAll(".mtk7");
  //   console.log("items", items);

  //   items.forEach((item) => {
  //     // if (item.textContent.includes(searchString)) {
  //     item.classList.add("markdown2");
  //     item.parentElement.parentElement.classList.add("markdown");
  //     // }
  //   });
  // }

  function setTheme(darkmode) {
    darkmode
      ? monacoRef.current.editor.setTheme("dark")
      : monacoRef.current.editor.setTheme("light");
  }

  return {
    setEditorDisabled,
    handleEditorDidMount,
    editorRef,
    monacoRef,
    value,
  };
};

export default useMonaco;
