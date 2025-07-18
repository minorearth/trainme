import { checkVersion, cleanUpCSP, getCSP } from "@/db/localstorage";
import { CSP } from "@/T/typesDB";

export const getPersistedState = (currentverson: string): CSP => {
  return checkVersion(currentverson) ? getCSP() : cleanUpCSP();
};
