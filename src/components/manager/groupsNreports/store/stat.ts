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
import { GroupObj, Group } from "@/types";
import { CourseChapterObjReport } from "@/components/manager/types";

class stat {
  actions = {
    getGroups,
    addNewGroup,
    changeLabel,
    copyGroupLink,
    showUserReport,
    showCode,
    makeSnapshot,
    showReport,
  };
  userstat = [];
  chaptersobj: CourseChapterObjReport = {};
  groupsdata: Group[] = [];
  code = "";
  report = {};
  userstatvisible = false;
  reportvisible = false;
  snapshot = {};
  groupSelectedId = "";
  allCoursesTasksObj = {};

  setUserStat(data) {
    this.userstat = data;
    this.reportvisible = false;
    this.userstatvisible = true;
  }

  setGroupData(data: Group[]) {
    this.groupsdata = data;
  }

  setAllCoursesTasksObj(data) {
    this.allCoursesTasksObj = data;
  }

  setSnapshot(data) {
    this.snapshot = data;
  }

  setGroupSelected(groupid) {
    this.groupSelectedId = groupid;
  }

  setReport(data) {
    this.report = data;
    this.userstatvisible = false;
    this.reportvisible = true;
  }

  setChaptersObj(data: CourseChapterObjReport) {
    this.chaptersobj = data;
  }

  setCode(data) {
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

export default new stat();
