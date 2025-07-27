import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateKeySCP, updateSCP } from "@/db/localstorage";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";

import {
  nextTaskOrCompleteTestRun,
  errorCountDownPressed,
} from "@/components/taskset/layers/services/servicesNavigation";

import chapter from "@/components/taskset/layers/store/chapter";
import { TASKSET_DEFAULTS } from "@/T/typesdefaults";
import { Task, TasksetStatePersisted } from "@/T/typesState";
import { STT } from "@/T/const";
import { TasksetMode, TasksetStage } from "@/T/typesBasic";

const DEFAULT_STATE = {
  tasksetmode: "" as TasksetMode,
  taskstage: "" as TasksetStage,
};

class taskset {
  tasks: Task[] = [];
  tasknum: number = -1;
  nextdisabled: boolean = false;
  prevdisabled: boolean = true;
  actions = {
    nextTaskOrCompleteTestRun,
    errorCountDownPressed,
  };
  state: TasksetStatePersisted = TASKSET_DEFAULTS;

  startPageIntro() {
    const { tasksetmode } = this.state;
    const { completed, overflow } = chapter.state;

    return getStarPageIntro({
      tasksetmode,
      completed,
      overflow,
    });
  }

  setTaskSetStateP(data: TasksetStatePersisted) {
    this.state = data;
    updateSCP({
      taskset: data,
    });
  }

  setTaskSetState(data: TasksetStatePersisted) {
    this.state = data;
  }

  eraseTaskSetStateP() {
    this.state = TASKSET_DEFAULTS;
    this.tasks = [];
    updateSCP({
      taskset: TASKSET_DEFAULTS,
    });
  }

  async setTaskSetTasks({ tasks }: { tasks: Task[] }) {
    runInAction(() => {
      if (tasks.length != 0) {
        this.tasks = tasks;
        this.tasknum = tasks.length;
      }
    });
  }

  switchTaskP = (id: number) => {
    task.editorRef.current?.setValue("");
    if (id != this.tasks.length) {
      this.state.currTaskId = id;
      task.setCurrTask(this.tasks[id]);
      updateKeySCP(
        {
          taskset: { currTaskId: id },
        },
        STT.taskset
      );
    }
  };

  gotoLastTask = () => {
    this.switchTaskP(this.tasks.length - 1);
  };

  setNavButtonsDisabled = () => {
    this.nextdisabled = this.state.currTaskId >= this.tasknum - 1;
    this.prevdisabled = this.state.currTaskId <= 0;
  };

  nextTask = () => {
    this.switchTaskP(this.state.currTaskId + 1);
    this.setNavButtonsDisabled();
  };

  prevTaskNoPts_admin = () => {
    this.switchTaskP(this.state.currTaskId - 1);
    this.setNavButtonsDisabled();
  };

  setCurrTaskCSPOnly = (id: number) => {
    updateKeySCP(
      {
        taskset: { currTaskId: id },
      },
      STT.taskset
    );
  };

  addErrorTaskToRecap = ({
    data,
    cspcurrtask,
  }: {
    data?: Partial<TasksetStatePersisted>;
    cspcurrtask: number;
  }) => {
    const datastate = {
      ...this.state,
      ...data,
      recapTasksIds: [...this.state.recapTasksIds, this.state.currTaskId],
    };
    this.setTaskSetState(datastate);
    updateSCP({ taskset: { ...datastate, currTaskId: cspcurrtask } });
    // this.setCurrTaskCSPOnly();
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const intsance = new taskset();
export default intsance;
