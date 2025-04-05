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
}) => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { handleEditorDidMount } = useMonaco({
    monacoRef,
    editorRef,
  });

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

export default MonacoEd;
