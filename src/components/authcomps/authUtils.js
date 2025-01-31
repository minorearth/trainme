import local from "@/globals/local";

const checkMail = (email) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return {
      error: true,
      helperText: local.ru.msg.snack.AUTH_ENTER_VALID_EMAIL,
    };
  } else {
    return {
      error: false,
      helperText: "",
    };
  }
};

const checkPsw = (password) => {
  if (!password || password.length < 6) {
    return {
      error: true,
      helperText: local.ru.msg.snack.AUTH_ENTER_VALID_PSW,
    };
  } else {
    return {
      error: false,
      helperText: "",
    };
  }
};

const checkName = (name) => {
  if (!name || name.length < 1) {
    return {
      error: true,
      helperText: local.ru.msg.snack.AUTH_ENTER_VALID_NAME,
    };
  } else {
    return {
      error: false,
      helperText: "",
    };
  }
};

const allValid = (errors) => {
  return !Object.keys(errors)
    .map((key) => errors[key].error)
    .includes(true);
};

export const checkSignUpFields = ({ email, password, name }) => {
  const errors = {
    email: checkMail(email),
    password: checkPsw(password),
    name: checkName(name),
  };
  const isValid = allValid(errors);
  return { isValid, errors };
};

export const checkSignInFields = ({ email, password }) => {
  const errors = {
    email: checkMail(email),
    password: checkPsw(password),
  };
  const isValid = allValid(errors);
  return { isValid, errors };
};

export const checkResetPswFields = ({ email }) => {
  const errors = {
    email: checkMail(email),
  };
  const isValid = allValid(errors);
  return { isValid, errors };
};
