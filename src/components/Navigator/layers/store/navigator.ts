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

import { Page, NavigatorState } from "@/types";

// interface INavMethods {
//   /**
//    * Open course flow page
//    * @param courseid - course to show.
//    * @returns nothing.
//    */
//   openAndRefreshFlowPage?: (courseid: string) => void;
// }

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
  state: NavigatorState = { page: "courses" };
  dataloaded = false;
  pyodideloaded = false;
  apploaded = false;

  setPyodideloaded() {
    this.pyodideloaded = true;
  }

  setDataloaded() {
    this.dataloaded = true;
  }

  setStateP(data: NavigatorState) {
    this.state = data;
    updateSCP({
      navigator: data,
    });
  }

  setState(data: NavigatorState) {
    this.state = data;
  }

  //unused
  updateStateP(data: NavigatorState) {
    this.state = { ...this.state, ...data };
    updateSCP({
      navigator: { ...this.state, ...data },
    });
  }

  disposer: () => void;

  constructor() {
    makeAutoObservable(this);
    splash.showAppLoader(true);
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

export default new navigator();
