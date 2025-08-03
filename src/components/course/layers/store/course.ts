import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import { updateSCP } from "@/db/localstorageDB";
import { CourseStatePersisted, FlowState } from "tpconst/T";
import { COURSE_DEFAULTS } from "tpconst/typesdefaults";

const FLOW_DEFAULTS = {
  nodes: [],
  edges: [],
};

class course {
  flow: FlowState = {
    nodes: [],
    edges: [],
  };
  initialFlow: FlowState = {
    nodes: [],
    edges: [],
  };
  state: CourseStatePersisted = COURSE_DEFAULTS;

  eraseStateP() {
    this.flow = FLOW_DEFAULTS;
    this.state = COURSE_DEFAULTS;
    updateSCP({
      course: { courseid: "" },
    });
  }

  setStateP(data: CourseStatePersisted) {
    this.state = data;
    updateSCP({
      course: data,
    });
  }

  setCourseState(data: CourseStatePersisted) {
    this.state = data;
  }

  setFlow = (data: FlowState) => {
    this.flow = data;
  };

  setInitialFlow(data: FlowState) {
    this.initialFlow = data;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const instance = new course();
export default instance;
