"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
// import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import { EditorOptions } from "@/components/unitset/unitrun/components/BottomPanel/editor/monaco/MonacoEditorOptions";
import "./MonacoEditor.css";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import { Watcher } from "@/components/unitset/unitrun/components/BottomPanel/editor/monaco/watcher/watcher";
import Box from "@mui/material/Box";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import unit from "@/components/unitset/unitrun/layers/store/unit";

//TODO:??devmode
// if (typeof window !== "undefined") {
//   loader.config({ monaco });
// }

import { observer } from "mobx-react-lite";
import { useRef } from "react";

//stores

const pageVariants = {
  initial: { opacity: 0, y: 10 }, // Начальное состояние: невидимый и чуть ниже
  animate: { opacity: 1, y: 0 }, // Конечное: видимый и на месте
};

const MonacoCommonEd = observer(
  ({
    errorHandler,
    monacoid,
  }: {
    errorHandler: () => void;
    monacoid: number;
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    return (
      <Box
        ref={containerRef}
        key={`MonacoCommonEd${monacoid}${unit.currUnit.unituuid}`}
        sx={{
          // display: "flex",
          // flexDirection: "column",
          width: "100%",
          position: "relative",
        }}
        component={motion.div}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.5, ease: "easeOut" }}
        // initial={{ opacity: 0, scale: 0 }}
        // animate={{ opacity: 1, scale: 1 }}
        // transition={{
        //   duration: 0.9,
        //   scale: { type: "spring", visualDuration: 0.9, bounce: 0.5 },
        // }}
      >
        <Watcher />

        <IconButton
          key={`refreshButton${monacoid}`}
          aria-label="refresh editor"
          onClick={() => {
            unit.refreshEditor(monacoid);
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
          key={`monacoid${monacoid}${unit.currUnit.unituuid}`}
          width="100%"
          theme={"dark"}
          options={{ ...EditorOptions }}
          language="python"
          onChange={(value) =>
            unit.handleChangeMonacoContent(value || "", monacoid, errorHandler)
          }
          onMount={(editor, monaco) =>
            unit.handleEditorDidMount({
              editor,
              monaco,
              monacoid,
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
