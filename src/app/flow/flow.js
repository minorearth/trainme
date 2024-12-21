// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import { FiFile } from "react-icons/fi";
import { initialEdges, initialNodes } from "./data";

import "@xyflow/react/dist/base.css";
import "./styles.css";

import TurboNode from "./TurboNode.js";
import TurboEdge from "./TurboEdge.js";

import { getProgress } from "@/app/db/domain";

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

const Flow = ({ setTestsStarted, userid }) => {
  const fullFillProgess = (unlocked) => {
    const full = initialNodes((id) => setTestsStarted(id)).map((node) => ({
      ...node,
      data: { ...node.data, unlocked: unlocked.includes(node.id) },
    }));
    return full;
  };

  useEffect(() => {
    const getUserProgress = async () => {
      const progress = await getProgress(userid);
      setNodes(fullFillProgess(progress));
    };
    getUserProgress();
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState();
  // initialNodes((id) => setTestsStarted(id))
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
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <Controls showInteractive={false} />
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
