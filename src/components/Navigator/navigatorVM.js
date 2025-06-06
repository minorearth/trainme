import {
  getDocDataFromCollectionByIdClient,
  updatePoinsInChampClient,
  setTaskLogInChampClient,
  getDocDataFromSubCollectionByIdClient,
} from "@/db/domain/domain";

import alertdialog from "@/components/common/dialog/store";
import { encrypt2 } from "@/globals/utils/encryption";
import user from "@/store/user";
import stn from "@/globals/settings";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import progressCircle from "@/components/common/splash/progressdots/store";
import { courses } from "@/globals/courses";
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";
import { getCSP } from "@/db/localstorage";
import { getTargetsBySource } from "./utils";
import { setDataFetch } from "@/db/APIcalls/calls";

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
    openTestsStartedPage,
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
            launchedCourse: courseid,
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

  if (unlocked && paid && !completed) {
    countdownbutton.hideButton();
    openTestsStartedPage({
      chapter: id,
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
    openTestsStartedPage({
      chapter: id,
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
  openTestsStartedPage,
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
          openTestsStartedPage,
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
  setFlow,
  openTestsStartedPage,
  openAndRefreshFlowPage,
}) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const edges = data.data.chapterFlowEdges;
  const nodes = fullFillProgess(
    progress,
    data.data.chapterFlowNodes,
    edges,
    openTestsStartedPage,
    openAndRefreshFlowPage,
    courseid
  );
  const flow = { edges, nodes };
  setFlow(flow);
  return flow;
};

export const getAllTasksFromChapter = async (chapter, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    chapter
  );
  return !tasks.data ? [] : tasks.data.tasks;
};

export const getTextBook = async (CSP, courseid) => {
  const tasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "textbook"
  );
  const unlockedTheory = tasks.data.tasks.filter((item) =>
    CSP.userProgress.completed.includes(item.chapterparentid)
  );
  if (!tasks.data) {
    return [];
  }
  return unlockedTheory;
};

const getRandomTasks = (allTasks, levelStart, levelEnd, num) => {
  const scope = allTasks.filter(
    (task) => task.level <= levelEnd && task.level >= levelStart
  );
  if (scope.length < num) {
    return { status: "error", count: scope.length, data: [] };
  }
  const numbers = getNeverRepeatIntegers(scope.length - 1, num);
  const filteredTasks = scope.filter((task, id) => numbers.includes(id));
  return { status: "ok", data: filteredTasks, count: filteredTasks.length };
};

export const getRandomTasksForRepeat = async ({
  courseid,
  levelStart,
  levelEnd,
}) => {
  const CSP = getCSP();

  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );

  if (CSP.randomsaved && CSP.randomsaved?.length != 0) {
    const filteredTasks = allTasks.data.tasks.filter((task) =>
      CSP.randomsaved.includes(task.taskuuid)
    );
    const tasksuuids = CSP.randomsaved;
    return { tasksuuids, tasksFetched: filteredTasks };
  } else {
    const filteredTasks = getRandomTasks(
      allTasks.data.tasks,
      levelStart,
      levelEnd,
      5
    );

    const tasksuuids = filteredTasks.data.map((task) => task.taskuuid);
    return { tasksuuids, tasksFetched: filteredTasks.data };
  }
};

export const getRandomTasksForChamp = async ({
  levelStart,
  levelEnd,
  taskCount,
  courseid,
}) => {
  const allTasks = await getDocDataFromSubCollectionByIdClient(
    "newtasks",
    courseid,
    "chapters",
    "alltasks"
  );

  const filteredTasks = getRandomTasks(
    allTasks.data.tasks,
    levelStart,
    levelEnd,
    taskCount
  );

  return filteredTasks;
};

export const getChampTasks = async ({ champid }) => {
  const allTasks = await getDocDataFromCollectionByIdClient("champs", champid);
  return allTasks;
};

export const getTestsRecap = (recapTasksIds, tasks) => {
  const filteredTasks = tasks.filter((test, id) => recapTasksIds.includes(id));
  return filteredTasks;
};

export const updateChampPoins = (pts, champid) => {
  updatePoinsInChampClient("champs", { id: user.userid, pts }, champid);
};

export const updateChampTaskLog = (tasklog, champid) => {
  setTaskLogInChampClient("champs", { id: user.userid, tasklog }, champid);
};
