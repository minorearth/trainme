import { signInClient } from "@/db/domain/domain";
import user from "@/store/user";
import alertdialog from "@/store/dialog";
import { logout } from "@/db/SA/session";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  checkSignUpFields,
  checkResetPswFields,
} from "@/components/authcomps/authUtils";

import { SignUpUserClient } from "@/db/domain/domain";
import dialog from "@/store/dialog";
import authForm from "@/store/authentication";
import local from "@/globals/local";
import { resetPswClient } from "@/db/domain/domain";
import progressStore from "../common/progress/progressStore";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    logout();
  }, []);

  const authNow = async (email, password) => {
    const uid = await signInClient(email, password);
    user.setUserid(uid);
    if (uid == "notVerified") {
      alertdialog.showDialog(
        "email не верифицирован",
        "Зайдите в почту и перейдите...",
        1,
        () => {
          authForm.showSignIn();
        }
      );
    } else {
      router.push(`/chapters`);
    }
  };

  const validateResetPswInputs = (email) => {
    const errors = checkResetPswFields({ email });
    Object.keys(errors.errors).forEach((key) =>
      authForm.setState(key, errors.errors[key])
    );
    return errors.isValid;
  };

  const validateSignInInputs = (email) => {
    return validateResetPswInputs(email);
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
    const isValid = validateSignInInputs(email);

    if (isValid) {
      await authNow(email, password);
    } else {
      progressStore.setCloseProgress();
    }
    progressStore.setCloseProgress();
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
    const name = document.getElementById("name").value;
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
