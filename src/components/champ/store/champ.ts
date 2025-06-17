import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import { openAllCoursePage } from "@/components/Navigator/store/navigatorMobx";

class champ {
  actions: any = {
    // openAllCoursePage,
  };
  champid = null;
  state = {};
  taskcount = 5;
  range = [1, 30];

  eraseState() {
    this.range = [1, 30];
    this.taskcount = 5;
    this.state = {};
    this.champid = null;
    updateSCP({
      champ: {},
    });
  }

  setRange = (range: any) => {
    this.range = range;
  };

  setState(data: any) {
    this.state = data;
  }

  changeTaskCount = (e: any) => {};

  setTaskCount(taskcount: any) {
    if (/^\d{0,2}$/.test(taskcount)) this.taskcount = taskcount;
  }

  getChampId() {
    return this.champid;
  }

  setChampId(id: any) {
    this.champid = id;
    updateSCP({ champ: { champid: id } });
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new champ();
