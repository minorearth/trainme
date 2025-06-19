import { getDataFetch } from "@/db/APIcalls/calls";
import user from "@/store/user";
import { ETLUserProgress } from "@/store/userVM";

export const getUserCourseProgress = async (courseid) => {
  const allUserMeta = await getDataFetch({
    data: { uid: user.userid },
    type: "getusermetadata",
  });
  //TODO:keep only keys needed(later)
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};
