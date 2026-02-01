import { toJS } from "mobx";

//repository(external)
import {
  saveProgressDB,
  saveProgressDBFull,
} from "@/app/api/apicalls/dataFetch";
import { getChampTasksDB } from "@/tpconst/src/RP/FB";

//repository(local)
import {
  getAllTasksFromChapter,
  getTextBookGuides,
  getAllCourseTasks,
} from "@/tpconst/src/RP/FB";

//service helpers(local)
import {
  getTasksRecap,
  getRandomTasks,
} from "@/components/unitset/layers/services/servicesHelpers";

// ETL
import { supplyFilesAndTransform } from "@/components/unitset/layers/services/ETL";

//stores
import unitset from "@/components/unitset/layers/store/unitset";
import chapter from "@/components/unitset/layers/store/chapter";
import user from "@/auth/store/user";
import course from "@/components/course/layers/store/course";
import {
  ChampStatePersisted,
  ChapterStatePersisted,
  CourseStatePersisted,
  Task,
  UnitsetStatePersisted,
  Unit,
  UnitDB,
} from "@/tpconst/src/T";
import { CourseProgressDB, TaskDB, UserMetaDB } from "@/tpconst/src/T";
import { ST, TS, TSM } from "@/tpconst/src/const";
import { UnitsetStage } from "@/tpconst/src/T";
import { throwInnerError } from "@/tpconst/src/errorHandlers";

//types

interface GetUnitsResult {
  units: Unit[];
  tasksuuids: string[];
}

interface getUnitsParams {
  unitsetData: UnitsetStatePersisted;
  chapterData: ChapterStatePersisted;
  champData: ChampStatePersisted;
  courseData: CourseStatePersisted;
  userProgress: CourseProgressDB;
}

export const getUnits = async ({
  champData,
  userProgress,
  courseData,
  chapterData,
  unitsetData,
}: getUnitsParams): Promise<GetUnitsResult> => {
  try {
    const { courseid = "" } = courseData;
    const {
      unitsetmode,
      unitsetstage,
      recapTasksIds = [],
      randomsaved = [],
    } = unitsetData;
    const { level, chapterid } = chapterData;
    const { champid } = champData;
    if (unitsetmode == TSM.champ)
      return await getChampTasks({
        champid,
        unitsetstage,
        recapTasksIds,
      });

    if (unitsetmode == TSM.textbook) {
      const guides = await getTextBookGuides({
        completed: userProgress.completed,
        courseid,
      });
      return { units: await supplyFilesAndTransform(guides), tasksuuids: [] };
    }
    if (unitsetmode == TSM.exam) {
      const { tasksuuids, tasksFetched } = await getExamTasks({
        courseid,
        levelStart: level - 5,
        levelEnd: level,
        randomsaved,
      });
      return { units: tasksFetched, tasksuuids };
    }
    if (unitsetmode == TSM.addhoc || unitsetmode == TSM.newtopic) {
      const units = await getAllTasksFromChapter({ chapterid, courseid });

      if (unitsetstage == TS.recap || unitsetstage == TS.recapSuspended) {
        const recapTasks = await supplyFilesAndTransform(
          getTasksRecap({ recapTasksIds, units }),
        );
        return { units: recapTasks, tasksuuids: [] };
      } else
        return { units: await supplyFilesAndTransform(units), tasksuuids: [] };
    } else return { units: [], tasksuuids: [] };
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
    }) as TaskDB[];

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
  const allTasks = (await getAllCourseTasks(courseid)) as TaskDB[];

  if (randomsaved && randomsaved?.length != 0) {
    const savedTasks = allTasks.filter((task) =>
      randomsaved.includes(task.unituuid),
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
      const tasksFetched = (await supplyFilesAndTransform(
        randomTasks,
      )) as Task[];
      const tasksuuids = tasksFetched.map((task: TaskDB) => task.unituuid);
      return { tasksuuids, tasksFetched };
    } catch (e: unknown) {
      throw throwInnerError(e);
    }
  }
};

export const saveProgress = async () => {
  try {
    const { pts, tasklog, success } = unitset.state;
    const { chapterid, tobeunlocked, completed } = chapter.state;
    const progress = user.progress;
    const { unlocked, rating, stat, completed: completedChapters } = progress;
    const courseid = course.state.courseid;

    if (!completed && success == ST.success) {
      await saveProgressDBFull({
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
  unitsetstage: UnitsetStage;
  recapTasksIds: number[];
}

const getChampTasks = async ({
  champid,
  unitsetstage,
  recapTasksIds,
}: getChampTasksParams): Promise<GetUnitsResult> => {
  const rawTasks = await getChampTasksDB({
    champid,
  });
  if (unitsetstage == TS.recap || unitsetstage == TS.recapSuspended) {
    const rawRecapTasks = getTasksRecap<TaskDB>({
      recapTasksIds,
      units: rawTasks,
    });
    const tasks = (await supplyFilesAndTransform(rawRecapTasks)) as Task[];
    return {
      units: tasks,
      tasksuuids: [],
    };
  } else {
    const tasks = (await supplyFilesAndTransform(rawTasks)) as Task[];

    return { units: tasks, tasksuuids: [] };
  }
};
