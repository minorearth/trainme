import {
  regnameVal,
  checkMail,
  checkPsw,
} from "@/components/authcomps/components/textfield/validators";
import local from "@/globals/local";

export const textFieldProps = {
  email: {
    auto: "email",
    label: local.ru.caption.AUTH_ENTER_EMAIL,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_EMAIL,
    validator: checkMail,
  },
  password: {
    auto: "current-password",
    label: local.ru.caption.AUTH_ENTER_PSW,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_PSW,
    validator: checkPsw,
  },
  name: {
    auto: "name",
    label: local.ru.caption.AUTH_ENTER_NAME,
    helperText: local.ru.msg.snack.AUTH_ENTER_VALID_NAME,
    validator: regnameVal,
  },
  default: {
    auto: null,
    label: "",
  },
};
