import { saveUserMeta } from "@/userlayers/repository/repository";
import user from "@/userlayers/store/user";
import taskset from "@/components/taskset/layers/store/taskset";
import course from "@/components/course/layers/store/course";

export const saveProgress = async ({ success }) => {
  const { chapterid, tobeunlocked, pts, tasklog, repeat } = taskset.state;
  const { unlocked, completed, rating, lastunlocked } = user.progress;
  //TODO: После фейла запроса из-за отсутвия интернета кнопка сохранить не нажимается(later)
  let dataToEncrypt;
  const common = {
    lastcompleted: chapterid,
    repeat,
    pts: rating + pts,
    uid: user.userid,
    tasklog,
    courseid: course.state.courseid,
    sum: (user.progress.stat[chapterid]?.sum ?? 0) + pts,
  };

  if (success) {
    dataToEncrypt = {
      completed: [...completed, chapterid],
      unlocked: tobeunlocked,
      allunlocked: [...unlocked, ...tobeunlocked],
      ...common,
    };
  } else {
    dataToEncrypt = {
      completed,
      unlocked: lastunlocked,
      allunlocked: unlocked,
      ...common,
    };
  }
  try {
    await saveUserMeta(dataToEncrypt);
  } catch (e) {
    throw new Error("Server error");
  }
};
