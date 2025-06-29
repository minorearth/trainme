import { saveUserMeta } from "@/userlayers/repository/repository";
import user from "@/userlayers/store/user";
import taskset from "@/components/taskset/layers/store/taskset";
import course from "@/components/course/layers/store/course";

const prepareTaskLog = (courseid, lastcompleted, tasklog) => {
  let res = {};
  const dest = `courses.${courseid}.stat.${lastcompleted}.tasks`;
  Object.keys(tasklog).forEach(
    (taskuuid) => (res[`${dest}.${taskuuid}`] = tasklog[taskuuid])
  );
  return res;
};

export const saveProgress = async ({ success }) => {
  const { chapterid, tobeunlocked, pts, tasklog, repeat } = taskset.state;
  const { unlocked, completed, rating } = user.progress;
  //TODO: После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
  let dataToEncrypt;
  const courseid = course.state.courseid;
  const tasklogPrepared = prepareTaskLog(courseid, chapterid, tasklog);

  dataToEncrypt = {
    [`courses.${courseid}.rating`]: rating + pts,
    [`courses.${courseid}.stat.${chapterid}.sum`]:
      (user.progress.stat[chapterid]?.sum ?? 0) + pts,
    ...tasklogPrepared,
  };
  if (!repeat && success) {
    dataToEncrypt = {
      ...dataToEncrypt,
      [`courses.${courseid}.completed`]: [...completed, chapterid],
      //all unlocked chapters(more than completed by lastunlocked)
      [`courses.${courseid}.unlocked`]: [...unlocked, ...tobeunlocked],
      //next chapters after just completed
      [`courses.${courseid}.lastunlocked`]: tobeunlocked,
    };
  }

  try {
    await saveUserMeta({ data: dataToEncrypt, uid: user.userid });
  } catch (e) {
    throw new Error("Server error");
  }
};
