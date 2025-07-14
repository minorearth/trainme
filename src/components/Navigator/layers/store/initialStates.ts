import { Page } from "@/types";

export const initials = {
  initialState: {
    navigator: { page: "courses" as Page },
    taskset: {},
    task: { currTaskId: -1 },
  },

  champlauncher: {
    navigator: { page: "champ" },
  },

  champ: {
    navigator: { page: "lessonStarted" },
    taskset: {
      recapTasksIds: [],
      taskstage: "WIP",
      tasklog: {},
      pts: 0,
    },
    task: { currTaskId: 0 },
  },
  tasksetpage: { navigator: { page: "testrun" } },
  textbook: {
    navigator: { page: "lessonStarted" },
    taskset: { tasksetmode: "textbook" },
    task: { currTaskId: 0 },
  },
  courses: {
    navigator: { page: "courses" },
  },
  addhoc: {
    navigator: { page: "lessonStarted" },
    taskset: {
      recapTasksIds: [],
      taskstage: "WIP",
      pts: 0,
      tasklog: {},
    },
    task: { currTaskId: 0 },
  },
  exam: {
    navigator: { page: "lessonStarted" },
    taskset: {
      recapTasksIds: [],
      taskstage: "WIP",
      pts: 0,
      tasklog: {},
    },
    task: { currTaskId: 0 },
  },
  newtopic: {
    navigator: { page: "lessonStarted" },
    taskset: {
      recapTasksIds: [],
      taskstage: "WIP",
      pts: 0,
      tasklog: {},
    },
    task: { currTaskId: 0 },
  },
};
