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
  ReactFlowProvider,
  Panel,
  useOnViewportChange,
} from "@xyflow/react";

import { FiFile } from "react-icons/fi";
import { initialEdges, initialNodes } from "./data";

import "@xyflow/react/dist/base.css";
import "./styles.css";

import TurboNode from "./TurboNode.js";
import TurboEdge from "./TurboEdge.js";

import { getProgress } from "@/db/domain";

const nodeTypes = {
  turbo: TurboNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: "turbo",
  markerEnd: "edge-circle",
};

const Flow = ({ setTestsStartedPage, userid, navState }) => {
  const fullFillProgess = (unlocked, completed) => {
    const full = initialNodes((id) => setTestsStartedPage(id)).map((node) => ({
      ...node,
      data: {
        ...node.data,
        unlocked: unlocked.includes(node.id),
        completed: completed.includes(node.id),
      },
    }));
    return full;
  };
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState();

  const progress = useRef({});
  useEffect(() => {
    const getUserProgress = async () => {
      progress.current = await getProgress(userid);
      setNodes(
        fullFillProgess(progress.current.unlocked, progress.current.completed)
      );
    };
    getUserProgress();
  }, []);

  useEffect(() => {
    const unlockedNodesToShow = navState.unlockedtoshow;
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

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
      // fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      maxZoom={2}
      minZoom={1}
    >
      <Controls showInteractive={false} />
      <Panel position="top-left">
        <button
          onClick={() => {
            fitView({ nodes: [{ id: "1" }], duration: 500 });
          }}
        >
          Focus node
        </button>
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
