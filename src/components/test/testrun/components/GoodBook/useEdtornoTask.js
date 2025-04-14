import { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { Background } from "@xyflow/react";
import { useState } from "react";

const useEdtornoTask = ({ code }) => {
  const [value, setValue] = useState("");

  const theme = useTheme();

  const handleChangeContent = ({ value }) => {
    setValue(value);
  };

  function handleEditorDidMount({ editor, monaco, darkmode }) {
    monaco.editor.defineTheme("dark", {
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
        {
          token: "comment",
          fontStyle: "bold",
        },
      ],
      colors: {
        "editor.background": "#121212",
      },
    });
    setTheme(darkmode, monaco);
  }

  function setTheme(darkmode, monaco) {
    darkmode ? monaco.editor.setTheme("dark") : monaco.editor.setTheme("vs");
  }

  return {
    handleEditorDidMount,
    handleChangeContent,
    value,
  };
};

export default useEdtornoTask;
