import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateKeySCP, updateSCP } from "@/db/localstorage";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";

import {
  nextTaskOrCompleteTestRun,
  nextTask,
  prevTaskNoPts_admin,
  errorCountDownPressed,
} from "@/components/taskset/layers/services/servicesNavigation";

import chapter from "@/components/taskset/layers/store/chapter";
import { TASKSET_DEFAULTS } from "@/T/typesdefaults";
import {
  Task,
  TasksetMode,
  TasksetStage,
  TasksetStatePersisted,
} from "@/T/typesState";

const DEFAULT_STATE = {
  tasksetmode: "" as TasksetMode,
  taskstage: "" as TasksetStage,
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
  state: TasksetStatePersisted = TASKSET_DEFAULTS;

  startPageIntro() {
    const { tasksetmode } = this.state;
    const { completed, overflow } = chapter.chapter;

    return getStarPageIntro({
      tasksetmode,
      completed,
      overflow,
    });
  }

  setStateP(data: TasksetStatePersisted) {
    this.state = data;
    updateSCP({
      taskset: data,
    });
  }

  setTaskSetState(data: TasksetStatePersisted) {
    this.state = data;
  }

  eraseStateP() {
    this.state = TASKSET_DEFAULTS;
    this.tasks = [];
    updateSCP({
      taskset: TASKSET_DEFAULTS,
    });
  }

  async setTasks({ tasks }: { tasks: Task[] }) {
    runInAction(() => {
      if (tasks.length != 0) {
        // this.state.currTaskId = currTaskId;
        this.tasks = tasks;
        this.tasknum = tasks.length;
      }
    });
  }

  switchTaskP = (id: number) => {
    if (id != this.tasks.length) {
      this.state.currTaskId = id;
      task.setCurrTask(this.tasks[id]);
      updateKeySCP(
        {
          taskset: { currTaskId: id },
        },
        "taskset"
      );
    }
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const intsance = new taskset();
export default intsance;
