import { db } from "@/db/CA/firebaseappClient";

//globals
import stn from "@/globals/settings";

//api calls
import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";
//DB
import { setDocInCollection } from "@/db/CA/firebaseCA";
import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";

//repository
import { getFreeCourses } from "@/components/courses/layers/repository/repository";

//services
import { getInitalDataForFreeCourses } from "@/components/courses/layers/services/services";

//ETL
import { ETLUserProgress } from "@/userlayers/repository/ETL";

//utils
import { encrypt2 } from "@/globals/utils/encryption";
import { UserMeta } from "@/types";

export const getUserMetaCourseProgress = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  const allUserMeta = await getDataFetch({
    data: { id: uid },
    type: "getusermetadata",
  });
  //TODO:(later)keep only keys needed
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};

export const getUserMetaDataCA = async (uid: string) => {
  const userMeta = await getDocDataFromCollectionByIdClient({
    collectionName: "usermeta",
    id: uid,
  });
  return userMeta.data || {};
};

export const saveUserMeta = async (dataToEncrypt: {
  data: UserMeta;
  id: string;
}) => {
  const res = await setDataFetch({
    type: "setusermetadata",
    data: encrypt2(dataToEncrypt),
  });
  if (res == "error") {
    throw new Error("Server error");
  }
};

export const createNewUserMeta = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  const paidcourses = getFreeCourses();
  const courses = getInitalDataForFreeCourses();
  const data = {
    name,
    userId,
    paidcourses,
    courses,
  };
  await setDocInCollection({
    db,
    collectionName: stn.collections.USER_META,
    data,
    id: userId,
  });
};

export const getUserMeta = async (uid: string) => {
  const userMeta = await getDataFetch({
    data: { id: uid },
    type: "getusermetadata",
  });
  return userMeta;
};
