import { db } from "@/db/CA/firebaseappClient";

//globals
import S from "@/globals/settings";

//api calls
import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";
//DB
import {
  getDocDataFromCollectionById,
  setDocInCollection,
} from "@/db/CA/firebaseCA";

//repository
import { getFreeCourses } from "@/components/courses/layers/repository/repository";

//services
import { getInitalDataForFreeCourses } from "@/components/courses/layers/services/services";

//ETL
import { ETLUserProgress } from "@/userlayers/repository/ETL";

//utils
import { encrypt2 } from "@/globals/utils/encryption";
import { CLT, UserMetaDB } from "@/T/typesDB";
import { GetDF, SetDF } from "@/T/typesBasic";

export const getUserMetaCourseProgress = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  const allUserMeta = await getDataFetch<UserMetaDB>({
    data: { id: uid },
    type: GetDF.getusermetadata,
  });
  //TODO:(later)keep only keys needed
  const userProgress = ETLUserProgress(allUserMeta.courses[courseid]);
  return userProgress;
};

export const getUserMetaDataCA = async (uid: string) => {
  const userMeta = await getDocDataFromCollectionById<UserMetaDB>({
    collectionName: CLT.usermeta,
    id: uid,
  });
  return userMeta || {};
};

export const saveUserMeta = async (dataToEncrypt: {
  data: UserMetaDB;
  id: string;
}) => {
  const res = await setDataFetch({
    type: SetDF.setusermetadata,
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
  await setDocInCollection<UserMetaDB>({
    collectionName: CLT.usermeta,
    data,
    id: userId,
  });
};

export const getUserMeta = async (uid: string) => {
  const userMeta = await getDataFetch<UserMetaDB>({
    data: { id: uid },
    type: GetDF.getusermetadata,
  });
  return userMeta;
};
