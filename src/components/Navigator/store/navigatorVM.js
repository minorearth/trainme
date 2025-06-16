import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";
import user from "@/store/user";

const ETLUserProgress = (data) => {
  const stat = Object.keys(data.stat).reduce(
    (acc, chapterid) => ({
      ...acc,
      [chapterid]: {
        sum: data.stat[chapterid].sum,
      },
    }),
    {}
  );
  return {
    ...data,
    stat,
  };
};

export const getUserProgress = async (courseid) => {
  const allUserMeta = await getDataFetch({
    data: { uid: user.userid },
    type: "getusermetadata",
  });
  //TODO:keep only keys needed
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};
