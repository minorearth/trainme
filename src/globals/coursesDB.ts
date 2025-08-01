import navigator from "@/components/Navigator/layers/store/navigator";
import { CT } from "tpconst/const";
import { CoursesDBObj } from "tpconst/T";

export const courses: CoursesDBObj = {
  "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0": {
    title: "БАЗОВЫЙ КУРС",
    text: "Шаг за шаг с нуля познаем основы программирования на Python",
    firstchapter: "4680f00b-b586-413c-890a-9669b4b7b1c3",
    completed: true,
    type: CT.course,
    order: 1,
    free: true,
    coursesAction: () =>
      navigator.actions.openCourseFlowPageFromMain(
        "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"
      ),
  },

  "a3905595-437e-47f3-b749-28ea5362bd39": {
    title: "ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ",
    text: "Постигаем продвинутые функции языка Python",
    firstchapter: "d06b8c0d-4837-484a-ad85-9257e0e6af01",
    completed: true,
    type: CT.course,
    order: 2,
    free: true,
    coursesAction: () =>
      navigator.actions.openCourseFlowPageFromMain(
        "a3905595-437e-47f3-b749-28ea5362bd39"
      ),
  },
  555: {
    title: "ГОТОВИМСЯ К ЕГЭ",
    text: "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro",
    firstchapter: "",
    completed: false,
    type: CT.course,
    order: 3,
    free: false,
    coursesAction: () => navigator.actions.openCourseFlowPageFromMain("555"),
  },
  777: {
    title: "Чемпионат",
    text: "Хакатон  по программированию на скорость",
    firstchapter: "",
    completed: false,
    type: CT.champ,
    order: 4,
    free: false,
    coursesAction: () => navigator.actions.openChampPage(),
  },
};
