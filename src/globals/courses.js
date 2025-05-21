import {
  chapterFlowNodes1,
  chapterFlowEdges1,
  chapterFlowNodes2,
  chapterFlowEdges2,
} from "@/components/admin/chaptersFlowData";
import { testsall1 } from "@/components/admin/course1";
import { testsall2 } from "@/components/admin/course2";

export const getReadyCourses = () => {
  return Object.keys(courses).filter(
    (courseId) => courses[courseId].state == "ready"
  );
};

export const getCoursesToLoad = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].toload);
};

export const getFreeCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const courses = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    id: "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
    title: "БАЗОВЫЙ КУРС",
    text: "Шаг за шаг с нуля познаем основы программирования на Python",
    taskcollection: "tasks",
    chaptersdoc: "lpN57HSZBLZCnP2j9l9L",
    textbookchapter: "2e31a4ae-242d-4c55-b801-ef12ccc06013",
    firstchapter: "4680f00b-b586-413c-890a-9669b4b7b1c3",
    chapterFlowNodes: chapterFlowNodes1,
    chapterFlowEdges: chapterFlowEdges1,
    testsall: testsall1,
    state: "ready",
    type: "course",
    order: 1,
    toload: true,
    free: true,
  },
  "a3905595-437e-47f3-b749-28ea5362bd39": {
    id: "a3905595-437e-47f3-b749-28ea5362bd39",
    title: "ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ",
    text: "Постигаем продвинутые функции языка Python",
    taskcollection: "tasks2",
    chaptersdoc: "RlDOeZgfpHfKE2YdH1BS",
    textbookchapter: "21e195e8-af63-4527-826f-b49c8a8b599e",
    firstchapter: "747977df-714b-414a-b086-def87e1fd15d",
    chapterFlowNodes: chapterFlowNodes2,
    chapterFlowEdges: chapterFlowEdges2,
    testsall: testsall2,
    state: "cwip",
    type: "course",
    order: 2,
    toload: true,
    free: true,
  },
  555: {
    id: "555",
    title: "ГОТОВИМСЯ К ЕГЭ",
    text: "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro",
    taskcollection: "",
    chaptersdoc: "",
    textbookchapter: "",
    firstchapter: "",
    chapterFlowNodes: null,
    chapterFlowEdges: null,
    testsall: null,
    state: "empty",
    type: "course",
    order: 3,
    toload: false,
    free: false,
  },
  777: {
    id: "777",
    title: "Чемпионат",
    text: "Хакатон  по программированию на скорость",
    taskcollection: "",
    chaptersdoc: "",
    textbookchapter: "",
    firstchapter: "",
    chapterFlowNodes: null,
    chapterFlowEdges: null,
    testsall: null,
    state: "empty",
    type: "champ",
    order: 4,
    toload: false,
    free: false,
  },
};
