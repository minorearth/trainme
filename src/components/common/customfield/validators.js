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
  //TODO: (regex) all zero i e 000
  return !/^\d{0,2}$/.test(tasknum) || !tasknum;
};

export const checkFirstName = (firstname) => {
  return !/^[А-ЯЁA-Z][a-яёa-z]{0,25}$/.test(firstname);
};

//TODO: (regex)for cirilic All caps works that is bad
export const checkSecondName = (secondName) => {
  return !/^[А-ЯЁA-Z][a-яёa-z]{0,25}$/.test(secondName);
};
