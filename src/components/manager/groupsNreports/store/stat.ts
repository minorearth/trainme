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
import { AllCoursesRawTaskObj } from "@/types";

import { Group, UserReport } from "@/components/manager/types";
import {
  CourseChapterObjReport,
  PivotReport,
  UsersMetaReport,
} from "@/components/manager/types";
import { RichTreeViewItemsSlotProps } from "@mui/x-tree-view/internals";

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
  userstat: UserReport[] = [];
  chaptersobj: CourseChapterObjReport = {};
  groupsdata: Group[] = [];
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

  setGroupData(data: Group[]) {
    this.groupsdata = data;
  }

  setAllCoursesTasksObj(data: AllCoursesRawTaskObj) {
    this.allCoursesTasksObj = data;
  }

  setSnapshot(data: UsersMetaReport) {
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

export default new stat();
