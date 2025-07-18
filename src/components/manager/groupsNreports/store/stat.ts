import { makeObservable, makeAutoObservable, reaction } from "mobx";
import {
  addNewGroup,
  changeLabel,
  copyGroupLink,
} from "@/components/manager/groupsNreports/groups/layers/services/servicesTree";
import {
  getAllCoursesTasks,
  getGroups,
  getChaptersObj,
} from "@/components/manager/groupsNreports/groups/layers/services/servicesData";

import {
  showUserReport,
  showCode,
} from "@/components/manager/groupsNreports/reports/userreport/layers/services/services";

import {
  makeSnapshot,
  showReport,
} from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/services";

import user from "@/userlayers/store/user";

import { AllCoursesRawTaskObj, UserReport } from "@/T/Managertypes";
import { CourseChapterObjReport, PivotReport } from "@/T/Managertypes";
import { GroupArr, UsersMetaReportDB } from "@/T/typesDB";

class stat {
  actions = {
    getGroups,
    addNewGroup,
    changeLabel,
    copyGroupLink,
    showUserReport,
    //TODO:move to state
    showCode,
    makeSnapshot,
    showReport,
  };
  userstat: UserReport[] = [];
  chaptersobj: CourseChapterObjReport = {};
  groupsdata: GroupArr[] = [];
  code = "";
  report: PivotReport = {};
  userstatvisible = false;
  reportvisible = false;
  snapshot = {};
  groupSelectedId = "";
  allCoursesTasksObj = {};
  disposeReaction: () => void;

  setUserStat(data: UserReport[]) {
    this.userstat = data;
    this.reportvisible = false;
    this.userstatvisible = true;
  }

  setGroupData(data: GroupArr[]) {
    this.groupsdata = data;
  }

  setAllCoursesTasksObj(data: AllCoursesRawTaskObj) {
    this.allCoursesTasksObj = data;
  }

  setSnapshot(data: UsersMetaReportDB) {
    this.snapshot = data;
  }

  setGroupSelected(groupid: string) {
    this.groupSelectedId = groupid;
  }

  setReport(data: PivotReport) {
    this.report = data;
    this.userstatvisible = false;
    this.reportvisible = true;
  }

  setChaptersObj(data: CourseChapterObjReport) {
    this.chaptersobj = data;
  }

  setCode(data: string) {
    this.code = data;
  }

  constructor() {
    makeAutoObservable(this);
    this.disposeReaction = reaction(
      () => user.userid,
      (userid) => {
        if (userid != "") {
          getAllCoursesTasks();
          getGroups();
          getChaptersObj();
        }
      }
    );
  }

  dispose() {
    this.disposeReaction();
  }
}

const newinstance = new stat();
export default newinstance;
