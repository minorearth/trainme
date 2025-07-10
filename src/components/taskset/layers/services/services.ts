import { toJS } from "mobx";

//repository(external)
import { saveUserMeta } from "@/userlayers/repository/repositoryUserMeta";
import { getChampTasksDB } from "@/components/champ/layers/repository/repository";

//repository(local)
import {
  getAllTasksFromChapter,
  getTextBookTasks,
  getAllCourseTasks,
} from "@/components/taskset/layers/repository/repository";

//service helpers(local)
import {
  getTasksRecap,
  getRandomTasks,
} from "@/components/taskset/layers/services/servicesHelpers";

import { taskLogToDBFormat } from "@/components/taskset/layers/repository/ETL";

// ETL
import { supplyFilesAndTransform } from "@/components/taskset/layers/services/ETL";

//stores
import taskset from "@/components/taskset/layers/store/taskset";
import chapter from "@/components/taskset/layers/store/chapter";
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";

//types
import {
  RawTask,
  Task,
  TaskStage,
  UserProgress,
  TasksetMode,
  TasksetStateChapter,
} from "@/types";

import { TasksetState, ChapterState, ChampState, CourseState } from "@/types";

interface GetTasksResult {
  tasks: Task[];
  tasksuuids: string[];
}

interface getTasksParams {
  tasksetData: TasksetState;
  chapterData: ChapterState;
  champData: ChampState;
  courseData: CourseState;
  userProgress: UserProgress;
}

export const getTasks = async ({
  champData,
  userProgress,
  courseData,
  chapterData,
  tasksetData,
}: getTasksParams): Promise<GetTasksResult> => {
  const { courseid = "" } = courseData;
  const {
    tasksetmode,
    taskstage,
    recapTasksIds = [],
    randomsaved = [],
  } = tasksetData;
  const { level, chapterid } = chapterData;
  const { champid } = champData;
  if (tasksetmode == "champ")
    return await getChampTasks({
      champid,
      taskstage,
      recapTasksIds,
    });

  if (tasksetmode == "textbook") {
    const tasks = await getTextBookTasks({
      completed: userProgress.completed,
      courseid,
    });
    return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
  }
  if (tasksetmode == "exam") {
    const { tasksuuids, tasksFetched } = await getExamTasks({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved,
    });
    return { tasks: tasksFetched, tasksuuids };
  }
  if (tasksetmode == "addhoc" || tasksetmode == "newtopic") {
    const tasks = await getAllTasksFromChapter(chapterid, courseid);
    if (taskstage == "recap" || taskstage == "recap_suspended") {
      const recapTasks = await supplyFilesAndTransform(
        getTasksRecap({ recapTasksIds, tasks })
      );
      return { tasks: recapTasks, tasksuuids: [] };
    } else
      return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
  } else return { tasks: [], tasksuuids: [] };
};

interface getRandomTasksForChampParams {
  levelStart: number;
  levelEnd: number;
  taskCount: number;
  courseid: string;
}

export const getRandomTasksForChamp = async ({
  levelStart,
  levelEnd,
  taskCount,
  courseid,
}: getRandomTasksForChampParams) => {
  const allTasks = await getAllCourseTasks(courseid);

  const randomTasks = getRandomTasks({
    allTasks,
    levelStart,
    levelEnd,
    num: taskCount,
  });

  return randomTasks;
};

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
  const allTasks: RawTask[] = await getAllCourseTasks(courseid);

  if (randomsaved && randomsaved?.length != 0) {
    const savedTasks = allTasks.filter((task: RawTask) =>
      randomsaved.includes(task.taskuuid)
    );
    return {
      tasksuuids: randomsaved,
      tasksFetched: await supplyFilesAndTransform(savedTasks),
    };
  } else {
    const randomTasks = getRandomTasks({
      allTasks,
      levelStart,
      levelEnd,
      num: 5,
    });
    const tasksFetched = await supplyFilesAndTransform(randomTasks.tasks);
    const tasksuuids = tasksFetched.tasks.map((task: RawTask) => task.taskuuid);
    return { tasksuuids, tasksFetched };
  }
};

interface saveProgress {
  success: boolean;
}
export const saveProgress = async ({ success }: saveProgress) => {
  const { pts, tasklog } = taskset.state;
  const { chapterid, tobeunlocked, completed } = chapter.chapter;
  const progress = user.progress as UserProgress;
  const { unlocked, rating, stat, completed: completedChapters } = progress;
  //TODO: (not captured)После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
  let dataToEncrypt;
  const courseid = course.state.courseid;
  const tasklogPrepared = taskLogToDBFormat(courseid, chapterid, tasklog);
  console.log("iii", stat[chapterid], chapterid, toJS(progress));
  dataToEncrypt = {
    [`courses.${courseid}.rating`]: rating + pts,
    [`courses.${courseid}.stat.${chapterid}.sum`]:
      (stat[chapterid]?.sum ?? 0) + pts,
    ...tasklogPrepared,
  };
  if (!completed && success) {
    dataToEncrypt = {
      ...dataToEncrypt,
      [`courses.${courseid}.completed`]: [...completedChapters, chapterid],
      //all unlocked chapters(more than completed by lastunlocked)
      [`courses.${courseid}.unlocked`]: [...unlocked, ...tobeunlocked],
      //next chapters after just completed
      [`courses.${courseid}.lastunlocked`]: tobeunlocked,
    };
  }

  try {
    await saveUserMeta({ data: dataToEncrypt, id: user.userid });
  } catch (e) {
    throw new Error("Server error");
  }
};

interface getChampTasksParams {
  champid: string;
  taskstage: TaskStage;
  recapTasksIds: number[];
}

const getChampTasks = async ({
  champid,
  taskstage,
  recapTasksIds,
}: getChampTasksParams): Promise<GetTasksResult> => {
  const rawTasks: RawTask[] = await getChampTasksDB({
    champid,
  });
  if (taskstage == "recap" || taskstage == "recap_suspended") {
    const rawRecapTasks = getTasksRecap({
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
