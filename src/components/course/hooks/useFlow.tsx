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
  EdgeTypes,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { reaction } from "mobx";

//components
import TurboNode from "../components/TurboNode";
import TurboEdge from "../components/TurboEdge";
import AnimNode from "../components/AnimNode";

// stores
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";
import alertdialog from "@/components/common/dialog/store";
import { NodeDataState, NodeDBState } from "@/T/typesState";

const nodeTypes = {
  turbo: TurboNode,
  animation: AnimNode,
};

const edgeTypes: EdgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: "turbo",
  markerEnd: "edge-circle",
};

const useFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDBState>(
    course.flow.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(course.flow.edges);

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

  const onConnect = useCallback(() => {}, []);

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
