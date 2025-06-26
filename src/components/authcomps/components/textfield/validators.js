export const regnameVal = (value) => {
  return !value || value.length < 1;
};

export const checkMail = (email) => {
  return !email || !/\S+@\S+\.\S+/.test(email);
};

export const checkPsw = (password) => {
  return !password || password.length < 6;
};
