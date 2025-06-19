import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";

//data model
import { getCSP } from "@/db/localstorage";
import { getDataFetch } from "@/db/APIcalls/calls";

//
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getTextBook,
  getRandomTasksForRepeat,
} from "@/components/taskset/store/tasksetTasksVM";

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
import progressStore from "../../common/splash/progressdots/store";
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
    //TODO:load username
    const CSP = getCSP();
    if (!CSP) {
      navigator.setState(initials.initialState.navigator);
    } else {
      CSP.navigator && navigator.setState(CSP.navigator);
      CSP.taskset && taskset.updateState(CSP.taskset);
      CSP.task && task.setCurrTask(CSP.task.currTaskId);
      CSP.user && user.setProgress(CSP.user.progress);
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
      recoverTasksInProgress({ CSP });
    }

    if (!page || page == "courses" || page == "champ") {
      navigator.setState(initials.initialState.navigator);
    }

    if (page == "congrat" || page == "testrun" || page == "lessonStarted") {
      getInitialFlow({ courseid: CSP.course.courseid, refetchFlow: true });
    }

    setLoading(false);
    progressStore.setCloseProgress();
  };

  const recoverTasks = async ({ nodemode, taskstage, CSP }) => {
    if (nodemode == "renewal") {
      const { tasksFetched } = await getRandomTasksForRepeat({
        courseid: CSP.course.courseid,
        levelStart: CSP.taskset.level - 5,
        levelEnd: CSP.taskset.level,
        randomsaved: CSP.taskset.randomsaved,
      });
      return tasksFetched;
    }
    if (nodemode == "addhoc" || nodemode == "newtopic") {
      const tasks = await getAllTasksFromChapter(
        CSP.taskset.chapterid,
        CSP.course.courseid
      );
      if (taskstage == "recap") {
        const recapTasks = getTasksRecap(CSP.taskset.recapTasksIds, tasks);
        return recapTasks;
      } else return tasks;
    }

    if (nodemode == "champ") {
      const champTasks = await getChampTasks({
        champid: CSP.champ.champid,
      });
      const tasks = champTasks.data.tasks;
      if (taskstage == "recap") {
        const recapTasks = getTasksRecap(CSP.taskset.recapTasksIds, tasks);
        return recapTasks;
      } else return tasks;
    }

    if (nodemode == "textbook") {
      const tasks = await getTextBook({
        userProgress: CSP.user.progress,
        courseid: CSP.course.courseid,
      });
      return tasks;
    }
  };

  const recoverTasksInProgress = async ({ CSP }) => {
    const { nodemode, pts, remainsum, taskstage } = taskset.state;
    const tasks = await recoverTasks({ nodemode, taskstage, CSP });

    if (nodemode == "textbook") {
      openTextBook({
        tasks,
      });
    }

    if (taskstage == "recap_suspended") {
      CSP.taskset.nodemode == "renewal"
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

  return {
    loading,
  };
};

export default useApp;
