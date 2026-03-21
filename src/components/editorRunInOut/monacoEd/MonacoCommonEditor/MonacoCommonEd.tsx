"use client";
//github.com/alankrantas/monaco-python-live-editor?tab=readme-ov-file
// https://alankrantas.github.io/monaco-python-live-editor/
// import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import { EditorOptions } from "@/components/editorRunInOut/monacoEd/MonacoCommonEditor/MonacoEditorOptions";
import "./MonacoEditor.css";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import unit from "@/components/unitrun/layers/store/unit";

//TODO:??devmode
// if (typeof window !== "undefined") {
//   loader.config({ monaco });
// }

import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

//stores

const pageVariants = {
  initial: { opacity: 0, y: 10 }, // Начальное состояние: невидимый и чуть ниже
  animate: { opacity: 1, y: 0 }, // Конечное: видимый и на месте
};

const MonacoCommonEd = observer(
  ({
    errorHandler,
    monacoid,
    autolayout,
  }: {
    errorHandler: () => void;
    monacoid: number;
    autolayout: boolean;
  }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isMobile = useMediaQuery("(max-width:600px)");

    return (
      <Box
        ref={containerRef}
        key={`MonacoCommonEd${monacoid}${unit.currUnit.unituuid}`}
        sx={{
          height: "100%",
          display: "flex",
          flex: "1 1 0px",

          width: "100%",
          position: "relative",
          flexShrink: 1,
          minHeight: autolayout ? "auto" : 200, //
        }}
        component={motion.div}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
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
          // height="100%"
          // theme={"dark"}
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
              autolayout,
            })
          }
        />
      </Box>
    );
  },
);

export default MonacoCommonEd;
