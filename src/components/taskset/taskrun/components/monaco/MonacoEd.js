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
import { Watcher } from "@/components/taskset/taskrun/components/monaco/watcher/watcher";
import Box from "@mui/material/Box";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";

const MonacoEd = () => {
  const { mode } = useColorScheme();

  return (
    <Box
      id="watchmonaco"
      sx={{ display: "flex", flexDirection: "column", width: "100%" }}
    >
      <Watcher />

      {task.currTask.info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {task.currTask.info}
        </Typography>
      )}
      {task.currTask.errorMessage && !task.currTask.editordisabled && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {task.currTask.errorMessage}
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
    </Box>
  );
};

export default MonacoEd;
