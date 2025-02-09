"use client";
import { decrypt2, encrypt2 } from "@/globals/utils/encryption";
import stn from "@/globals/settings";

export const getUserId = () => {
  return localStorage.getItem("userid");
};

export const updateStateLS = (data) => {
  const state = localStorage.getItem("state");
  if (stn.mode.needCt) {
    const stateLS = state != null ? JSON.parse(decrypt2(state)) : {};
    const newVal = { ...stateLS, ...data };
    localStorage.setItem("state", encrypt2(JSON.stringify(newVal)));
    return newVal;
  } else {
    const stateLS = state != null ? JSON.parse(state) : {};
    const newVal = { ...stateLS, ...data };
    localStorage.setItem("state", JSON.stringify(newVal));
    return newVal;
  }
};

export const persistState = (state) => {
  if (stn.mode.needCt) {
    localStorage.setItem("state", encrypt2(JSON.stringify(state)));
  } else {
    localStorage.setItem("state", JSON.stringify(state));
  }
};

export const getSense = () => {
  const { pts } = loadStatePersisted();
  return !pts ? 0 : pts;
};

export const loadStatePersisted = () => {
  const state = localStorage.getItem("state");
  if (stn.mode.needCt) {
    return state != null ? JSON.parse(decrypt2(state)) : null;
  } else {
    return state != null ? JSON.parse(state) : null;
  }
};

export const loadSetupPersisted = () => {
  const state = localStorage.getItem("setup");
  return state != null ? JSON.parse(state) : null;
};

export const persistSetup = (state) => {
  localStorage.setItem("setup", JSON.stringify(state));
};

export const setUserId = () => {
  return localStorage.setItem("userid", 1);
};

export const setValueObj = (name, value) => {
  return localStorage.setItem(name, JSON.stringify(value));
};

export const getValueObj = (name) => {
  const res = localStorage.getItem(name);
  return JSON.parse(res);
};

// export const getImgCnt = () => {
//   const counterLS = localStorage.getItem("counter");
//   if (!counterLS) {
//     localStorage.setItem("counter", 0);
//     return 0;
//   } else {
//     IncCnt();
//     return counterLS;
//   }
// };

// const IncCnt = () => {
//   const counterLS = localStorage.getItem("counter");
//   localStorage.setItem("counter", Number(counterLS) + 1);
// };
