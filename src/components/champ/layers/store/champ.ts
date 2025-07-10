import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  createChamp,
  joinChamp,
  startChamp,
  captureUsersJoined,
} from "@/components/champ/layers/services/services";

class champ {
  actions: any = {
    createChamp,
    joinChamp,
    startChamp,
    captureUsersJoined,
  };
  champid = "";
  state = {};
  range = [1, 30];
  capturingChampstart = false;
  champstarted = false;
  users = [];
  subscribedChampid = "";
  activeStep = 0;
  createMode = false;

  setActiveStep = (value: any) => {
    this.activeStep = value;
  };

  setCreateMode = (value: any) => {
    this.createMode = value;
  };

  eraseStateP() {
    this.range = [1, 30];
    this.state = {};
    this.champid = "";
    updateSCP({
      champ: {},
    });
  }

  setRange = (range: any) => {
    this.range = range;
  };

  setCapturingChampstart = (started: boolean) => {
    this.capturingChampstart = started;
  };

  setChampStarted = (started: boolean) => {
    this.champstarted = started;
  };

  setUsers = (users: any) => {
    this.users = users;
  };

  setState(data: any) {
    this.state = data;
  }

  changeTaskCount = (e: any) => {};

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

  setSubscribedChampid(champid: any) {
    this.subscribedChampid = champid;
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new champ();
