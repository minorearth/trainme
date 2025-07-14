"use client";
import { decrypt2, encrypt2 } from "@/globals/utils/encryption";
import stn from "@/globals/settings";
import { CSP, StateType } from "@/types";
import { CSP_DEFAULTS } from "@/typesdefaults";

export const getUserId = () => {
  return localStorage.getItem("userid");
};

export const setCSP = (state: CSP) => {
  if (stn.mode.needCt) {
    localStorage.setItem("state", encrypt2(JSON.stringify(state)));
  } else {
    localStorage.setItem("state", JSON.stringify(state));
  }
};

export const cleanUpCSP = () => {
  localStorage.removeItem("state");
};

export const getCSP = (): CSP => {
  const state = localStorage.getItem("state");
  if (stn.mode.needCt) {
    return state != null ? JSON.parse(decrypt2(state)) : CSP_DEFAULTS;
  } else {
    return state != null ? JSON.parse(state) : CSP_DEFAULTS;
  }
};

export const loadSetupPersisted = () => {
  const state = localStorage.getItem("setup");
  return state != null ? JSON.parse(state) : null;
};

export const updateSCP = (data: object) => {
  const CSP = getCSP();
  setCSP({ ...CSP, ...data });
};
export const updateKeySCP = (data: Object, key: StateType) => {
  const CSP = getCSP();
  setCSP({ ...CSP, [key]: { ...CSP[key], ...data } });
};
