export const regnameVal = (value) => {
  return !value || value.length < 1;
};

export const checkChampid = (value) => {
  return !value || value.length < 1;
};

export const checkMail = (email) => {
  return !email || !/\S+@\S+\.\S+/.test(email);
};

export const checkPsw = (password) => {
  return !password || password.length < 6;
};

export const checkNickName = (name) => {
  return !/^[А-яёЁёA-Za-z][А-яёЁA-Za-z0-9 ]{0,25}$/.test(name);
};

export const checkTasknum = (tasknum) => {
  return !/^(?:[3-9]|[1-9][0-9])$/.test(tasknum) || !tasknum;
};

export const checkFirstName = (firstname) => {
  return !/^[\p{Lu}][\p{Ll}]{0,25}$/u.test(firstname);
};

export const checkSecondName = (secondName) => {
  return !/^[\p{Lu}][\p{Ll}]{0,25}$/u.test(secondName);
  // return !/^[А-ЯЁA-Z][a-яёa-z]{0,25}$/.test(secondName);
};
