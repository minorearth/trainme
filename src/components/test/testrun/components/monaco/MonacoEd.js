"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
import { useTheme } from "@mui/material/styles";
import Editor from "@monaco-editor/react";
import { EditorOptions } from "@/components/test/testrun/components/monaco/MonacoEditorOptions";
import useMonaco from "@/components/test/testrun/components/monaco/useMonaco";

const MonacoEd = ({ currTask, setCode, mode, monacoRef, editorRef }) => {
  const theme = useTheme();
  const { handleEditorDidMount } = useMonaco({ monacoRef, editorRef });

  return (
    <Editor
      height="50vh"
      width="100%"
      theme={"pk"}
      options={EditorOptions}
      language="python"
      value={currTask?.code}
      onChange={(value, e) => setCode(value ?? "")}
      onMount={(editor, monaco) =>
        handleEditorDidMount({
          editor,
          monaco,
          darkmode: mode == "dark" ? true : false,
        })
      }
    />
  );
};

export default MonacoEd;
