export const getUserId = () => {
  return localStorage.getItem("userid");
};

export const setState = (state) => {
  return localStorage.setItem("state", state);
};

export const getState = (state) => {
  return localStorage.getItem("state");
};

export const setUserId = () => {
  return localStorage.setItem("userid", 1);
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
