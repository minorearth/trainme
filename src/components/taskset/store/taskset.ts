import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/store/task";
import { updateSCP } from "@/db/localstorage";

import { ETL } from "./ETl";

import {
  nextTaskOrCompleteTestRun,
  nextTask,
  prevTaskNoPts,
  errorCountDownPressed,
} from "@/components/taskset/store/tasksetNavigationMobx";

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
    prevTaskNoPts,
    errorCountDownPressed,
  };
  state: any = { recapTasksIds: [] };

  updateState(data) {
    this.state = { ...this.state, ...data };
    updateSCP({
      taskset: { ...this.state, ...data },
    });
  }

  eraseState() {
    this.state = {};
    this.allTasks = [];
    updateSCP({
      taskset: {},
    });
  }

  setTaskMethods(methods: any) {
    this.actions = methods;
  }

  async setAllTasks(tasks, currid) {
    const tasksETL = await ETL(tasks);
    runInAction(() => {
      this.allTasks = tasksETL;
      task.setCurrTaskData(this.allTasks[currid], currid);
      this.tasknum = tasks.length;
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new taskset();
