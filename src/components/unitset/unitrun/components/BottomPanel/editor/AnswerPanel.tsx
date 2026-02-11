"use client";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { L, Task, TT } from "@/tpconst/src";
import MarkDown from "../guideCode/markDown";
import { Editor } from "@monaco-editor/react";
import { EditorOptions } from "./monaco/MonacoEditorOptions";
import { useRef } from "react";

const AnswerPanel = observer(({ monacoid }: { monacoid: number }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Box
      key={`AnswerPanel${monacoid}`}
      ref={containerRef}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <MarkDown text={`'''\n  ${L.ru.ME.RIGHT_CODE}\n'''`} />
      <Editor
        key={`monacoviewerid1`}
        width="100%"
        // height={"300px"}
        // theme={"dark"}
        options={{ ...EditorOptions, lineNumbers: "off", readOnly: true }}
        language="python"
        value={(unit.currUnit as Task).rightcode}
        // onMount={(editor) => {
        //   editor.onDidContentSizeChange((e) => {
        //     const newHeight = e.contentHeight;
        //     editor.layout({
        //       width: containerRef?.current?.clientWidth ?? 0,
        //       height: newHeight,
        //     });
        //   });
        // }}
        onMount={(editor, monaco) =>
          unit.handleViewerDidMount({
            editor,
            monaco,
            containerRef,
          })
        }
      />
      <MarkDown text={`'''\n  ${L.ru.ME.YOUR_CODE}\n'''`} />
      {/*  */}
      <Editor
        key={`monacoviewerid2`}
        width="100%"
        // height="100%"
        // theme={"dark"}
        options={{ ...EditorOptions, lineNumbers: "off", readOnly: true }}
        language="python"
        value={unit.editors[monacoid].codepart}
        onMount={(editor) => {
          editor.onDidContentSizeChange((e) => {
            const newHeight = e.contentHeight;
            editor.layout({
              width: containerRef?.current?.clientWidth ?? 0,
              height: newHeight,
            });
          });
        }}
      />
    </Box>
  );
});

export default AnswerPanel;
