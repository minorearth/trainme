"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
import Editor from "@monaco-editor/react";
import { EditorOptions } from "@/components/chapter/taskrun/components/monaco/MonacoEditorOptions";
import useMonaco from "@/components/chapter/taskrun/components/monaco/useMonaco";
import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import "./MonacoEditor.css";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import task from "@/components/chapter/taskrun/store/task";

const MonacoEd = () => {
  const { mode } = useColorScheme();
  const { handleEditorDidMount, handleChangeContent, refreshEditor } =
    useMonaco();

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
          refreshEditor();
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

export default MonacoEd;

// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchmove", (e) => touchmove(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchstart", (e) => touchstart(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchend", (e) => touchend(e));
// document
//   .querySelector("body")
//   .addEventListener("touchmove", (e) => touchmove(e));
// document
//   .querySelector("body")
//   .addEventListener("touchstart", (e) => touchstart(e));
// document
//   .querySelector("body")
//   .addEventListener("touchend", (e) => touchend(e));

// var startX, startY;

// function touchstart(e) {
//   startX = e.touches[0].clientX;
//   startY = e.touches[0].clientY;
// }

// function touchend(e) {
//   startX = 0;
//   startY = 0;
// }

// function touchmove(e) {
//   var deltaX = e.touches[0].clientX - startX,
//     deltaY = e.touches[0].clientY - startY;
//   document.querySelector("body").scrollBy(0, -deltaY / 100);
// }
