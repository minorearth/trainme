import { encrypt2 } from "@/globals/utils/encryption";
import { setDataFetch } from "@/db/APIcalls/calls";
import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//stores
import user from "@/store/user";
import navigator from "@/components/Navigator/store/navigator";
import course from "@/components/course/store/course";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import progressCircle from "@/components/common/splash/progressdots/store";

import { getRemainSum } from "@/components/taskset/store/utils";

export const enrichFlowWithUserPorgress = ({ nodes, edges, progress }) => {
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
  return full;
};

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
    da.info.buy(buyChapter({ unlockpts, id, uid: user.userid }));

  if (!unlocked && paid && !completed) da.info.blocked();

  if (unlocked && paid) {
    countdownbutton.hideButton();
    navigator.actions.openLessonStartPage({
      chapterid: id,
      //TODO:replace repeat on Reviewed
      repeat: completed,
      overflow,
      remainsum,
      courseid: course.state.courseid,
      nodemode,
      level,
      tobeunlocked: completed ? [] : tobeunlocked,
    });
  }
};

const getTargetsBySource = (src, edges) => {
  return edges.filter((edge) => edge.source == src).map((edge) => edge.target);
};

const buyChapter = async ({ unlockpts, id, uid }) => {
  progressCircle.setShowProgress(true);
  await setDataFetch({
    type: "paychapter",
    data: encrypt2({
      pts: -unlockpts,
      id,
      uid,
      lastunlocked: id,
      courseid: course.state.courseid,
    }),
  });
  // data.paid = true;
  await navigator.actions.openAndRefreshFlowPage({
    courseid: course.state.courseid,
    refetchFlow: false,
  });

  progressCircle.setCloseProgress();
};
