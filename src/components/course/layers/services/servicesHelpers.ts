import { da } from "@/components/common/dialog/dialogMacro";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import countdownbutton from "@/components/common/CountdownButton/store";
import progressCircle from "@/components/common/splash/store";
import user from "@/userlayers/store/user";

//services(local)
import { buyChapter } from "@/components/course/layers/services/services";

import {
  EnrichedNodeData,
  Node,
  TasksetMode,
  UserProgress,
  Edge,
} from "@/types";

const buyAction = ({
  unlocked,
  rating,
  unlockpts,
  chapterid,
}: {
  unlocked: boolean;
  rating: number;
  unlockpts: number;
  chapterid: string;
}) => {
  if (!unlocked) da.info.notpaidblocked();

  if (unlocked && rating < unlockpts) da.info.nomoneytobuy();

  if (unlocked && rating >= unlockpts && !progressCircle.state.showProgress)
    da.info.buy(() => buyChapter({ unlockpts, chapterid }));
};

const nodeAction = (data: EnrichedNodeData) => {
  const {
    unlocked,
    paid,
    completed,
    nodemode,
    level,
    id,
    unlockpts,
    overflow,
    remainsum,
    tobeunlocked,
  } = data;
  const { rating } = user.progress;
  if (!paid) {
    buyAction({ unlocked, rating, unlockpts: unlockpts || -1, chapterid: id });
  } else {
    if (!unlocked && !completed) da.info.blocked();

    if (unlocked) {
      countdownbutton.hideButton();
      navigator.actions.openLessonStartPage({
        chapterData: {
          chapterid: id,
          completed,
          overflow,
          remainsum,
          level,
          tobeunlocked: completed ? [] : tobeunlocked,
        },
        tasksetData: {
          tasksetmode: nodemode as TasksetMode,
          taskstage: "WIP",
          randomsaved: [],
        },
        courseData: { courseid: course.state.courseid },
        champData: { champid: "" },
      });
    }
  }
};

export const enrichFlowWithUserProgress = ({
  nodes,
  edges,
  progress,
}: {
  nodes: Node[];
  edges: Edge[];
  progress: UserProgress;
}) => {
  const { unlocked, completed, paid, stat } = progress;

  const full = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      unlocked: unlocked.includes(node.id),
      completed: completed.includes(node.id),
      paid: paid.includes(node.id) || !node.data.unlockpts,
      remainsum: getRemainSum({ stat, node }),
      sum: stat[node.id]?.sum || 0,
      tobeunlocked: getTargetsBySource({ src: node.id, edges }),
      overflow: stat[node.id]?.sum
        ? stat[node.id].sum >= node.data.maxcoins
        : false,
      action: (data: EnrichedNodeData) => nodeAction(data),
    },
  }));
  return { nodes: full, edges };
};

const getTargetsBySource = ({ src, edges }: { src: string; edges: Edge[] }) => {
  return edges
    .filter((edge: Edge) => edge.source == src)
    .map((edge: Edge) => edge.target);
};

const getRemainSum = ({ stat, node }: { stat: any; node: Node }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};
