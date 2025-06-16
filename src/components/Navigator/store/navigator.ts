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
  actions: any = {
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
  state = {};

  setAppState(data) {
    this.state = data;
    updateSCP({
      navigator: data,
    });
  }

  updateAppState(data) {
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
