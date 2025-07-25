import { makeObservable, makeAutoObservable, reaction, toJS } from "mobx";
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

import { showUserReport } from "@/components/manager/groupsNreports/reports/userreport/layers/services/services";

import {
  makeSnapshot,
  showReport,
} from "@/components/manager/groupsNreports/reports/pivotreport/layers/services/services";

import user from "@/auth/store/user";

import { AllCoursesRawTaskObj, UserReport } from "@/T/Managertypes";
import { PivotReport } from "@/T/Managertypes";
import {
  CourseChapterObjDB,
  GroupArr,
  UsersMetaReportDB,
  UsersMetaReportDBWrapper,
} from "@/T/typesDB";

class stat {
  actions = {
    getGroups,
    addNewGroup,
    changeLabel,
    copyGroupLink,
    showUserReport,
    makeSnapshot,
    showReport,
  };
  userstat: UserReport[] = [];
  chaptersobj: CourseChapterObjDB = {};
  groupsdata: GroupArr[] = [];
  code = "";
  report: PivotReport = {};
  userstatvisible = false;
  reportvisible = false;
  snapshot: UsersMetaReportDB = {};
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

  refreshGroupData(data: GroupArr) {
    this.groupsdata = [...this.groupsdata, data];
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

  setChaptersObj(data: CourseChapterObjDB) {
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

  showCode = (code: string) => {
    this.setCode(code);
  };

  dispose() {
    this.disposeReaction();
  }
}

const newinstance = new stat();
export default newinstance;
