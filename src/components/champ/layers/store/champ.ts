import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  createChamp,
  joinChamp,
  startChamp,
} from "@/components/champ/layers/services/services";

class champ {
  actions: any = {
    createChamp,
    joinChamp,
    startChamp,
  };
  champid = null;
  state = {};
  taskcount = 5;
  range = [1, 30];
  monitoringStarted = false;

  eraseStateP() {
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

  setMonitoringStarted = (started: any) => {
    this.monitoringStarted = started;
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

  setChampIdP(id: any) {
    this.champid = id;
    updateSCP({ champ: { champid: id } });
  }

  setChampId(id: any) {
    this.champid = id;
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new champ();
