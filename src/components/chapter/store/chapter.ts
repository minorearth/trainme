import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/chapter/taskrun/store/task";
import { updateSCP } from "@/db/localstorage";

import { ETL } from "./ETl";
import {
  setRegularTasks,
  setRandomTasksToRepeat,
  setChampTasks,
} from "@/components/chapter/store/chapterUtilsMobx";

import {
  nextTaskOrCompleteTestRun,
  nextTask,
  prevTaskNoPts,
  errorCountDownPressed,
} from "@/components/chapter/store/chapterNavigationMobx";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class chapter {
  allTasks: any = [];
  tasknum: number = -1;
  actionsTsk: any = {
    setRegularTasks,
    setRandomTasksToRepeat,
    setChampTasks,
    nextTaskOrCompleteTestRun,
    nextTask,
    prevTaskNoPts,
    errorCountDownPressed,
  };
  state: any = { recapTasksIds: [] };
  flow: any = {};

  updateState(data) {
    this.state = { ...this.state, ...data };
    updateSCP({
      chapter: { ...this.state, ...data },
    });
  }

  eraseState() {
    this.state = {};
    updateSCP({
      chapter: {},
    });
  }

  setTaskMethods(methods: any) {
    this.actionsTsk = methods;
  }

  setFlow(data) {
    this.flow = data;
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

export default new chapter();
