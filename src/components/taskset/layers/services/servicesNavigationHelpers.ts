import { toJS } from "mobx";

//stores
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import chapter from "@/components/taskset/layers/store/chapter";
import splash from "@/components/common/splash/store";
//

//serviceHelpers(local)
import { getTasksRecap } from "@/components/taskset/layers/services/servicesHelpers";
import { Task } from "@/T/typesState";
import { TaskDB } from "@/T/typesDB";

export const setTaskLog = ({
  code,
  error,
}: {
  code: string;
  error: boolean;
}) => {
  const tasklog = taskset.state.tasklog;
  const taskuuid = task.currTask.taskuuid;
  if (!tasklog[taskuuid]) tasklog[taskuuid] = { code: "", errorcode: "" };
  console.log("task.currTask.taskuuid", task.currTask.taskuuid);
  !error
    ? (tasklog[taskuuid].code = code)
    : (tasklog[taskuuid].errorcode = code);
  return tasklog;
};

export const addErrorTaskToRecap = () => {
  //TODO:remade
  const recapTasksIds = [
    ...taskset.state.recapTasksIds,
    taskset.state.currTaskId,
  ];
  taskset.setStateP({ ...taskset.state, recapTasksIds });
};

export const setRecapTasks = ({
  recapTasksIds,
  tasks,
}: {
  recapTasksIds: number[];
  tasks: Task[];
}) => {
  const recapTasks = getTasksRecap<Task>({
    recapTasksIds,
    tasks,
  });
  taskset.setTasks({ tasks: recapTasks });
  task.setCurrTask(recapTasks[0]);
  taskset.setStateP({ ...taskset.state, taskstage: "recap", currTaskId: 0 });
};

export const setTaskNumErrorFixed = (error: boolean) => {
  const fixed = taskset.state.fixed;
  if (taskset.state.taskstage == "recap" && !error) return fixed + 1;
  if (taskset.state.taskstage == "recap" && error) return fixed;
  return fixed;
};

export const ok = (action = () => {}) => {
  splash.setGotoplayLottie(false, "ok", () => action());
};

export const calcEarned = (error: boolean) => {
  const { tasksetmode, pts = 0, taskstage } = taskset.state;
  const { completed, overflow, remainsum } = chapter.chapter;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !completed && tasksetmode != "exam") {
      income = 10;
    }
    if (taskstage == "WIP" && !completed && tasksetmode == "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && tasksetmode != "exam") {
      income = 2;
    }
    if (taskstage == "WIP" && completed && tasksetmode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && !completed && tasksetmode != "exam") {
      income = 2;
    }

    if (taskstage == "recap" && !completed && tasksetmode == "exam") {
      income = 1;
    }

    if (taskstage == "recap" && completed) {
      income = 1;
    }
    if (
      tasksetmode == "addhoc" ||
      tasksetmode == "newtopic" ||
      tasksetmode == "exam"
    ) {
      return Math.min(pts + income, remainsum);
    }
    if (tasksetmode == "champ") {
      return pts + income;
    } else return 0;
  } else {
    return pts;
  }
};
