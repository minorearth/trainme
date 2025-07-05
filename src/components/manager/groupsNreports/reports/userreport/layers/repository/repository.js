import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";
export const getUserMetaDataCA = async (uid) => {
  const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
  return userMeta.data;
};
