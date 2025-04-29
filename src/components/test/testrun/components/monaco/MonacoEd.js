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
import "./MonacoEditor.css";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";

var startX, startY;

function touchstart(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}

function touchend(e) {
  startX = 0;
  startY = 0;
}

function touchmove(e) {
  var deltaX = e.touches[0].clientX - startX,
    deltaY = e.touches[0].clientY - startY;
  document.querySelector("body").scrollBy(0, -deltaY / 100);
}

const MonacoEd = ({
  currTask,
  monacoRef,
  editorRef,
  handleChangeContent,
  monacoInfo,
  refreshEditor,
}) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { handleEditorDidMount, value, undo, redo } = useMonaco({
    monacoRef,
    editorRef,
    currTask,
  });

  useEffect(() => {
    // const items = document.querySelectorAll(".mtk20");
    // items.forEach((item) => {
    //   item.classList.add("markdown2");
    //   item.parentElement.parentElement.classList.add("markdown");
    //   // }
    // });
  }, []);

  return (
    <>
      {currTask.info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {currTask.info}
        </Typography>
      )}
      {currTask.maxlineserror && !currTask.editordisabled && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {currTask.maxlineserror}
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
      {/* <Button onClick={() => undo()}>undo</Button>
      <Button onClick={() => redo()}>redo</Button> */}

      <Editor
        height="50vh"
        width="100%"
        theme={"dark"}
        options={{ ...EditorOptions }}
        language="python"
        // value={value}
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

// import styled from "styled-components";

// const StyledEditor = styled.div(({ theme }) => ({
//   ".monaco-editor .view-line:has(.mtk7):not(:has(.mtk1)):not(:has(.mtk8))": {
//     backgroundColor: "white",
//     borderLeft: "20px",
//     borderLeftStyle: "solid",
//     borderColor: "blueviolet",
//   },

//   ".monaco-editor .mtk7": {
//     color: theme == "dark" ? "white" : "inherit",
//   },

//   ".monaco-editor .view-line:has(.mtk8):not(:has(.mtk4)):not(:has(.mtk9)):not(:has(.mtk6))":
//     {
//       backgroundColor: "#121212",
//       borderLeft: "20px",
//       borderLeftStyle: "solid",
//       borderColor: "blueviolet",
//     },

//   // ".monaco-editor .mtk7": {
//   //   color: theme == "dark" ? "white" : "black",
//   // },

//   ".monaco-editor .mtk8": {
//     color: theme != "dark" ? "white" : "inherit",
//   },
// }));

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
