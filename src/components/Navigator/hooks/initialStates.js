export const initials = {
  initialState: {
    navigator: { page: "courses" },
    taskset: {},
    task: { currTaskId: -1 },
  },
  champ: {
    navigator: { page: "champ" },
  },
  champTasks: {
    navigator: { page: "lessonStarted" },
    taskset: {
      recapTasksIds: [],
      taskstage: "WIP",
      nodemode: "champ",
      tasklog: {},
      pts: 0,
    },
    task: { currTaskId: 0 },
  },
  lessonRun: { navigator: { page: "testrun" } },
  textBook: {
    navigator: { page: "lessonStarted" },
    taskset: { nodemode: "textbook" },
    task: { currTaskId: 0 },
  },
  courses: {
    navigator: { page: "courses" },
  },
  regularTasks: {
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
