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

class champ {
  actions: any = {
    // openAllCoursePage,
  };
  champid = null;
  state = {};

  setState(data) {
    this.state = data;
  }

  setChampId(id) {
    this.champid = id;
    updateSCP({ champ: { champid: id } });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new champ();
