// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
"use client";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Controls,
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

import "@xyflow/react/dist/base.css";
import "./styles.css";

import TurboNode from "./components/TurboNode.js";
import TurboEdge from "./components/TurboEdge.js";
import AnimNode from "./components/AnimNode";

import { BiCoinStack } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import alertdialog from "@/store/dialog";
import { signOutUserClient } from "@/db/domain/domain";

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
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState();
  const router = useRouter();

  useEffect(() => {
    console.log("flow rerendered", flow.nodes);
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
      // fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      maxZoom={2}
      minZoom={1}
    >
      <Controls showInteractive={false} />
      <Panel position="top-left" style={{ width: "97%" }}>
        {/* <Box sx={{ width: "100%", opacity: 1, }}> */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "row",
            padding: "4px",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: "4px",
            }}
          >
            <BiCoinStack size={"40px"} />
            <Typography variant="h4" gutterBottom>
              {navState.userProgress.rating}
            </Typography>
          </Box>
          <RiLogoutCircleRLine
            size={"40px"}
            onClick={async () => {
              await signOutUserClient();
              router.push(`/login/`);
            }}
          />
        </Paper>{" "}
        {/* </Box> */}
      </Panel>
      <svg>
        <defs>
          <linearGradient id="edge-gradient">
            <stop offset="0%" stopColor="#ae53ba" />
            <stop offset="100%" stopColor="#2a8af6" />
          </linearGradient>

          <marker
            id="edge-circle"
            viewBox="-5 -5 10 10"
            refX="0"
            refY="0"
            markerUnits="strokeWidth"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
          </marker>
        </defs>
      </svg>
    </ReactFlow>
  );
};

export default Flow;
