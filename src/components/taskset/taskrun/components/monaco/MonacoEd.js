"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
import Editor from "@monaco-editor/react";
import { EditorOptions } from "@/components/taskset/taskrun/components/monaco/MonacoEditorOptions";
import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import "./MonacoEditor.css";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";

//stores
import task from "@/components/taskset/taskrun/store/task";

const MonacoEd = () => {
  const { mode } = useColorScheme();

  return (
    <>
      {task.currTask.info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {task.currTask.info}
        </Typography>
      )}
      {task.currTask.maxlineserror && !task.currTask.editordisabled && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {task.currTask.maxlineserror}
        </Typography>
      )}
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => {
          task.actions.refreshEditor();
        }}
        sx={{
          position: "absolute",
          right: "10px",
          top: "-5px",
          zIndex: 100,
        }}
        edge="end"
        size="small"
      >
        <CachedIcon />
      </IconButton>

      <Editor
        height="50vh"
        width="100%"
        theme={"dark"}
        options={{ ...EditorOptions }}
        language="python"
        onChange={(value, e) =>
          task.actions.handleChangeContent({
            value,
          })
        }
        onMount={(editor, monaco) =>
          task.actions.handleEditorDidMount({
            editor,
            monaco,
            darkmode: mode == "dark" ? true : false,
          })
        }
      />
    </>
  );
};

export default MonacoEd;
