import { da } from "@/components/common/dialog/dialogMacro";

//globals
import { initials } from "@/components/Navigator/layers/store/initialStates";

//repository
import { getPersistedState } from "@/components/Navigator/layers/repository/repository";
import { checkCoursePaid } from "@/components/courses/layers/repository/repository";

//services(external)
import { getFlow } from "@/components/course/layers/services/services";
import {
  getTasks,
  setTasks,
} from "@/components/taskset/layers/services/services";

//services(local)
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCongratPage,
} from "@/components/Navigator/layers/services/services";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
//

export const loadPTrek = async () => {
  const CSP = getPersistedState();

  if (!CSP) {
    navigator.setStateP(initials.initialState.navigator);
  } else {
    CSP.navigator && navigator.setState(CSP.navigator);
    CSP.taskset && taskset.updateState(CSP.taskset);
    CSP.task && task.setCurrTask(CSP.task.currTaskId);
    CSP.user?.username && user.setUserName(CSP.user.username);
    CSP.user?.progress && user.setProgress(CSP.user.progress);
    CSP.course && course.updateState(CSP.course);
    CSP.champ && champ.setChampId(CSP.champ.champid);

    const page = CSP.navigator?.page || "courses";

    if (page == "champ" || page == "courses") {
      navigator.setStateP(initials.initialState.navigator);
    }

    if (page == "flow") {
      const coursePaid = await checkCoursePaid({
        courseid: CSP.course.courseid,
        uid: user.userid,
      });
      if (coursePaid) {
        await openAndRefreshFlowPage({
          courseid: CSP.course.courseid,
          refetchFlow: true,
        });
      } else openAllCoursePage();
    }

    if (page == "testrun" || page == "lessonStarted") {
      const { nodemode, taskstage, pts, remainsum } = CSP.taskset;
      if (taskstage == "accomplished_suspended") {
        openCongratPage({ success: false });
      }
      if (taskstage == "recap_suspended" && nodemode == "exam") {
        openCongratPage({ success: false });
      } else {
        await recoverTasks({ CSP });
      }
    }

    if (
      (page == "congrat" || page == "testrun" || page == "lessonStarted") &&
      CSP.course.courseid
    ) {
      getFlow({
        courseid: CSP.course.courseid,
        refetchFlow: true,
        progress: CSP.user.progress,
      });
    }
  }
};

const recoverTasks = async ({ CSP }) => {
  const { nodemode, taskstage, level, recapTasksIds, randomsaved, chapterid } =
    CSP.taskset;
  const { champid } = CSP.champ || {};
  const { courseid } = CSP.course;
  const { tasks } = await getTasks({
    nodemode,
    taskstage,
    level,
    randomsaved,
    chapterid,
    userProgress: CSP.user?.progress,
    courseid,
    champid,
    recapTasksIds,
  });
  setTasks({ tasks, taskid: CSP.task.currTaskId });
  if (taskstage == "recap_suspended" && nodemode != "exam") {
    da.info.recap();
    taskset.updateStateP({ taskstage: "recap" });
  }
};
