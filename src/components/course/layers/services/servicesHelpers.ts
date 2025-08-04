import { dialogs } from "@/components/common/dialog/dialogMacro";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import countdownbutton from "@/components/common/CountdownButton/store";
import progressCircle from "@/components/common/splash/store";
import user from "@/auth/store/user";

//services(local)
import { buyChapter } from "@/components/course/layers/services/services";
import { NodeDataState } from "tpconst/T";
import { CourseProgressDB, CourseStatDB, EdgeDB, NodeDB } from "tpconst/T";
import { TASKSET_DEFAULTS } from "tpconst/typesdefaults";
import { TasksetMode } from "tpconst/T";
import { L } from "tpconst/lang";
import { E_CODES } from "tpconst/errorHandlers";

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
  if (!unlocked)
    dialogs.basic({
      ...L.ru.msg[E_CODES.BLOCKED_AND_NOT_PAID].params,
    });

  if (unlocked && rating < unlockpts)
    dialogs.basic({
      ...L.ru.msg[E_CODES.NOT_PAID_NO_MONEY].params,
    });

  if (unlocked && rating >= unlockpts && !progressCircle.shown)
    dialogs.action({
      ...L.ru.msg[E_CODES.NOT_PAID_BUY].params,
      action: () => buyChapter({ unlockpts, chapterid }),
    });
};

const nodeAction = (data: NodeDataState) => {
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
    if (!unlocked && !completed)
      dialogs.basic({
        ...L.ru.msg[E_CODES.CHAPTER_BLOCKED].params,
      });

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
          ...TASKSET_DEFAULTS,
          tasksetmode: nodemode as TasksetMode,
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
  nodes: NodeDB[];
  edges: EdgeDB[];
  progress: CourseProgressDB;
}) => {
  const { unlocked, completed, paid, stat } = progress;

  const full = nodes.map((node: NodeDB) => ({
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
      action: (data: NodeDataState) => nodeAction(data),
    },
  }));
  return { nodes: full, edges };
};

const getTargetsBySource = ({
  src,
  edges,
}: {
  src: string;
  edges: EdgeDB[];
}) => {
  return edges
    .filter((edge: EdgeDB) => edge.source == src)
    .map((edge: EdgeDB) => edge.target);
};

const getRemainSum = ({ stat, node }: { stat: CourseStatDB; node: NodeDB }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};
