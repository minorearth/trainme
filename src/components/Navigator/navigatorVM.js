import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
import alertdialog from "@/store/dialog";
import { payChapter } from "@/db/SA/firebaseSA";
import { encrypt2 } from "@/globals/utils/encryption";
import user from "@/store/user";
import stn from "@/globals/settings";
import cowntdownbutton from "@/store/cowntdownbutton";
import progressCircle from "@/components/common/progress/progressStore";
import { courses } from "@/globals/courses";
import { getNeverRepeatIntegers } from "@/globals/utils/utilsRandom";

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
    edges,
    setTestsStartedPage,
    loadCourse,
    courseid,
    rating,
  } = data;
  if (!unlocked && !paid) {
    alertdialog.showDialog(
      "Заблокировано и не оплачено",
      "Данный раздел пока заблокирован \
      выполните задания предыдущего раздела, а потом оплатите",
      1,
      () => {}
    );
  }
  if (unlocked && !paid && rating < unlockpts) {
    alertdialog.showDialog(
      "Не  оплачен",
      "Данный раздел не оплачен. Не хватает средств",
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
        await payChapter(
          encrypt2({
            pts: -unlockpts,
            id,
            uid,
            lastunlocked: id,
            launchedCourse: courseid,
          })
        );
        data.paid = true;
        await loadCourse();
        progressCircle.setCloseProgress();
      },
      () => {}
    );
  }
  if (!unlocked && paid && !completed) {
    alertdialog.showDialog(
      "Заблокировано",
      "Данный раздел пока заблокирован \
      выполните задания предыдущего раздела",
      1,
      () => {}
    );
  }

  if (unlocked && paid && !completed) {
    cowntdownbutton.hideButton();
    setTestsStartedPage({
      chapter: id,
      repeat: false,
      overflow,
      remainsum,
      courseid,
      nodemode,
      textbook: false,
      level,
    });
  }
  if (unlocked && paid && completed) {
    setTestsStartedPage({
      chapter: id,
      repeat: true,
      overflow,
      remainsum,
      courseid,
      nodemode,
      textbook: false,
      level,
    });
  }
};

const getRemainSum = ({ stat, node }) => {
  if (!stat[node.id]?.sum) {
    console.log(node.data.maxcoins);
    return node.data.maxcoins;
  } else {
    console.log(node.data.maxcoins - stat[node.id].sum || 0);
    return node.data.maxcoins - stat[node.id].sum || 0;
  }
};

const fullFillProgess = (
  progress,
  chapterFlowNodes,
  edges,
  setTestsStartedPage,
  loadCourse,
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
      overflow: stat[node.id]?.sum
        ? stat[node.id].sum >= node.data.maxcoins
        : false,
      rating,
      uid: user.userid,
      action: (data) =>
        nodeAction({
          ...data,
          edges,
          setTestsStartedPage,
          loadCourse,
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
  setTestsStartedPage,
  loadCourse,
}) => {
  getDocDataFromCollectionByIdClient(
    "chapters",
    courses[courseid].chaptersdoc
  ).then((data) => {
    const edges = data.data.chapterFlowEdges;
    const nodes = fullFillProgess(
      progress,
      data.data.chapterFlowNodes,
      edges,
      setTestsStartedPage,
      loadCourse,
      courseid
    );
    setFlow({ edges, nodes });
  });
};

export const getTestsByMode = async (chapter, courseid) => {
  //local, do not remove
  // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
  const filteredTasks = await getDocDataFromCollectionByIdClient(
    courses[courseid].taskcollection,
    chapter
  );

  if (!filteredTasks.data) {
    return [];
  }
  const res = stn.mode.ALL_RIGHT_CODE
    ? filteredTasks.data.tasks.map((task) => ({
        ...task,
        defaultcode: task.rightcode,
      }))
    : filteredTasks.data.tasks;

  return res;
};

export const getTests = async (chapter, courseid) => {
  //local, do not remove
  // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
  const filteredTasks = await getDocDataFromCollectionByIdClient(
    courses[courseid].taskcollection,
    chapter
  );

  if (!filteredTasks.data) {
    return [];
  }
  const res = stn.mode.ALL_RIGHT_CODE
    ? filteredTasks.data.tasks.map((task) => ({
        ...task,
        defaultcode: task.rightcode,
      }))
    : filteredTasks.data.tasks;

  return res;
};

export const getTextBook = async (chapter, appState, courseid) => {
  const filteredTasks = await getDocDataFromCollectionByIdClient(
    courses[courseid].taskcollection,
    chapter
  );
  const unlockedTheory = filteredTasks.data.tasks.filter((item) =>
    appState.userProgress.completed.includes(item.chapterparentid)
  );

  if (!filteredTasks.data) {
    return [];
  }

  return unlockedTheory;
};

export const getRandomTasks = async ({
  chapter,
  appState,
  courseid,
  level,
  persistStateNoEffect,
}) => {
  const allTasks = await getDocDataFromCollectionByIdClient(
    courses[courseid].taskcollection,
    "alltasks"
  );
  if (!allTasks.data) {
    return [];
  }
  let filteredTasks;
  console.log("appState", appState);

  if (appState.randomsaved.length != 0) {
    filteredTasks = allTasks.data.tasks.filter((task) =>
      appState.randomsaved.includes(task.taskuuid)
    );
  } else {
    const scope = allTasks.data.tasks.filter(
      (task) => task.level <= level && task.level >= level - 5
    );
    const numbers = getNeverRepeatIntegers(scope.length - 1, 5);
    filteredTasks = scope.filter((task, id) => numbers.includes(id));
    const tasksuuids = filteredTasks.map((task) => task.taskuuid);
    console.log("tasksuuids", tasksuuids);
    persistStateNoEffect({ randomsaved: tasksuuids });
  }
  const res = stn.mode.ALL_RIGHT_CODE
    ? filteredTasks.map((task) => ({
        ...task,
        defaultcode: task.rightcode,
      }))
    : filteredTasks;
  return res;
};

export const getTestsRecap = (chapter, recapTasks, tasks) => {
  const filteredTasks = tasks
    // .filter((test) => test.chapterid == chapter)
    .filter((test, id) => recapTasks.includes(id));
  return filteredTasks;
};
