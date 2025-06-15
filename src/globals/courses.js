import {
  chapterFlowNodes1,
  chapterFlowEdges1,
  chapterFlowNodes2,
  chapterFlowEdges2,
} from "@/components/admin/chaptersFlowData";
import { testsall1 } from "@/components/admin/course1";
import { testsall2 } from "@/components/admin/course2";
import navigator from "@/components/Navigator/store/navigator";

export const getReadyCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].completed);
};

export const getCoursesToLoad = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].toload);
};

export const getFreeCourses = () => {
  return Object.keys(courses).filter((courseId) => courses[courseId].free);
};

export const courses = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    title: "БАЗОВЫЙ КУРС",
    text: "Шаг за шаг с нуля познаем основы программирования на Python",
    firstchapter: chapterFlowNodes1[0].data.id,
    chapterFlowNodes: chapterFlowNodes1,
    chapterFlowEdges: chapterFlowEdges1,
    tasksall: testsall1,
    completed: true,
    type: "course",
    order: 1,
    toload: true,
    free: true,
    coursesAction: () =>
      navigator.navMethods.openCourseFlowPageFromMain(
        "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"
      ),
  },

  "a3905595-437e-47f3-b749-28ea5362bd39": {
    title: "ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ",
    text: "Постигаем продвинутые функции языка Python",
    firstchapter: chapterFlowNodes2[0].data.id,
    chapterFlowNodes: chapterFlowNodes2,
    chapterFlowEdges: chapterFlowEdges2,
    tasksall: testsall2,
    completed: true,
    type: "course",
    order: 2,
    toload: true,
    free: true,
    coursesAction: () =>
      navigator.navMethods.openCourseFlowPageFromMain(
        "a3905595-437e-47f3-b749-28ea5362bd39"
      ),
  },
  555: {
    title: "ГОТОВИМСЯ К ЕГЭ",
    text: "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro",
    firstchapter: "",
    chapterFlowNodes: null,
    chapterFlowEdges: null,
    tasksall: null,
    completed: false,
    type: "course",
    order: 3,
    toload: false,
    free: false,
    coursesAction: () => navigator.navMethods.openCourseFlowPageFromMain("555"),
  },
  777: {
    title: "Чемпионат",
    text: "Хакатон  по программированию на скорость",
    firstchapter: "",
    chapterFlowNodes: null,
    chapterFlowEdges: null,
    tasksall: null,
    completed: false,
    type: "champ",
    order: 4,
    toload: false,
    free: false,
    coursesAction: () => navigator.navMethods.openChampPage(),
  },
};
