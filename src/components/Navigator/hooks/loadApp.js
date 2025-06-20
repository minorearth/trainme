import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";

//data model
import { getCSP } from "@/db/localstorage";
import { getDataFetch } from "@/db/APIcalls/calls";
import { getTasks } from "@/components/taskset/store/services";

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getTextBook,
  getRandomTasksForRepeat,
} from "@/components/taskset/store/repository";

import { getChampTasks } from "@/components/champ/store/champVM";
import { getInitialFlow } from "@/components/course/store/courseFlowVM";
//

//utils and constants
import { initials } from "./initialStates";
import {
  startListeners,
  stopListeners,
} from "@/components/Navigator/hooks/listeners";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/taskset/taskrun/store/task";
import taskset from "@/components/taskset/store/taskset";
import progressStore from "@/components/common/splash/progressdots/store";
import user from "@/store/user";
import course from "@/components/course/store/course";
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

  useEffect(() => {
    startListeners();
    loadPTrek();
    return () => {
      stopListeners();
    };
  }, [user]);

  const loadPTrek = async () => {
    const CSP = getCSP();
    if (!CSP) {
      navigator.setState(initials.initialState.navigator);
    } else {
      CSP.navigator && navigator.setState(CSP.navigator);
      CSP.taskset && taskset.updateState(CSP.taskset);
      CSP.task && task.setCurrTask(CSP.task.currTaskId);
      CSP.user?.username && user.setUserNameNP(CSP.user.username);
      CSP.user?.progress && user.setProgressNP(CSP.user.progress);
      CSP.course && course.updateState(CSP.course);
      CSP.champ && champ.setChampId(CSP.champ.champid);
    }
    const page = CSP?.navigator?.page || "courses";
    if (page == "flow") {
      const coursePaid = await getDataFetch({
        type: "checkcoursepaid",
        data: { courseid: CSP.course.courseid, uid: user.userid },
      });
      if (coursePaid) {
        await openAndRefreshFlowPage({
          courseid: CSP.course.courseid,
          refetchFlow: true,
        });
      } else {
        openAllCoursePage();
      }
    }
    if (page == "testrun" || page == "lessonStarted") {
      recoverTasksAndRoute({ CSP });
    }

    if (!page || page == "courses" || page == "champ") {
      navigator.setState(initials.initialState.navigator);
    }

    if (
      (page == "congrat" || page == "testrun" || page == "lessonStarted") &&
      CSP.course.courseid
    ) {
      getInitialFlow({ courseid: CSP.course.courseid, refetchFlow: true });
    }

    setLoading(false);
    progressStore.setCloseProgress();
  };

  const routeToSpecificAfterTaskRecover = ({
    tasks,
    CSP,
    nodemode,
    taskstage,
    pts,
    remainsum,
  }) => {
    if (nodemode == "textbook") {
      openTextBook({
        tasks,
      });
    }

    if (taskstage == "recap_suspended") {
      nodemode == "renewal"
        ? openCongratPage({ nodemode, pts, remainsum, success: false })
        : openRecapTasksPage({
            taskset: { state: CSP.taskset, allTasks: tasks },
          });
    }

    if (taskstage == "accomplished_suspended") {
      openCongratPage({ nodemode, pts, remainsum, success: false });
    }

    if (taskstage == "recap" || taskstage == "WIP") {
      taskset.setAllTasks(tasks, CSP.task.currTaskId);
    }
  };

  const recoverTasksAndRoute = async ({ CSP }) => {
    const {
      nodemode,
      pts,
      remainsum,
      taskstage,
      level,
      recapTasksIds,
      randomsaved,
      chapterid,
    } = CSP.taskset;
    const { champid } = CSP.champ || {};
    const { courseid } = CSP.course;
    const { tasks } = await getTasks({
      nodemode,
      taskstage,
      level,
      randomsaved,
      chapterid,
      userProgress: CSP.user.progress,
      courseid,
      champid,
      recapTasksIds,
    });
    routeToSpecificAfterTaskRecover({
      tasks,
      CSP,
      nodemode,
      taskstage,
      pts,
      remainsum,
    });
  };

  return {
    loading,
  };
};

export default useApp;
