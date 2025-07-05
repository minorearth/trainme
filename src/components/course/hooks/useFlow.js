// https://codesandbox.io/p/sandbox/github/gkoum/flowSvgImages/tree/main/?file=%2Fpackage.json
// https://reactflow.dev/examples/styling/turbo-flow
// https://uiverse.io/Spacious74/horrible-horse-4
"use client";
import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { reaction } from "mobx";

//components
import TurboNode from "../components/TurboNode.js";
import TurboEdge from "../components/TurboEdge.js";
import AnimNode from "../components/AnimNode";

// stores
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";
import alertdialog from "@/components/common/dialog/store";

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

const useFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  useEffect(() => {
    setEdges(course.flow.edges);
    setNodes(course.flow.nodes);
    return reaction(
      () => course.flow,
      () => {
        setEdges(course.flow.edges);
        setNodes(course.flow.nodes);
      }
    );

    // setEdges(course.flow.edges);
    // setNodes(course.flow.nodes);
  }, []);

  useEffect(() => {
    !alertdialog.dialogState.visible && showUnlocked();
  }, [nodes]);

  const showUnlocked = () => {
    const unlockedNodesToShow = user.progress.lastunlocked;
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

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  return {
    onConnect,
    onNodesChange,
    onEdgesChange,
    nodeTypes,
    edgeTypes,
    defaultEdgeOptions,
    nodes,
    edges,
  };
};

export default useFlow;
