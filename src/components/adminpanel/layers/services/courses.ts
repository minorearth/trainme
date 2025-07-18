import {
  chapterFlowNodes1,
  chapterFlowNodesObj1,
  chapterFlowEdges1,
  chapterFlowNodes2,
  chapterFlowNodesObj2,
  chapterFlowEdges2,
} from "@/app/admin/data/chaptersFlowData";
import { testsall1 } from "@/app/admin/data/course1";
import { testsall2 } from "@/app/admin/data/course2";

export const coursesToLoad = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    chapterFlowNodes: chapterFlowNodes1,
    chapterFlowNodesObj: chapterFlowNodesObj1,
    chapterFlowEdges: chapterFlowEdges1,
    tasksall: testsall1,
  },

  "a3905595-437e-47f3-b749-28ea5362bd39": {
    chapterFlowNodes: chapterFlowNodes2,
    chapterFlowNodesObj: chapterFlowNodesObj2,
    chapterFlowEdges: chapterFlowEdges2,
    tasksall: testsall2,
  },
};
