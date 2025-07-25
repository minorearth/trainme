//LS
import { checkVersion, cleanUpCSP, getCSP } from "@/db/localstorage";

//types
import { CSP } from "@/T/typesDB";

//eror handling
import { throwInnerError } from "@/globals/errorMessages";

//navigator

export const getPersistedState = (currentverson: string): CSP => {
  return checkVersion(currentverson) ? getCSP() : cleanUpCSP();
};
