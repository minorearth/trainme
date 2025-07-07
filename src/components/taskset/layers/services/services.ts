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
  getTasksetState,
  getRandomTasks,
} from "@/components/taskset/layers/services/servicesHelpers";

import { taskLogToDBFormat } from "@/components/taskset/layers/repository/ETL";

// ETL
import { supplyFilesAndTransform } from "@/components/taskset/layers/services/ETL";

//stores
import taskset from "@/components/taskset/layers/store/taskset";
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";

//types
import { RawTask, Task, TaskStage, UserProgress, Nodemode } from "@/types";

interface GetTasksResult {
  tasks: Task[];
  tasksuuids: string[];
}

interface getTasksParams {
  champid: string;
  userProgress: UserProgress;
  courseid: string;
  level: number;
  chapterid: string;
  nodemode: Nodemode;
  recapTasksIds: number[];
  taskstage: TaskStage;
  randomsaved: string[];
}

export const getTasks = async ({
  champid,
  userProgress,
  courseid,
  level,
  chapterid,
  nodemode,
  recapTasksIds = [],
  taskstage,
  randomsaved,
}: getTasksParams): Promise<GetTasksResult | undefined> => {
  if (nodemode == "champ")
    return await getChampTasks({ champid, taskstage, recapTasksIds });

  if (nodemode == "textbook") {
    const tasks = await getTextBookTasks({
      completed: userProgress.completed,
      courseid,
    });
    return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
  }
  if (nodemode == "exam") {
    const { tasksuuids, tasksFetched } = await getRandomTasksForExam({
      courseid,
      levelStart: level - 5,
      levelEnd: level,
      randomsaved,
    });
    return { tasks: tasksFetched, tasksuuids };
  }
  if (nodemode == "addhoc" || nodemode == "newtopic") {
    const tasks = await getAllTasksFromChapter(chapterid, courseid);
    if (
      taskstage == TaskStage.recap ||
      taskstage == TaskStage.recap_suspended
    ) {
      const recapTasks = await supplyFilesAndTransform(
        getTasksRecap({ recapTasksIds, tasks })
      );
      return { tasks: recapTasks, tasksuuids: [] };
    } else
      return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
  }
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

  const filteredTasks = getRandomTasks({
    allTasks,
    levelStart,
    levelEnd,
    num: taskCount,
  });

  return filteredTasks.data;
};

interface getRandomTasksForExamParams {
  courseid: string;
  levelStart: number;
  levelEnd: number;
  randomsaved: string[];
}

export const getRandomTasksForExam = async ({
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
    const tasksFetched = await supplyFilesAndTransform(randomTasks.data);
    const tasksuuids = randomTasks.data.map((task: RawTask) => task.taskuuid);
    return { tasksuuids, tasksFetched };
  }
};

export const updateTasksetState = (props: any) => {
  const taskSetState = getTasksetState({
    ...props,
  });

  taskset.updateStateP(taskSetState);
};

interface saveProgress {
  success: boolean;
}
export const saveProgress = async ({ success }: saveProgress) => {
  const { chapterid, tobeunlocked, pts, tasklog, completed } = taskset.state;
  const progress = user.progress as UserProgress;
  const { unlocked, rating, stat, completed: completedChapters } = progress;
  //TODO: (not captured)После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
  let dataToEncrypt;
  const courseid = course.state.courseid;
  const tasklogPrepared = taskLogToDBFormat(courseid, chapterid, tasklog);

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
  if (taskstage == TaskStage.recap || taskstage == TaskStage.recap_suspended) {
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
