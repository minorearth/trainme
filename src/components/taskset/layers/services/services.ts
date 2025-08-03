import { toJS } from "mobx";

//repository(external)
import {
  saveProgressDB,
  saveProgressDBNotCompletedAndSuccess,
  saveUserMeta,
} from "@/db/repository/repositoryFetch";
import { getChampTasksDB } from "tpconst/RP/FB";

//repository(local)
import {
  getAllTasksFromChapter,
  getTextBookTasks,
  getAllCourseTasks,
} from "tpconst/RP/FB";

//service helpers(local)
import {
  getTasksRecap,
  getRandomTasks,
} from "@/components/taskset/layers/services/servicesHelpers";

// ETL
import { supplyFilesAndTransform } from "@/components/taskset/layers/services/ETL";

//stores
import taskset from "@/components/taskset/layers/store/taskset";
import chapter from "@/components/taskset/layers/store/chapter";
import user from "@/auth/store/user";
import course from "@/components/course/layers/store/course";
import {
  ChampStatePersisted,
  ChapterStatePersisted,
  CourseStatePersisted,
  Task,
  TasksetStatePersisted,
} from "tpconst/T";
import { CourseProgressDB, TaskDB, UserMetaDB } from "tpconst/T";
import { ST, TS, TSM } from "tpconst/const";
import { TasksetStage } from "tpconst/T";
import { throwInnerError } from "tpconst/errorHandlers";

//types

interface GetTasksResult {
  tasks: Task[];
  tasksuuids: string[];
}

interface getTasksParams {
  tasksetData: TasksetStatePersisted;
  chapterData: ChapterStatePersisted;
  champData: ChampStatePersisted;
  courseData: CourseStatePersisted;
  userProgress: CourseProgressDB;
}

export const getTasks = async ({
  champData,
  userProgress,
  courseData,
  chapterData,
  tasksetData,
}: getTasksParams): Promise<GetTasksResult> => {
  try {
    const { courseid = "" } = courseData;
    const {
      tasksetmode,
      taskstage,
      recapTasksIds = [],
      randomsaved = [],
    } = tasksetData;
    const { level, chapterid } = chapterData;
    const { champid } = champData;
    if (tasksetmode == TSM.champ)
      return await getChampTasks({
        champid,
        taskstage,
        recapTasksIds,
      });

    if (tasksetmode == TSM.textbook) {
      console.log(userProgress.completed, courseid);
      const tasks = await getTextBookTasks({
        completed: userProgress.completed,
        courseid,
      });
      return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
    }
    if (tasksetmode == TSM.exam) {
      const { tasksuuids, tasksFetched } = await getExamTasks({
        courseid,
        levelStart: level - 5,
        levelEnd: level,
        randomsaved,
      });
      return { tasks: tasksFetched, tasksuuids };
    }
    if (tasksetmode == TSM.addhoc || tasksetmode == TSM.newtopic) {
      const tasks = await getAllTasksFromChapter({ chapterid, courseid });
      if (taskstage == TS.recap || taskstage == TS.recapSuspended) {
        const recapTasks = await supplyFilesAndTransform(
          getTasksRecap({ recapTasksIds, tasks })
        );
        return { tasks: recapTasks, tasksuuids: [] };
      } else
        return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
    } else return { tasks: [], tasksuuids: [] };
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const getRandomTasksForChamp = async ({
  levelStart,
  levelEnd,
  taskCount,
  courseid,
}: {
  levelStart: number;
  levelEnd: number;
  taskCount: number;
  courseid: string;
}) => {
  try {
    const allTasks = await getAllCourseTasks(courseid);

    const randomTasks = getRandomTasks({
      allTasks,
      levelStart,
      levelEnd,
      num: taskCount,
    });

    return randomTasks;
  } catch (error) {
    throw throwInnerError(error);
  }
};

//move all procesure specificinterfaces to props
interface getRandomTasksForExamParams {
  courseid: string;
  levelStart: number;
  levelEnd: number;
  randomsaved: string[];
}

export const getExamTasks = async ({
  courseid,
  levelStart,
  levelEnd,
  randomsaved,
}: getRandomTasksForExamParams) => {
  const allTasks: TaskDB[] = await getAllCourseTasks(courseid);

  if (randomsaved && randomsaved?.length != 0) {
    const savedTasks = allTasks.filter((task: TaskDB) =>
      randomsaved.includes(task.taskuuid)
    );
    return {
      tasksuuids: randomsaved,
      tasksFetched: await supplyFilesAndTransform(savedTasks),
    };
  } else {
    try {
      const randomTasks = getRandomTasks({
        allTasks,
        levelStart,
        levelEnd,
        num: 5,
      });
      const tasksFetched = await supplyFilesAndTransform(randomTasks);
      const tasksuuids = tasksFetched.map((task: TaskDB) => task.taskuuid);
      return { tasksuuids, tasksFetched };
    } catch (e: unknown) {
      throw throwInnerError(e);
    }
  }
};

export const saveProgress = async () => {
  try {
    const { pts, tasklog, success } = taskset.state;
    const { chapterid, tobeunlocked, completed } = chapter.state;
    const progress = user.progress;
    const { unlocked, rating, stat, completed: completedChapters } = progress;
    const courseid = course.state.courseid;

    if (!completed && success == ST.success) {
      await saveProgressDBNotCompletedAndSuccess({
        courseid,
        chapterid,
        tasklog,
        rating,
        pts,
        stat,
        completedChapters,
        unlocked,
        tobeunlocked,
        userid: user.userid,
      });
    } else {
      await saveProgressDB({
        courseid,
        chapterid,
        tasklog,
        rating,
        pts,
        stat,
        userid: user.userid,
      });
    }
  } catch (error) {
    throw throwInnerError(error);
  }
};

interface getChampTasksParams {
  champid: string;
  taskstage: TasksetStage;
  recapTasksIds: number[];
}

const getChampTasks = async ({
  champid,
  taskstage,
  recapTasksIds,
}: getChampTasksParams): Promise<GetTasksResult> => {
  const rawTasks = await getChampTasksDB({
    champid,
  });
  if (taskstage == TS.recap || taskstage == TS.recapSuspended) {
    const rawRecapTasks = getTasksRecap<TaskDB>({
      recapTasksIds,
      tasks: rawTasks,
    });
    const tasks: Task[] = await supplyFilesAndTransform(rawRecapTasks);
    return {
      tasks,
      tasksuuids: [],
    };
  } else {
    const tasks: Task[] = await supplyFilesAndTransform(rawTasks);

    return { tasks, tasksuuids: [] };
  }
};
