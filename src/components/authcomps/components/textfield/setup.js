import {
  regnameVal,
  checkMail,
  checkPsw,
  checkNickName,
  checkTasknum,
  checkChampid,
} from "@/components/authcomps/components/textfield/validators";
import local from "@/globals/local";

export const textFieldProps = {
  champid: {
    auto: null,
    label: local.ru.caption.AUTH_ENTER_CHAMPID,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_CHAMPID,
    validator: checkChampid,
    instantValidation: true,
  },

  tasknum: {
    auto: null,
    label: local.ru.caption.AUTH_ENTER_TASKNUM,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_TASKNUM,
    validator: checkTasknum,
    instantValidation: true,
  },

  nickname: {
    auto: "name",
    label: local.ru.caption.AUTH_ENTER_NICKNAME,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_NICKNAME,
    validator: checkNickName,
    instantValidation: true,
  },

  email: {
    auto: "email",
    label: local.ru.caption.AUTH_ENTER_EMAIL,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_EMAIL,
    validator: checkMail,
    instantValidation: false,
  },
  password: {
    auto: "current-password",
    label: local.ru.caption.AUTH_ENTER_PSW,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_PSW,
    validator: checkPsw,
    instantValidation: false,
  },
  name: {
    auto: "name",
    label: local.ru.caption.AUTH_ENTER_NAME,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_NAME,
    validator: regnameVal,
    instantValidation: false,
  },
  default: {
    auto: null,
    label: "",
  },
};
