import { toJS } from "mobx";

//stores
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import { updateChampPoints } from "@/components/champ/store/champVM";
import champ from "@/components/champ/store/champ";
//

export const setFixed = (error) => {
  const fixed = chapter.state.fixed;
  if (chapter.state.taskstage == "recap" && !error) {
    chapter.updateState({ fixed: fixed ? fixed + 1 : 1 });
  }
};

export const setTaskLog = ({ code, error }) => {
  const tasklog = chapter.state.tasklog;
  const taskuuid = task.currTask.taskuuid;

  const tasklogdata = !error ? { code } : { errorcode: code };
  const prevTasklogdata = Object.keys(tasklog).includes(taskuuid)
    ? tasklog[taskuuid]
    : {};
  const newChapterState = {
    ...chapter.state,
    tasklog: {
      ...tasklog,
      [taskuuid]: {
        ...prevTasklogdata,
        ...tasklogdata,
      },
    },
  };
  chapter.updateState(newChapterState);
};

export const addErrorTaskToRecap = () => {
  const recapTasksIds = [...chapter.state.recapTasksIds, task.currTaskId];
  chapter.updateState({ recapTasksIds });
};

export const setEarned = (error) => {
  const { taskstage, repeat, overflow, nodemode, pts } = chapter.state;
  let income = 0;
  if (overflow) {
    return pts;
  }
  if (!error) {
    if (taskstage == "WIP" && !repeat && nodemode != "renewal") {
      income = 10;
    }
    if (taskstage == "WIP" && !repeat && nodemode == "renewal") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode != "renewal") {
      income = 2;
    }
    if (taskstage == "WIP" && repeat && nodemode == "renewal") {
      income = 1;
    }

    if (taskstage == "recap" && !repeat && nodemode != "renewal") {
      income = 2;
    }

    if (taskstage == "recap" && !repeat && nodemode == "renewal") {
      income = 1;
    }

    if (taskstage == "recap" && repeat) {
      income = 1;
    }
    if (nodemode == "champ") {
      //In order to save champ points on every task execution
      updateChampPoints(income, champ.champid);
    }
  }
  chapter.updateState({ pts: pts + income });
  return pts;
};
