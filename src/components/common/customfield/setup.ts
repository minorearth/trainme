import {
  regnameVal,
  checkMail,
  checkPsw,
  checkNickName,
  checkTasknum,
  checkChampid,
  checkFirstName,
  checkSecondName,
} from "@/components/common/customfield/validators";
import L from "@/globals/local";
import { CFT } from "./types";

export const textFieldProps: {
  [key: string]: {
    auto: string | undefined;
    label: string;
    helperText: string;
    validator: (value: string) => boolean;
    instantValidation: boolean;
  };
} = {
  firstname: {
    auto: undefined,
    label: L.ru.CI.AUTH_ENTER_FIRSTNAME,
    helperText: L.ru.CI.AUTH_ENTER_VALID_FIRSTNAME,
    validator: checkFirstName,
    instantValidation: true,
  },
  secondname: {
    auto: undefined,
    label: L.ru.CI.AUTH_ENTER_SECONDNAME,
    helperText: L.ru.CI.AUTH_ENTER_VALID_SECONDNAME,
    validator: checkSecondName,
    instantValidation: true,
  },
  champid: {
    auto: undefined,
    label: L.ru.CI.AUTH_ENTER_CHAMPID,
    helperText: L.ru.CI.AUTH_ENTER_VALID_CHAMPID,
    validator: checkChampid,
    instantValidation: true,
  },

  tasknum: {
    auto: undefined,
    label: L.ru.CI.AUTH_ENTER_TASKNUM,
    helperText: L.ru.CI.AUTH_ENTER_VALID_TASKNUM,
    validator: checkTasknum,
    instantValidation: true,
  },

  nickname: {
    auto: "name",
    label: L.ru.CI.AUTH_ENTER_NICKNAME,
    helperText: L.ru.CI.AUTH_ENTER_VALID_NICKNAME,
    validator: checkNickName,
    instantValidation: true,
  },

  email: {
    auto: CFT.email,
    label: L.ru.CI.AUTH_ENTER_EMAIL,
    helperText: L.ru.CI.AUTH_ENTER_VALID_EMAIL,
    validator: checkMail,
    instantValidation: false,
  },
  password: {
    auto: CFT.password,
    label: L.ru.CI.AUTH_ENTER_PSW,
    helperText: L.ru.CI.AUTH_ENTER_VALID_PSW,
    validator: checkPsw,
    instantValidation: false,
  },
  name: {
    auto: CFT.name,
    label: L.ru.CI.AUTH_ENTER_NAME,
    helperText: L.ru.CI.AUTH_ENTER_VALID_NAME,
    validator: regnameVal,
    instantValidation: false,
  },
  default: {
    auto: undefined,
    label: "",
    helperText: "",
    validator: () => true,
    instantValidation: false,
  },
};
