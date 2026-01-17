"use server";

import {
  completeAllChaptersDBSA as extcompleteAllChaptersDBSA,
  setMoneyDBSA as extsetMoneyDBSA,
  unlockAllChaptersDBSA as extunlockAllChaptersDBSA,
  resetUser as externalResetUser,
} from "@/tpconst/src/RP/FB/repositoryFBSA";

export async function resetUser(dataEncrypted: string) {
  return externalResetUser(dataEncrypted);
}

export async function setMoneyDBSA(dataEncrypted: string) {
  return extsetMoneyDBSA(dataEncrypted);
}

export async function unlockAllChaptersDBSA(dataEncrypted: string) {
  return extunlockAllChaptersDBSA(dataEncrypted);
}
export async function completeAllChaptersDBSA(dataEncrypted: string) {
  return extcompleteAllChaptersDBSA(dataEncrypted);
}
