export const regnameVal = (value: string) => {
  return !value || value.length < 1;
};

export const checkChampid = (value: string) => {
  return !value || value.length < 1;
};

export const checkMail = (email: string) => {
  return !email || !/\S+@\S+\.\S+/.test(email);
};

export const checkPsw = (password: string) => {
  return !password || password.length < 6;
};

export const checkNickName = (name: string) => {
  return !/^[А-яёЁёA-Za-z][А-яёЁA-Za-z0-9 ]{0,25}$/.test(name);
};

export const checkTasknum = (tasknum: string) => {
  return !/^(?:[3-9]|[1-9][0-9])$/.test(tasknum) || !tasknum;
};

export const checkFirstName = (firstname: string) => {
  return !/^[\p{Lu}][\p{Ll}]{0,25}$/u.test(firstname);
};

export const checkSecondName = (secondName: string) => {
  return !/^[\p{Lu}][\p{Ll}]{0,25}$/u.test(secondName);
  // return !/^[А-ЯЁA-Z][a-яёa-z]{0,25}$/.test(secondName);
};
