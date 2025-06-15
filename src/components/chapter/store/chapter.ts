import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/chapter/taskrun/store/task";

import { ETL } from "./ETl";

interface ITask {
  // openFlowPageAfterAccomplished?: () => void;
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class chapter {
  allTasks: any = [];
  tasknum: number;
  actionsTsk: any;
  state: any = { recapTasksIds: [] };

  updateState(data) {
    this.state = { ...this.state, ...data };
  }

  setTaskMethods(methods: any) {
    this.actionsTsk = methods;
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
