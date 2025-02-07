// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  useOnViewportChange,
} from "@xyflow/react";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import "@xyflow/react/dist/base.css";
import "./styles.css";
import TurboNode from "./components/TurboNode.js";
import TurboEdge from "./components/TurboEdge.js";
import AnimNode from "./components/AnimNode";
import alertdialog from "@/store/dialog";
import FlowPanel from "./components/panel";

const nodeTypes = {
  turbo: TurboNode,
  animation: AnimNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: "turbo",
  markerEnd: "edge-circle",
};

const Flow = ({ navState, flow, fit }) => {
  const theme = useTheme();
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState();

  useEffect(() => {
    setEdges(flow.edges);
    setNodes(flow.nodes);
  }, [flow]);

  const showUnlocked = () => {
    const unlockedNodesToShow = navState.userProgress.lastunlocked;
    if (unlockedNodesToShow.length > 0) {
      for (let i = 0; i < unlockedNodesToShow.length; i++) {
        setTimeout(() => {
          fitView({
            nodes: [{ id: unlockedNodesToShow[i] }],
            duration: 500,
          });
        }, i * 2000);
      }
    }
  };
  fit.current = showUnlocked;

  useEffect(() => {
    !alertdialog.dialogState.visible && showUnlocked();
  }, [nodes]);

  useOnViewportChange({
    // onEnd: (viewport) => {
    //   setTimeout(() => {
    //     fitView({
    //       nodes: [{ id: progress.current.currentchapter }],
    //       duration: 500,
    //     });
    //   }, 2000);
    // },
  });

  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        translateExtent={[
          [0, -250],
          [1300, 2500],
        ]}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        maxZoom={2}
        minZoom={1}
      >
        <FlowPanel navState={navState} />
      </ReactFlow>
    </Box>
  );
};

export default Flow;
