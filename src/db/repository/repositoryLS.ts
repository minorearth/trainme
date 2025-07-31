//LS
import { checkVersion, cleanUpCSP, getCSP } from "@/db/localstorage";

//types
import { CSP } from "tpconst/T";

//navigator

export const getPersistedState = (currentverson: string): CSP => {
  return checkVersion(currentverson) ? getCSP() : cleanUpCSP();
};
