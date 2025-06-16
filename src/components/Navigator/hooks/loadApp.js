import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//data model
import { getCSP } from "@/db/localstorage";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getTextBook,
  getRandomTasksForRepeat,
} from "@/components/chapter/store/chapterTasksVM";

import { getChampTasks } from "@/components/champ/store/champVM";
//

//utils and constants
import { initials } from "./initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import progressStore from "../../common/splash/progressdots/store";
import user from "@/store/user";
import flow from "@/components/course/store/course";
import champ from "@/components/champ/store/champ";
//

import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openTextBook,
  openCongratPage,
  openRecapTasksPage,
} from "@/components/Navigator/store/navigatorMobx";
const useApp = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    //TODO: uncomment
    document.addEventListener("copy", (e) => {
      e.clipboardData.setData("text/plain", "No Copying!");
      e.preventDefault();
    });

    const handleBeforeUnload = (event) => {
      const message = "Вы уверены, что хотите покинуть страницу?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    loadPTrek();
  }, [user]);

  //Initial Load
  const loadPTrek = async () => {
    //TODO:load username
    const CSP = getCSP();
    if (!CSP) {
      navigator.setAppState(initials.initialState.navigator);
    } else {
      CSP.navigator && navigator.setAppState(CSP.navigator);
      CSP.chapter && chapter.updateState(CSP.chapter);
      CSP.task && task.setCurrTask(CSP.task.currTaskId);
      CSP.user && user.setProgress(CSP.user.progress);
      CSP.flow && flow.updateState(CSP.flow);
      CSP.champ && champ.setChampId(CSP.champ.champid);
    }
    const page = CSP?.navigator?.page || "courses";
    if (page == "flow") {
      const coursePaid = await getDataFetch({
        type: "checkcoursepaid",
        data: { courseid: CSP.flow.courseid, uid: user.userid },
      });
      if (coursePaid) {
        await openAndRefreshFlowPage(CSP.flow.courseid);
      } else {
        openAllCoursePage();
      }
    }
    if (page == "testrun" || page == "lessonStarted") {
      recoverLessonInProgress({ CSP });
    }

    if (!page || page == "courses" || page == "champ") {
      navigator.setAppState(initials.initialState.navigator);
    }
    setLoading(false);
    progressStore.setCloseProgress();
  };

  const recoverTasks = async ({ nodemode, taskstage, CSP }) => {
    if (nodemode == "renewal") {
      const { tasksFetched } = await getRandomTasksForRepeat({
        courseid: CSP.flow.courseid,
        levelStart: CSP.chapter.level - 5,
        levelEnd: CSP.chapter.level,
        randomsaved: CSP.chapter.randomsaved,
      });
      return tasksFetched;
    }
    if (nodemode == "addhoc" || nodemode == "newtopic") {
      const tasks = await getAllTasksFromChapter(
        CSP.chapter.chapterid,
        CSP.flow.courseid
      );
      if (taskstage == "recap") {
        const recapTasks = getTasksRecap(CSP.chapter.recapTasksIds, tasks);
        return recapTasks;
      } else return tasks;
    }

    if (nodemode == "champ") {
      const champTasks = await getChampTasks({
        champid: CSP.champ.champid,
      });
      const tasks = champTasks.data.tasks;
      if (taskstage == "recap") {
        const recapTasks = getTasksRecap(CSP.chapter.recapTasksIds, tasks);
        // chapter.setAllTasks(recapTasks, CSP.task.currTaskId);
        return recapTasks;
      } else return tasks;
    }

    if (nodemode == "textbook") {
      const tasks = await getTextBook({
        userProgress: CSP.user.progress,
        courseid: CSP.flow.courseid,
      });
      return tasks;
    }
  };

  const recoverLessonInProgress = async ({ CSP }) => {
    const { nodemode, pts, remainsum, taskstage } = chapter.state;

    // // //for recover purposes
    // navigator.updateAppState({ page: "testrun" });
    // // //
    const tasks = await recoverTasks({ nodemode, taskstage, CSP });

    if (nodemode == "textbook") {
      openTextBook({
        tasks,
      });
    }

    if (taskstage == "recap_suspended") {
      CSP.chapter.nodemode == "renewal"
        ? openCongratPage({ nodemode, pts, remainsum, success: false })
        : openRecapTasksPage({
            chapter: { state: CSP.chapter, allTasks: tasks },
          });
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ nodemode, pts, remainsum, success: false });
    }

    if (taskstage == "recap" || taskstage == "WIP") {
      chapter.setAllTasks(tasks, CSP.task.currTaskId);
    }
  };

  return {
    loading,
  };
};

export default useApp;
