import { getDataFetch, setDataFetch } from "@/db/APIcalls/calls";
import user from "@/userlayers/store/user";
import { ETLUserProgress } from "@/userlayers/repository/ETL";
import { encrypt2 } from "@/globals/utils/encryption";

export const getUserCourseProgress = async (courseid) => {
  const allUserMeta = await getDataFetch({
    data: { uid: user.userid },
    type: "getusermetadata",
  });
  //TODO:keep only keys needed(later)
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};

export const saveUserMeta = async (dataToEncrypt) => {
  const res = await setDataFetch({
    type: "setusermetadata",
    data: encrypt2(dataToEncrypt),
  });
  if (res == "error") {
    throw new Error("Server error");
  }
};
