import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  openAllCoursePage,
  openAndRefreshFlowPage,
  openCourseFlowPageFromMain,
  openLessonStartPage,
  openTextBook,
  openLessonRunPage,
  openCongratPage,
  closeCongratPage,
  openCongratPageInterrupted,
  openTutorial,
  openRecapTasksPage,
  openLoginPageSignOut,
  openChampPage,
} from "@/components/Navigator/store/navigatorMobx";

// interface INavMethods {
//   openLessonStartPage?: () => void;
//   openChampPage?: () => void;
//   openAllCoursePage?: () => void;
//   openCongratPage?: () => void;
//   openLessonRunPage?: () => void;
//   openCongratPageInterrupted?: () => void;
//   /**
//    * Open course flow page
//    * @param courseid - course to show.
//    * @returns nothing.
//    */
//   openAndRefreshFlowPage?: (courseid: string) => void;
//   openRecapTasksPage?: () => void;
//   openSpecChampPage?: () => void;
//   openCourseFlowPageFromMain?: () => void;
//   openLoginPageSignOut?: () => void;
//   openSupportPage?: () => void;
//   openTutorial?: () => void;
//   runChamp?: () => void;
//   closeCongratPage?: () => void;
// }

class navigator {
  navMethods: any = {
    openAllCoursePage,
    openAndRefreshFlowPage,
    openCourseFlowPageFromMain,
    openLessonStartPage,
    openTextBook,
    openLessonRunPage,
    openCongratPage,
    closeCongratPage,
    openCongratPageInterrupted,
    openTutorial,
    openRecapTasksPage,
    openLoginPageSignOut,
    openChampPage,
  };
  requestMethods = {};
  as = {};

  setAppState(data) {
    this.as = data;
    updateSCP({
      navigator: data,
    });
  }

  updateAppState(data) {
    this.as = { ...this.as, ...data };
    updateSCP({
      navigator: { ...this.as, ...data },
    });
  }

  setNavigationMethods(methods: INavMethods) {
    this.navMethods = methods;
  }

  setRequestMethods(methods) {
    this.requestMethods = methods;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new navigator();
