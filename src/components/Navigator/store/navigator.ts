import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import { loadPTrek } from "@/components/Navigator/hooks/navigatorMobx";
interface INavMethods {
  openFlowPageAfterAccomplished?: () => void;
  openLessonStartPage?: () => void;
  openChampPage?: () => void;
  openAllCoursePage?: () => void;
  openCongratPage?: () => void;
  openLessonRunPage?: () => void;
  openCongratPageInterrupted?: () => void;
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  openAndRefreshFlowPage?: (courseid: string) => void;
  openRecapTasksPage?: () => void;
  openSpecChampPage?: () => void;
  openCourseFlowPageFromMain?: () => void;
  openLoginPageSignOut?: () => void;
  openSupportPage?: () => void;
  openTutorial?: () => void;
  runChamp?: () => void;
  closeCongratPage?: () => void;
}

class navigator {
  navMethods: INavMethods = {};
  requestMethods = {};
  as = {};

  setAppState(data) {
    this.as = data;
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
