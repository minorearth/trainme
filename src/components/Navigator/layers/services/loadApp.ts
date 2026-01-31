import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "@/tpconst/src/lang";

//globals

//repository
import { getPersistedState } from "@/db/localRepository/repositoryLS";
import { checkCoursePaid } from "@/app/api/apicalls/dataFetch";

//services(external)
import { getFlow } from "@/components/course/layers/services/services";
import { getTasks } from "@/components/unitset/layers/services/services";

//services(local)
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCongratPage,
} from "@/components/Navigator/layers/services/services";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import unitset from "@/components/unitset/layers/store/unitset";
import user from "@/auth/store/user";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/unitset/layers/store/chapter";
import { CSP } from "@/tpconst/src/T";
import { checkVersion } from "@/db/localstorageDB";
import { PG, ST, TS, TSM } from "@/tpconst/src/const";
import S from "@/globals/settings";
import { E_CODES } from "@/tpconst/src/errorHandlers";

//
export const loadPyTrek = async () => {
  const CSP = getPersistedState(S.CURRENT_LS_VERSION);
  CSP.navigator && navigator.setNavigatorState(CSP.navigator);
  CSP.taskset && unitset.setTaskSetState(CSP.taskset);
  CSP.user.username && user.setUserName(CSP.user.username);
  CSP.user.progress && user.setProgress(CSP.user.progress);
  CSP.course && course.setCourseState(CSP.course);
  CSP.champ && champ.setChampId(CSP.champ.champid);
  CSP.chapter && chapter.setChapterState(CSP.chapter);

  const page = CSP.navigator.page;

  if (page == PG.flow) {
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

  if (page == PG.testrun || page == PG.lessonStarted) {
    const { tasksetmode, taskstage } = CSP.taskset;
    if (
      taskstage == TS.accomplishedSuspended ||
      (taskstage == TS.recapSuspended && tasksetmode == TSM.exam)
    ) {
      openCongratPage({ success: ST.fail });
    } else {
      await recoverTasks({ CSP });
    }
  }

  if (
    (page == PG.congrat || page == PG.testrun || page == PG.lessonStarted) &&
    CSP.course.courseid != ""
  ) {
    getFlow({
      courseid: CSP.course.courseid,
      refetchFlow: true,
      progress: CSP.user.progress,
    });
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

  unitset.setTaskSetTasks({ tasks });
  unit.setCurrUnit(tasks[CSP.taskset.currTaskId]);

  if (taskstage == TS.recapSuspended && tasksetmode != TSM.exam) {
    dialogs.basic({
      ...L.ru.msg[E_CODES.RECAP].params,
    });
    unitset.setTaskSetStateP({ ...unitset.state, taskstage: TS.recap });
  }
};
