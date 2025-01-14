import { decrypt2, encrypt2 } from "@/globals/utils/encryption";
import stn from "@/globals/settings";

export const getUserId = () => {
  return localStorage.getItem("userid");
};

export const updateState = (data) => {
  const state = localStorage.getItem("state");
  if (stn.needCt) {
    const stateLS = state != null ? JSON.parse(decrypt2(state)) : {};
    localStorage.setItem(
      "state",
      encrypt2(JSON.stringify({ ...stateLS, ...data }))
    );
  } else {
    const stateLS = state != null ? JSON.parse(state) : {};
    localStorage.setItem("state", JSON.stringify({ ...stateLS, ...data }));
  }
};

export const persistState = (state) => {
  if (stn.needCt) {
    localStorage.setItem("state", encrypt2(JSON.stringify(state)));
  } else {
    localStorage.setItem("state", JSON.stringify(state));
  }
};

export const loadStatePersisted = () => {
  const state = localStorage.getItem("state");
  if (stn.needCt) {
    return state != null ? JSON.parse(decrypt2(state)) : null;
  } else {
    return state != null ? JSON.parse(state) : null;
  }
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
