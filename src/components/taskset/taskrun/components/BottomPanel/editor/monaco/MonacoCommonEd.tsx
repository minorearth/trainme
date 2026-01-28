"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
// import Editor from "@monaco-editor/react";

import { EditorOptions } from "@/components/taskset/taskrun/components/BottomPanel/editor/monaco/MonacoEditorOptions";
import { useColorScheme } from "@mui/material/styles";
import "./MonacoEditor.css";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import { Watcher } from "@/components/taskset/taskrun/components/BottomPanel/editor/monaco/watcher/watcher";
import Box from "@mui/material/Box";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { MonacoStore } from "@/components/taskset/taskrun/layers/store/monaco";

//TODO:??devmode
// if (typeof window !== "undefined") {
//   loader.config({ monaco });
// }

import { observer } from "mobx-react-lite";
import { useRef } from "react";

//stores

const MonacoCommonEd = observer(
  ({
    code,
    inv,
    tasktype,
    errorHandler,
    filedata,
    monacostore,
  }: {
    code: string;
    inv: string[];
    tasktype: string;
    filedata: string;
    errorHandler: () => void;
    monacostore: MonacoStore;
  }) => {
    const { mode } = useColorScheme();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    return (
      <Box
        ref={containerRef}
        sx={{
          // display: "flex",
          // flexDirection: "column",
          width: "100%",
          position: "relative",
        }}
      >
        <Watcher />

        <IconButton
          aria-label="refresh editor"
          onClick={() => {
            monacostore.refreshEditor(code);
          }}
          sx={{
            position: "absolute",
            right: "10px",
            top: "5px",
            zIndex: 100,
          }}
          edge="end"
          size="small"
        >
          <CachedIcon />
        </IconButton>

        <Editor
          width="100%"
          theme={"dark"}
          options={{ ...EditorOptions }}
          language="python"
          onChange={(value) =>
            monacostore.handleChangeMonacoContent(value || "", errorHandler)
          }
          onMount={(editor, monaco) =>
            monacostore.handleEditorDidMount({
              editor,
              monaco,
              inv,
              code,
              tasktype,
              filedata,
              containerRef,
              resizeObserverRef,
            })
          }
        />
      </Box>
    );
  },
);

export default MonacoCommonEd;
