import { logout } from "@/db/SA/session";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  checkSignUpFields,
  checkResetPswFields,
  checkSignInFields,
} from "@/components/authcomps/authUtils";

import {
  SignUpUserClient,
  resetPswClient,
  signInClient,
} from "@/db/domain/domain";

import { cleanUpCSP } from "@/db/localstorage";

import alertdialog from "@/components/common/dialog/store";
import user from "@/store/user";
import dialog from "@/components/common/dialog/store";
import authForm from "@/components/authcomps/store";
import local from "@/globals/local";
import progressStore from "../common/splash/progressdots/store";

import { getUseMetaData } from "@/db/SA/firebaseSA";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    logout();
  }, []);

  const authNow = async (email, password) => {
    const uid = await signInClient(email, password);
    const allUserMeta = await getUseMetaData(uid);

    if (uid == "notVerified") {
      alertdialog.showDialog(
        "email не верифицирован",
        "На ваш почтовый ящик выслано письмо, \nперейдите по ссылке в письме для смены пароля",
        1,
        () => {
          progressStore.setCloseProgress();
        }
      );

      return;
    }

    if (uid == "invalid") {
      alertdialog.showDialog(
        "Неверный логин или пароль",
        "Перепроверьте все еще раз",
        1,
        () => {
          progressStore.setCloseProgress();
        }
      );
      return;
    }
    //TODO:persist name
    user.setUser({ id: uid, name: allUserMeta.name });
    router.push(`/chapters`);
  };

  const validateResetPswInputs = (email) => {
    const errors = checkResetPswFields({ email });
    Object.keys(errors.errors).forEach((key) =>
      authForm.setState(key, errors.errors[key])
    );
    return errors.isValid;
  };

  const validateSignInInputs = (email, password) => {
    const errors = checkSignInFields({ email, password });
    Object.keys(errors.errors).forEach((key) =>
      authForm.setState(key, errors.errors[key])
    );
    return errors.isValid;
  };

  const validateSignUpInputs = (email, password, name) => {
    const errors = checkSignUpFields({ email, password, name });
    Object.keys(errors.errors).forEach((key) =>
      authForm.setState(key, errors.errors[key])
    );
    return errors.isValid;
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    progressStore.setShowProgress(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const isValid = validateSignInInputs(email, password);
    if (isValid) {
      cleanUpCSP();
      await authNow(email, password);
    } else {
      progressStore.setCloseProgress();
    }
  };

  const handleForgetPswSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const isValid = validateResetPswInputs(email);

    if (isValid) {
      resetPswClient(email);
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_RECOVERY_TITLE,
        local.ru.msg.alert.PSW_RECOVERY_TEXT,
        1,
        () => {
          authForm.showSignIn();
        }
      );
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const name = data.get("name");
    const isValid = validateSignUpInputs(email, password, name);

    if (isValid) {
      const userC = await SignUpUserClient(email, password, name);
      dialog.showDialog(
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TITLE,
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TEXT,
        1,
        () => {
          authForm.showSignIn();
        }
      );
    }
  };

  return { handleSignInSubmit, handleSignUpSubmit, handleForgetPswSubmit };
};
