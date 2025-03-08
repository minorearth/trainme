import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
import alertdialog from "@/store/dialog";
import { payChapter } from "@/db/SA/firebaseSA";
import { encrypt2 } from "@/globals/utils/encryption";
import user from "@/store/user";
import stn from "@/globals/settings";
import cowntdownbutton from "@/store/cowntdownbutton";
import progressCircle from "@/components/common/progress/progressStore";
import { courses } from "@/globals/courses";

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
      remainsum: !stat[node.id]?.sum
        ? node.data.maxcoins
        : node.data.maxcoins - stat[node.id]?.sum || 0,
      // remainsum: node.data.maxcoins,

      overflow: stat[node.id]?.sum
        ? stat[node.id].sum >= node.data.maxcoins
        : false,
      rating,
      uid: user.userid,
      action: (data) => {
        const {
          unlocked,
          paid,
          completed,
          id,
          unlockpts,
          uid,
          overflow,
          remainsum,
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
                encrypt2({ pts: -unlockpts, id, uid, lastunlocked: [id] })
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
          });
        }
        if (unlocked && paid && completed) {
          setTestsStartedPage({
            chapter: id,
            repeat: true,
            overflow,
            remainsum,
            courseid,
          });
        }
      },
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
  //local, do not remove
  // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
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

export const getTestsRecap = (chapter, recapTasks, tasks) => {
  const filteredTasks = tasks
    .filter((test) => test.chapterid == chapter)
    .filter((test, id) => recapTasks.includes(id));
  return filteredTasks;
};
