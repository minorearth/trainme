"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
import { useTheme } from "@mui/material/styles";
import Editor from "@monaco-editor/react";
import { EditorOptions } from "@/components/test/testrun/components/monaco/MonacoEditorOptions";
import useMonaco from "@/components/test/testrun/components/monaco/useMonaco";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

const GoodBook = ({
  currTask,
  monacoRef,
  editorRef,
  handleChangeContent,
  monacoInfo,
}) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { handleEditorDidMount } = useMonaco({
    monacoRef,
    editorRef,
  });

  return (
    <>
      {currTask.info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {currTask.info}
        </Typography>
      )}
      {currTask.maxlineserror && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {currTask.maxlineserror}
        </Typography>
      )}
      <Editor
        height="50vh"
        width="100%"
        theme={"pk"}
        options={{ ...EditorOptions }}
        language="python"
        value={currTask?.code}
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

export default GoodBook;
