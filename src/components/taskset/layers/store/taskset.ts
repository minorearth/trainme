import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateSCP } from "@/db/localstorage";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";

import {
  nextTaskOrCompleteTestRun,
  nextTask,
  prevTaskNoPts_admin,
  errorCountDownPressed,
} from "@/components/taskset/layers/services/servicesNavigation";

import chapter from "@/components/taskset/layers/store/chapter";
import {
  TasksetMode,
  Task,
  TasksetState,
  TasksetStateChapter,
  TaskStage,
} from "@/types";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

const DEFAULT_STATE = {
  tasksetmode: "" as TasksetMode,
  taskstage: "" as TaskStage,
};

class taskset {
  tasks: Task[] = [];
  tasknum: number = -1;
  actions: any = {
    nextTaskOrCompleteTestRun,
    nextTask,
    prevTaskNoPts_admin,
    errorCountDownPressed,
  };
  state: TasksetState = DEFAULT_STATE;

  startPageIntro() {
    const { tasksetmode } = this.state;
    const { completed, overflow } = chapter.chapter;

    return getStarPageIntro({
      tasksetmode,
      completed,
      overflow,
    });
  }

  updateStateP(data: TasksetState) {
    this.state = { ...this.state, ...data };
    updateSCP({
      taskset: { ...this.state, ...data },
    });
  }

  setStateP(data: TasksetState) {
    this.state = data;
    updateSCP({
      taskset: data,
    });
  }

  updateState(data: TasksetState) {
    this.state = { ...this.state, ...data };
  }

  eraseStateP() {
    this.state = DEFAULT_STATE;
    this.tasks = [];
    updateSCP({
      taskset: {},
    });
  }

  async setTasks(tasks: Task[], currid: number) {
    runInAction(() => {
      if (tasks.length != 0) {
        console.log("тута", tasks);

        this.tasks = tasks;
        task.setCurrTaskP(tasks[currid], currid);
        this.tasknum = tasks.length;
      }
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new taskset();
