import { logout } from "@/db/SA/session";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { da } from "@/components/common/dialog/dialogMacro";
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

import user from "@/store/user";
import dialog from "@/components/common/dialog/store";
import authForm from "@/components/authcomps/store";
import local from "@/globals/local";
import progressStore from "../common/splash/progressdots/store";
import { getDataFetch } from "@/db/APIcalls/calls";

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    logout();
  }, []);

  const authNow = async (email, password) => {
    const uid = await signInClient(email, password);
    const allUserMeta = await getDataFetch({
      data: { uid },
      type: "getusermetadata",
    });

    if (uid == "notVerified") {
      da.info.emailnotverified();
      return;
    }

    if (uid == "invalid") {
      da.info.wrongpsw();
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
      // router.replace("/chapters"); // заменяет текущую страницу
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
      da.info.resetpsw(authForm.showSignIn());
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
      da.info.accountcreeated(() => authForm.showSignIn());
    }
  };

  return { handleSignInSubmit, handleSignUpSubmit, handleForgetPswSubmit };
};
