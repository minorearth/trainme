import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

import alertdialog from "@/components/common/dialog/store";
import { encrypt2 } from "@/globals/utils/encryption";
import user from "@/store/user";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import progressCircle from "@/components/common/splash/progressdots/store";
import { setDataFetch } from "@/db/APIcalls/calls";

export const getTargetsBySource = (src, edges) => {
  return edges.filter((edge) => edge.source == src).map((edge) => edge.target);
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
    uid,
    overflow,
    remainsum,
    openLessonStartPage,
    openAndRefreshFlowPage,
    courseid,
    rating,
    tobeunlocked,
  } = data;
  if (!unlocked && !paid) {
    alertdialog.showDialog(
      "Заблокировано и не оплачено",
      "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела,\nа потом оплатите монетками",
      1,
      () => {}
    );
  }
  if (unlocked && !paid && rating < unlockpts) {
    alertdialog.showDialog(
      "Не  оплачен",
      "Данный раздел не оплачен. Не хватает монет",
      1,
      () => {}
    );
  }
  if (
    unlocked &&
    !paid &&
    rating >= unlockpts &&
    !progressCircle.state.showProgress
  ) {
    alertdialog.showDialog(
      "Не  оплачен",
      "Данный раздел не оплачен. Купить?",
      2,
      async () => {
        progressCircle.setShowProgress(true);
        await setDataFetch({
          type: "paychapter",
          data: encrypt2({
            pts: -unlockpts,
            id,
            uid,
            lastunlocked: id,
            courseid,
          }),
        });
        data.paid = true;
        await openAndRefreshFlowPage(courseid);
        progressCircle.setCloseProgress();
      },
      () => {}
    );
  }
  if (!unlocked && paid && !completed) {
    alertdialog.showDialog(
      "Заблокировано",
      "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела",
      1,
      () => {}
    );
  }

  console.log(unlocked, paid, completed);
  if (unlocked && paid && !completed) {
    countdownbutton.hideButton();
    openLessonStartPage({
      chapterid: id,
      repeat: false,
      overflow,
      remainsum,
      courseid,
      nodemode,
      level,
      tobeunlocked,
    });
  }
  if (unlocked && paid && completed) {
    openLessonStartPage({
      chapterid: id,
      repeat: true,
      overflow,
      remainsum,
      courseid,
      nodemode,
      level,
      tobeunlocked: [],
    });
  }
};

const getRemainSum = ({ stat, node }) => {
  if (!stat[node.id]?.sum) {
    return node.data.maxcoins;
  } else {
    //TODO:
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};

const fullFillProgess = (
  progress,
  chapterFlowNodes,
  edges,
  openLessonStartPage,
  openAndRefreshFlowPage,
  courseid
) => {
  const { unlocked, completed, paid, rating, stat } = progress;
  const full = chapterFlowNodes.map((node) => ({
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
      uid: user.userid,
      action: (data) =>
        nodeAction({
          ...data,
          edges,
          openLessonStartPage,
          openAndRefreshFlowPage,
          courseid,
          rating,
        }),
    },
  }));
  return full;
};

export const setFlowNodes = async ({
  courseid,
  progress,
  openLessonStartPage,
  openAndRefreshFlowPage,
}) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const edges = data.data.chapterFlowEdges;
  const nodes = fullFillProgess(
    progress,
    data.data.chapterFlowNodes,
    edges,
    openLessonStartPage,
    openAndRefreshFlowPage,
    courseid
  );
  const flow = { edges, nodes };
  return flow;
};
