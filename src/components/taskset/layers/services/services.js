import { toJS } from "mobx";

//repository(external)
import { saveUserMeta } from "@/userlayers/repository/repositoryUserMeta";
import { getChampTasks } from "@/components/champ/layers/repository/repository";

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

//

export const getTasks = async ({
  champid,
  userProgress,
  courseid,
  level,
  chapterid,
  nodemode,
  recapTasksIds = [],
  taskstage = "",
  randomsaved,
}) => {
  if (nodemode == "champ") {
    const tasks = await getChampTasks({
      champid,
    });
    if (taskstage == "recap" || taskstage == "recap_suspended") {
      const recapTasks = getTasksRecap(recapTasksIds, tasks.data.tasks);
      return { tasks: recapTasks, tasksuuids: recapTasksIds };
    } else return { tasks: tasks.data.tasks, tasksuuids: [] };
  }

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
    if (taskstage == "recap" || taskstage == "recap_suspended") {
      const recapTasks = await supplyFilesAndTransform(
        getTasksRecap(recapTasksIds, tasks)
      );
      return { tasks: recapTasks, tasksuuids: recapTasksIds };
    } else
      return { tasks: await supplyFilesAndTransform(tasks), tasksuuids: [] };
  }
};

export const getRandomTasksForChamp = async ({
  levelStart,
  levelEnd,
  taskCount,
  courseid,
}) => {
  const allTasks = await getAllCourseTasks(courseid);

  const filteredTasks = getRandomTasks({
    allTasks,
    levelStart,
    levelEnd,
    num: taskCount,
  });

  return await supplyFilesAndTransform(filteredTasks.data);
};

export const getRandomTasksForExam = async ({
  courseid,
  levelStart,
  levelEnd,
  randomsaved,
}) => {
  const allTasks = await getAllCourseTasks(courseid);

  if (randomsaved && randomsaved?.length != 0) {
    const savedTasks = allTasks.filter((task) =>
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
    const tasksuuids = randomTasks.data.map((task) => task.taskuuid);
    return { tasksuuids, tasksFetched };
  }
};

export const setTasks = ({ tasks, taskid }) => {
  taskset.setAllTasks(tasks, taskid);
};

export const updateTasksetState = (props) => {
  const taskSetState = getTasksetState({
    ...props,
  });

  taskset.updateStateP(taskSetState);
};

export const saveProgress = async ({ success }) => {
  const { chapterid, tobeunlocked, pts, tasklog, completed } = taskset.state;
  const { unlocked, rating } = user.progress;
  //TODO: (not captured)После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
  let dataToEncrypt;
  const courseid = course.state.courseid;
  const tasklogPrepared = taskLogToDBFormat(courseid, chapterid, tasklog);

  dataToEncrypt = {
    [`courses.${courseid}.rating`]: rating + pts,
    [`courses.${courseid}.stat.${chapterid}.sum`]:
      (user.progress.stat[chapterid]?.sum ?? 0) + pts,
    ...tasklogPrepared,
  };
  if (!completed && success) {
    dataToEncrypt = {
      ...dataToEncrypt,
      [`courses.${courseid}.completed`]: [
        ...user.progress.completed,
        chapterid,
      ],
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
