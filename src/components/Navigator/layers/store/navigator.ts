import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCourseFlowPageFromMain,
  openLessonStartPage,
  openLessonRunPage,
  openCongratPage,
  closeCongratPage,
  openTutorial,
  openLoginPageSignOut,
  openChampPage,
  interruptTaskSet,
} from "@/components/Navigator/layers/services/services";

interface INavMethods {
  //   openLessonStartPage?: () => void;
  //   openChampPage?: () => void;
  //   openAllCoursePage?: () => void;
  //   openCongratPage?: () => void;
  //   openLessonRunPage?: () => void;
  //   /**
  //    * Open course flow page
  //    * @param courseid - course to show.
  //    * @returns nothing.
  //    */
  //   openAndRefreshFlowPage?: (courseid: string) => void;
  //   setRecapTasks?: () => void;
  //   openSpecChampPage?: () => void;
  //   openCourseFlowPageFromMain?: () => void;
  //   openLoginPageSignOut?: () => void;
  //   openSupportPage?: () => void;
  //   openTutorial?: () => void;
  //   runChamp?: () => void;
  //   closeCongratPage?: () => void;
}

class navigator {
  actions: any = {
    openAllCoursePage,
    openAndRefreshFlowPage,
    openCourseFlowPageFromMain,
    openLessonStartPage,
    openLessonRunPage,
    openCongratPage,
    closeCongratPage,
    openTutorial,
    openLoginPageSignOut,
    openChampPage,
    interruptTaskSet,
  };
  state = {};

  setStateP(data: any) {
    this.state = data;
    updateSCP({
      navigator: data,
    });
  }

  setState(data: any) {
    this.state = data;
  }

  updateStateP(data: any) {
    this.state = { ...this.state, ...data };
    updateSCP({
      navigator: { ...this.state, ...data },
    });
  }

  setNavigationMethods(methods: INavMethods) {
    this.actions = methods;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new navigator();
