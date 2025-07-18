import { da } from "@/components/common/dialog/dialogMacro";

//globals

//repository
import { getPersistedState } from "@/components/Navigator/layers/repository/repository";
import { checkCoursePaid } from "@/components/courses/layers/repository/repository";

//services(external)
import { getFlow } from "@/components/course/layers/services/services";
import { getTasks } from "@/components/taskset/layers/services/services";

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
import chapter from "@/components/taskset/layers/store/chapter";
import { CSP } from "@/T/typesDB";

//

export const loadPyTrek = async () => {
  const CSP = getPersistedState();
  //TODO:Add checked isInstance for outdated LocalStorage
  if (CSP) {
    CSP.navigator && navigator.setNavigatorState(CSP.navigator);
    CSP.taskset && taskset.setTaskSetState(CSP.taskset);
    CSP.user.username && user.setUserName(CSP.user.username);
    CSP.user.progress && user.setProgress(CSP.user.progress);
    CSP.course && course.setCourseState(CSP.course);
    CSP.champ && champ.setChampId(CSP.champ.champid);
    CSP.chapter && chapter.setChapterState(CSP.chapter);

    const page = CSP.navigator?.page || "courses";

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
      const { tasksetmode, taskstage } = CSP.taskset;
      if (
        taskstage == "accomplished_suspended" ||
        (taskstage == "recap_suspended" && tasksetmode == "exam")
      ) {
        openCongratPage({ success: "fail" });
      } else {
        await recoverTasks({ CSP });
      }
    }

    if (
      (page == "congrat" || page == "testrun" || page == "lessonStarted") &&
      CSP.course.courseid != ""
    ) {
      getFlow({
        courseid: CSP.course.courseid,
        refetchFlow: true,
        progress: CSP.user.progress,
      });
    }
  }
};

const recoverTasks = async ({ CSP }: { CSP: CSP }) => {
  const { tasksetmode, taskstage } = CSP.taskset;
  const { tasks } = await getTasks({
    champData: CSP.champ || {},
    userProgress: CSP.user?.progress,
    courseData: CSP.course,
    chapterData: CSP.chapter,
    tasksetData: CSP.taskset,
  });

  taskset.setTaskSetTasks({ tasks });
  task.setCurrTask(tasks[CSP.taskset.currTaskId]);

  if (taskstage == "recap_suspended" && tasksetmode != "exam") {
    da.info.recap();
    taskset.setTaskSetStateP({ ...taskset.state, taskstage: "recap" });
  }
};
