"use client";
import { decrypt2, encrypt2 } from "@/globals/utils/encryption";
import S from "@/globals/settings";
import { CSP_DEFAULTS } from "@/T/typesdefaults";
import { CSP } from "@/T/typesDB";
import { StateType } from "@/T/typesState";

export const getUserId = () => {
  return localStorage.getItem("userid");
};

export const setCSP = (state: CSP) => {
  if (S.mode.needCt) {
    localStorage.setItem("state", encrypt2(JSON.stringify(state)));
  } else {
    localStorage.setItem("state", JSON.stringify(state));
  }
};

export const cleanUpCSP = () => {
  localStorage.setItem("state", JSON.stringify(CSP_DEFAULTS));
  return CSP_DEFAULTS;
};

export const getCSP = (): CSP => {
  const state = localStorage.getItem("state");
  try {
    if (S.mode.needCt) {
      return state != null ? JSON.parse(decrypt2(state)) : cleanUpCSP();
    } else {
      return state != null ? JSON.parse(state) : cleanUpCSP();
    }
  } catch (e) {
    return cleanUpCSP();
  }
};

export const checkVersion = (currentverson: string): boolean => {
  const localversion = localStorage.getItem("version") ?? "";
  localStorage.setItem("version", currentverson);
  if (currentverson != localversion) {
    localStorage.setItem("state", JSON.stringify({}));
  }
  return currentverson == localversion;
};

export const loadSetupPersisted = () => {
  const state = localStorage.getItem("setup");
  return state != null ? JSON.parse(state) : null;
};

export const updateSCP = (data: Partial<CSP>) => {
  const CSP = getCSP();
  setCSP({ ...CSP, ...data });
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const updateKeySCP = <T>(data: DeepPartial<CSP>, key: StateType) => {
  const CSP = getCSP();
  setCSP({ ...CSP, [key]: { ...CSP[key], ...data[key] } });
};
