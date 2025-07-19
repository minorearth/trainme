// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
// https://uiverse.io/Spacious74/horrible-horse-4
//TODO: (later) Инерция
"use client";
import React from "react";
import { ReactFlow } from "@xyflow/react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "@xyflow/react/dist/base.css";
import { observer } from "mobx-react-lite";

//styles
import "./css/styles.css";

//components
import FlowPanel from "./components/FlowPanel";

//hooks
import useFlow from "./hooks/useFlow";

const Course = observer(() => {
  const theme = useTheme();
  const flowOptions = useFlow();

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <ReactFlow
        nodesDraggable={false}
        translateExtent={[
          [0, -250],
          [1300, 8500],
        ]}
        maxZoom={2}
        minZoom={1}
        {...flowOptions}
      >
        <FlowPanel />
      </ReactFlow>
    </Box>
  );
});

export default Course;
