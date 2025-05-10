import { courses } from "@/globals/courses";

const allChaptersToObject = (chapters) => {
  return chapters.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.chapterid]: {
        ...acc[task.chapterid],
        [task.taskuuid]: { ...task },
      },
    }),
    {}
  );
};

export const allTasksToObject = (allTasks) => {
  return allTasks.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.chapterid]: {
        ...acc[task.chapterid],
        [task.taskuuid]: { ...task },
      },
    }),
    {}
  );
};

export const arrToObject = (data) => {
  const obj = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: {
        label: item.label,
        isFolder: item.isFolder,

        children: item.children.reduce(
          (acc, child) => ({
            ...acc,
            [child.id]: {
              label: child.label,
              isFolder: child.isFolder,
              uid: child.uid || NaN,
            },
          }),
          {}
        ),
      },
    }),
    {}
  );
  return obj;
};

export const objectToArr = (data) => {
  const arr = Object.keys(data).map((id) => ({
    id,
    label: data[id].label,
    isFolder: data[id].isFolder,
    children: Object.keys(data[id].children).map((id2) => ({
      id: id2,
      label: data[id].children[id2].label,
      isFolder: data[id].children[id2].isFolder,
      uid: data[id].children[id2].uid,
    })),
  }));
  return arr;
};

// data = [
//   {
//     id: "0",
//     label: "Data Grid",
//     isFolder: true,
//     children: [
//       { id: "grid-community", label: "@mui/x-data-grid" },
//       { id: "grid-pro", label: "@mui/x-data-grid-pro" },
//       { id: "grid-premium", label: "@mui/x-data-grid-premium" },
//     ],
//   },

export const getTreeRepresent = (userstat, chaptersobj) => {
  const res = Object.keys(userstat).map((courseId) => ({
    id: courseId,
    label: courses[courseId].title,
    children: [
      {
        id: `${courseId}1`,
        label: "Завершенные темы",
        children: userstat[courseId].completed.map((chapterId) => ({
          id: `${chapterId}completed`,
          label: chaptersobj[courseId][chapterId].title,
        })),
      },
      {
        id: `${courseId}2`,
        label: "Статистика",
        children: Object.keys(userstat[courseId].stat).map((chapterId) => ({
          id: `${chapterId}stat`,
          label: chaptersobj[courseId][chapterId].title,
          children: Object.keys(userstat[courseId].stat[chapterId]).map(
            (taskid) => ({
              id: `${taskid}`,
              label: "Задача",
            })
          ),
        })),
      },
    ],
  }));
  return res;
};
