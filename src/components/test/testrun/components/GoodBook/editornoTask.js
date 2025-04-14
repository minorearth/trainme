"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
import { useTheme } from "@mui/material/styles";
import Editor from "@monaco-editor/react";
import { EditorOptions } from "@/components/test/testrun/components/monaco/MonacoEditorOptions";
import useEdtornoTask from "@/components/test/testrun/components/GoodBook/useEdtornoTask";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

const EdtorNoTask = ({ code }) => {
  const { mode } = useColorScheme();
  const { handleEditorDidMount, handleChangeContent, value } = useEdtornoTask({
    code,
  });
  useEdtornoTask;
  return (
    <>
      <Editor
        height="50vh"
        width="100%"
        theme={"dark"}
        options={{ ...EditorOptions }}
        language="python"
        value={value}
        onChange={(value, e) =>
          handleChangeContent({
            value,
          })
        }
        onMount={(editor, monaco) =>
          handleEditorDidMount({
            editor,
            monaco,
            darkmode: mode == "dark" ? true : false,
          })
        }
      />
    </>
  );
};

export default EdtorNoTask;
