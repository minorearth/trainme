import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorageDB";
import {
  createChamp,
  joinChamp,
  startChamp,
  captureUsersJoined,
} from "@/components/champ/layers/services/services";

import { ChampuserDB } from "tpconst/T";
import S from "@/globals/settings";

class champ {
  actions: any = {
    createChamp,
    joinChamp,
    startChamp,
    captureUsersJoined,
  };
  champid = "";
  state = {};
  range: number[] = S.CHAMP_RANGE;
  capturingChampstart = false;
  champstarted = false;
  users: ChampuserDB[] = [];
  subscribedChampid = "";
  activeStep = 0;
  createMode = false;

  setActiveStep = (value: number) => {
    this.activeStep = value;
  };

  setCreateMode = (value: boolean) => {
    this.createMode = value;
  };

  eraseStateP() {
    this.range = S.CHAMP_RANGE;
    this.state = {};
    this.champid = "";

    updateSCP({
      champ: { champid: "" },
    });
  }

  setRange = (range: number[]) => {
    this.range = range;
  };

  setCapturingChampstart = (started: boolean) => {
    this.capturingChampstart = started;
  };

  setChampStarted = (started: boolean) => {
    this.champstarted = started;
  };

  setUsers = (users: ChampuserDB[]) => {
    this.users = users;
  };

  setChampIdP(id: string) {
    this.champid = id;
    updateSCP({ champ: { champid: id } });
  }

  setChampId(id: string) {
    this.champid = id;
  }

  setSubscribedChampid(champid: string) {
    this.subscribedChampid = champid;
  }

  constructor() {
    makeAutoObservable(this);
  }
}
const newinstance = new champ();
export default newinstance;
