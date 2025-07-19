import { makeObservable, makeAutoObservable, autorun } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCourseFlowPageFromMain,
  openLessonStartPage,
  openTaskSetPage,
  openCongratPage,
  closeCongratPage,
  openTutorial,
  openLoginPageSignOut,
  openChampPage,
  interruptTaskSet,
} from "@/components/Navigator/layers/services/services";
import splash from "@/components/common/splash/store";
import { NavigatorStatePersisted } from "@/T/typesState";
import { PG } from "@/T/typesBasic";

class navigator {
  actions = {
    openAllCoursePage,
    openAndRefreshFlowPage,
    openCourseFlowPageFromMain,
    openLessonStartPage,
    openTaskSetPage,
    openCongratPage,
    closeCongratPage,
    openTutorial,
    openLoginPageSignOut,
    openChampPage,
    interruptTaskSet,
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
