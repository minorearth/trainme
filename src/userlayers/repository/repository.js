import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";
import { ETLUserProgress } from "@/userlayers/repository/ETL";
import { encrypt2 } from "@/globals/utils/encryption";
import { getInitalDataForFreeCourses } from "@/userlayers/repository/ETL";

import { setDocInCollection } from "@/db/CA/firebaseCA";
import { db } from "@/db/CA/firebaseappClient";

import stn from "@/globals/settings";
import { getFreeCourses } from "@/components/courses/layers/repository/repository";

import { courses } from "@/globals/courses";

export const getUserCourseProgress = async (courseid, uid) => {
  const allUserMeta = await getDataFetch({
    data: { id: uid },
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

export const createNewUserMeta = async (userId, name) => {
  const freeCourses = getFreeCourses();
  const data = {
    name,
    userId,
    paidcourses: freeCourses,
    courses: getInitalDataForFreeCourses(freeCourses, courses),
  };
  await setDocInCollection(db, stn.collections.USER_META, data, userId);
};
