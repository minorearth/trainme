import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateSCP } from "@/db/localstorage";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";

import { ETL } from "@/components/taskset/layers/services/ETL";

import {
  nextTaskOrCompleteTestRun,
  nextTask,
  prevTaskNoPts_admin,
  errorCountDownPressed,
} from "@/components/taskset/layers/services/servicesNavigation";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class taskset {
  allTasks: any = [];
  tasknum: number = -1;
  actions: any = {
    nextTaskOrCompleteTestRun,
    nextTask,
    prevTaskNoPts_admin,
    errorCountDownPressed,
  };
  state: any = { recapTasksIds: [] };

  startPageIntro() {
    const { nodemode, completed, overflow } = this.state;
    return getStarPageIntro({
      nodemode,
      completed,
      overflow,
    });
  }

  updateStateP(data: any) {
    this.state = { ...this.state, ...data };
    updateSCP({
      taskset: { ...this.state, ...data },
    });
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
  }

  eraseStateP() {
    this.state = {};
    this.allTasks = [];
    updateSCP({
      taskset: {},
    });
  }

  setTaskMethods(methods: any) {
    this.actions = methods;
  }

  async setAllTasks(tasks: any, currid: any) {
    console.log("ho3", currid);

    // const tasksETL = tasks;
    runInAction(() => {
      this.allTasks = tasks;
      task.setCurrTaskDataP(tasks[currid], currid);
      this.tasknum = tasks.length;
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new taskset();
