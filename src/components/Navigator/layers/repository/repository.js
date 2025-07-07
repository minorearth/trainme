import { getCSP } from "@/db/localstorage";

export const getPersistedState = () => {
  return getCSP();
};
