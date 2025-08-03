"use client";
import { decrypt2, encrypt2 } from "tpconst/utils";
import S from "@/globals/settings";
import { CSP_DEFAULTS } from "tpconst/typesdefaults";
import { CSP } from "tpconst/T";
import { StateType } from "tpconst/T";

export const setCSP = (state: CSP) => {
  if (S.mode.needCt) {
    localStorage.setItem(S.ls.STATE, encrypt2(JSON.stringify(state)));
  } else {
    localStorage.setItem(S.ls.STATE, JSON.stringify(state));
  }
};

export const cleanUpCSP = () => {
  localStorage.setItem(S.ls.STATE, JSON.stringify(CSP_DEFAULTS));
  return CSP_DEFAULTS;
};

export const getCSP = (): CSP => {
  const state = localStorage.getItem(S.ls.STATE);
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
  const localversion = localStorage.getItem(S.ls.VERSION) ?? "";
  localStorage.setItem(S.ls.VERSION, currentverson);
  if (currentverson != localversion) {
    localStorage.setItem(S.ls.STATE, JSON.stringify({}));
  }
  return currentverson == localversion;
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
