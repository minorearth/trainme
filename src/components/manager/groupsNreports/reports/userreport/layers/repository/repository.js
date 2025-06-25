import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
export const getUserMetaData = async (uid) => {
  const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
  return userMeta.data;
};
