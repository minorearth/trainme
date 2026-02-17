import { makeObservable, makeAutoObservable, autorun } from "mobx";
import { updateSCP } from "@/db/localstorageDB";
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCourseFlowPageFromMain,
  openLessonStartPage,
  openUnitSetPage,
  openCongratPage,
  closeCongratPage,
  openTutorial,
  openLoginPageSignOut,
  openChampPage,
  interruptUnitSet,
  gotoPG,
  gotoCoursespage,
} from "@/components/Navigator/layers/services/services";
import splash from "@/components/common/splash/store";
import { NavigatorStatePersisted } from "@/tpconst/src/T";
import { PG } from "@/tpconst/src/const";

class navigator {
  actions = {
    openAllCoursePage,
    openAndRefreshFlowPage,
    openCourseFlowPageFromMain,
    openLessonStartPage,
    openUnitSetPage,
    openCongratPage,
    closeCongratPage,
    openTutorial,
    openLoginPageSignOut,
    openChampPage,
    interruptUnitSet,
    gotoPG,
    gotoCoursespage,
  };
  state: NavigatorStatePersisted = { page: PG.courses };
  dataloaded = false;
  pyodideloaded = false;
  apploaded = false;

  setPyodideloaded() {
    this.pyodideloaded = true;
  }

  setDataloaded() {
    this.dataloaded = true;
  }

  setStateP(data: NavigatorStatePersisted) {
    this.state = data;
    updateSCP({
      navigator: data,
    });
  }

  setNavigatorState(data: NavigatorStatePersisted) {
    this.state = data;
  }

  //unused
  updateStateP(data: NavigatorStatePersisted) {
    this.state = { ...this.state, ...data };
    updateSCP({
      navigator: { ...this.state, ...data },
    });
  }

  disposer: () => void;

  constructor() {
    makeAutoObservable(this);

    this.disposer = autorun(() => {
      if (this.pyodideloaded && this.dataloaded) {
        splash.closeProgress();
        this.apploaded = true;
        this.disposer();
      }
    });
  }

  dispose() {
    if (this.disposer) {
      this.disposer();
    }
  }
}

const newinstance = new navigator();
export default newinstance;
