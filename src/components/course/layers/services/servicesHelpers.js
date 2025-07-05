import { da } from "@/components/common/dialog/dialogMacro";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import course from "@/components/course/layers/store/course";
import countdownbutton from "@/components/common/CountdownButton/store";
import progressCircle from "@/components/common/splash/store";

//services(local)
import { buyChapter } from "@/components/course/layers/services/services";

const nodeAction = (data) => {
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
    rating,
    tobeunlocked,
  } = data;
  if (!unlocked && !paid) da.info.notpaidblocked();

  if (unlocked && !paid && rating < unlockpts) da.info.nomoneytobuy();

  if (
    unlocked &&
    !paid &&
    rating >= unlockpts &&
    !progressCircle.state.showProgress
  )
    da.info.buy(() => buyChapter({ unlockpts, id }));

  if (!unlocked && paid && !completed) da.info.blocked();

  if (unlocked && paid) {
    countdownbutton.hideButton();
    navigator.actions.openLessonStartPage({
      chapterid: id,
      completed,
      overflow,
      remainsum,
      courseid: course.state.courseid,
      nodemode,
      level,
      tobeunlocked: completed ? [] : tobeunlocked,
    });
  }
};

export const enrichFlowWithUserProgress = ({ nodes, edges, progress }) => {
  const { unlocked, completed, paid, rating, stat } = progress;
  const full = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      unlocked: unlocked.includes(node.id),
      completed: completed.includes(node.id),
      paid: paid.includes(node.id) || !node.data.unlockpts,
      sum: stat[node.id]?.sum || 0,
      remainsum: getRemainSum({ stat, node }),
      tobeunlocked: getTargetsBySource(node.id, edges),
      overflow: stat[node.id]?.sum
        ? stat[node.id].sum >= node.data.maxcoins
        : false,
      rating,
      action: (data) =>
        nodeAction({
          ...data,
          rating,
        }),
    },
  }));
  return { nodes: full, edges };
};

const getTargetsBySource = (src, edges) => {
  return edges.filter((edge) => edge.source == src).map((edge) => edge.target);
};

const getRemainSum = ({ stat, node }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};
