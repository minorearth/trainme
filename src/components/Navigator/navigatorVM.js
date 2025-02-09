import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
import alertdialog from "@/store/dialog";
import { payChapter } from "@/db/SA/firebaseSA";
import { encrypt2 } from "@/globals/utils/encryption";
import user from "@/store/user";
import stn from "@/globals/settings";
import cowntdownbutton from "@/store/cowntdownbutton";
import progressCircle from "@/components/common/progress/progressStore";

const fullFillProgess = (
  progress,
  chapterFlowNodes,
  edges,
  setTestsStartedPage,
  reLoadFlow
) => {
  const { unlocked, completed, paid, rating, stat } = progress;

  const full = chapterFlowNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      unlocked: unlocked.includes(node.id),
      completed: completed.includes(node.id),
      paid: paid.includes(node.id) || !node.data.unlockpts,
      overflow: stat[node.id]?.sum
        ? stat[node.id].sum >= node.data.maxcoins
        : false,
      rating,
      uid: user.userid,
      action: (data) => {
        const { unlocked, paid, completed, id, unlockpts, uid, overflow } =
          data;
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
              await reLoadFlow();
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
          setTestsStartedPage({ chapter: id, repeat: false, overflow });
        }
        if (unlocked && paid && completed) {
          setTestsStartedPage({ chapter: id, repeat: true, overflow });
        }
      },
    },
  }));
  return full;
};

export const setFlowNodes = async ({
  progress,
  setFlow,
  setTestsStartedPage,
  reLoadFlow,
}) => {
  // progress.current = await getProgress(userid);
  // progress.current = userProgress;
  getDocDataFromCollectionByIdClient("chapters", "lpN57HSZBLZCnP2j9l9L").then(
    (data) => {
      const edges = data.data.chapterFlowEdges;
      const nodes = fullFillProgess(
        progress,
        data.data.chapterFlowNodes,
        edges,
        setTestsStartedPage,
        reLoadFlow
      );
      setFlow({ edges, nodes });
    }
  );
};

export const getTests = async (chapter) => {
  //local, do not remove
  // const filteredTasks = testsall.filter((test) => test.chapterid == chapter);
  const filteredTasks = await getDocDataFromCollectionByIdClient(
    "tasks",
    chapter
  );
  const res = stn.mode.ALL_RIGHT_CODE
    ? filteredTasks.data.tasks.map((task) => ({
        ...task,
        defaultcode: task.rightcode,
      }))
    : filteredTasks.data.tasks;

  return res;
};

export const getTestsRecap = (chapter, recapTasks, tasks) => {
  const filteredTasks = tasks
    .filter((test) => test.chapterid == chapter)
    .filter((test, id) => recapTasks.includes(id));
  return filteredTasks;
};
