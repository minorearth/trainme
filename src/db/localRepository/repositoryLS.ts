//LS
import { checkVersion, cleanUpCSP, getCSP } from "@/db/localstorageDB";

//types
import { CSP } from "@/tpconst/src/T";

//navigator

export const getPersistedState = (currentverson: string): CSP => {
  return checkVersion(currentverson) ? getCSP() : cleanUpCSP();
};
