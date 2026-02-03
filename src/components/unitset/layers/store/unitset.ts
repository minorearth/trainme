import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import unit from "@/components/unitset/unitrun/layers/store/unit";

import { updateKeySCP, updateSCP } from "@/db/localstorageDB";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";

import {
  nextUnitOrCompleteUnitsRun,
  errorCountDownPressed,
} from "@/components/unitset/layers/services/servicesNavigation";

import chapter from "@/components/unitset/layers/store/chapter";
import { UNITSET_DEFAULTS } from "@/tpconst/src/typesdefaults";
import { UnitsetStatePersisted, Unit } from "@/tpconst/src/T";
import { STT } from "@/tpconst/src/const";
import { UnitsetMode, UnitsetStage } from "@/tpconst/src/T";

class unitset {
  units: Unit[] = [];
  unitsnum: number = -1;
  nextdisabled: boolean = false;
  prevdisabled: boolean = true;
  actions = {
    nextUnitOrCompleteUnitsRun,
    errorCountDownPressed,
  };
  state: UnitsetStatePersisted = UNITSET_DEFAULTS;

  startPageIntro() {
    const { unitsetmode } = this.state;
    const { completed, overflow } = chapter.state;
    this.nextdisabled = false;

    return getStarPageIntro({
      unitsetmode,
      completed,
      overflow,
    });
  }

  setUnitSetStateP(data: UnitsetStatePersisted) {
    this.state = data;
    updateSCP({
      unitset: data,
    });
  }

  setUnitSetState(data: UnitsetStatePersisted) {
    this.state = data;
  }

  eraseUnitSetStateP() {
    this.state = UNITSET_DEFAULTS;
    this.units = [];
    updateSCP({
      unitset: UNITSET_DEFAULTS,
    });
  }

  async setUnitSetUnits({ units }: { units: Unit[] }) {
    runInAction(() => {
      if (units.length != 0) {
        this.units = units;
        this.unitsnum = units.length;
        this.refreshNavButtons();
      }
    });
  }

  switchTaskP = (id: number) => {
    if (id != this.units.length) {
      this.state.currUnitId = id;
      unit.setCurrUnit(this.units[id]);
      updateKeySCP(
        {
          unitset: { currUnitId: id },
        },
        STT.unitset,
      );
    }
  };

  gotoLastUnit = () => {
    this.switchTaskP(this.units.length - 1);
  };

  refreshNavButtons = () => {
    this.nextdisabled = this.state.currUnitId >= this.unitsnum - 1;
    this.prevdisabled = this.state.currUnitId <= 0;
  };

  nextUnit = () => {
    this.switchTaskP(this.state.currUnitId + 1);
    this.refreshNavButtons();
  };

  prevUnitNoPts_admin = () => {
    this.switchTaskP(this.state.currUnitId - 1);
    this.refreshNavButtons();
  };

  nextUnitNoPts_admin = () => {
    this.switchTaskP(this.state.currUnitId + 1);
    this.refreshNavButtons();
  };

  setCurrUnitCSPOnly = (id: number) => {
    updateKeySCP(
      {
        unitset: { currUnitId: id },
      },
      STT.unitset,
    );
  };

  addErrorTaskToRecap = ({
    data,
    cspcurrtask,
  }: {
    data?: Partial<UnitsetStatePersisted>;
    cspcurrtask: number;
  }) => {
    const datastate = {
      ...this.state,
      ...data,
      recapTasksIds: [...this.state.recapTasksIds, this.state.currUnitId],
    };
    this.setUnitSetState(datastate);
    updateSCP({ unitset: { ...datastate, currUnitId: cspcurrtask } });
    // this.setCurrTaskCSPOnly();
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const intsance = new unitset();
export default intsance;
