import navigator from "@/components/Navigator/layers/store/navigator";
import { CT } from "@/tpconst/src/const";
import { CoursesDBObj } from "@/tpconst/src/T";

export const courses: CoursesDBObj = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    title: "БАЗОВЫЙ КУРС",
    text: "Шаг за шаг с нуля познаем основы программирования на Python",
    completed: true,
    type: CT.course,
    order: 1,
    coursesAction: () =>
      navigator.actions.openCourseFlowPageFromMain(
        "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
      ),
  },

  "a3905595-437e-47f3-b749-28ea5362bd39": {
    title: "ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ",
    text: "Постигаем продвинутые функции языка Python",
    completed: true,
    type: CT.course,
    order: 2,
    coursesAction: () =>
      navigator.actions.openCourseFlowPageFromMain(
        "a3905595-437e-47f3-b749-28ea5362bd39",
      ),
  },
  "08d00469-b5c5-4bdc-8c7c-4971e3dd502f": {
    title: "ГОТОВИМСЯ К ЕГЭ",
    text: "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro",
    completed: true,
    type: CT.course,
    order: 3,
    coursesAction: () =>
      navigator.actions.openCourseFlowPageFromMain(
        "08d00469-b5c5-4bdc-8c7c-4971e3dd502f",
      ),
  },
  777: {
    title: "Чемпионат",
    text: "Хакатон  по программированию на скорость",
    completed: false,
    type: CT.champ,
    order: 4,
    coursesAction: () => navigator.actions.openChampPage(),
  },
};
