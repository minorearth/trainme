import { logout } from "@/db/SA/session";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { da } from "@/components/common/dialog/dialogMacro";

import {
  SignUpUserClient,
  resetPswClient,
  signInClient,
} from "@/db/domain/domain";

import { cleanUpCSP } from "@/db/localstorage";
import { getDataFetch } from "@/db/APIcalls/calls";

// stores
import user from "@/userlayers/store/user";
import authForm from "@/components/authcomps/store";
import progressStore from "@/components/common/splash/progressdots/store";
import txtField from "@/components/authcomps/components/textfield/store";

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
    user.setUserNameP(allUserMeta.name);
    router.push(`/chapters`);
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    progressStore.setShowProgress(true);
    if (txtField.validate(["email", "password"])) {
      cleanUpCSP();
      await authNow(txtField.state.email.value, txtField.state.password.value);
      // router.replace("/chapters"); // заменяет текущую страницу
    } else {
      progressStore.setCloseProgress();
    }
  };

  const handleForgetPswSubmit = (event) => {
    event.preventDefault();
    if (txtField.validate(["email"])) {
      resetPswClient(txtField.state.email.value);
      da.info.resetpsw(authForm.showSignIn());
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    if (txtField.validate(["email", "password", "name"])) {
      await SignUpUserClient(
        txtField.state.email.value,
        txtField.state.password.value,
        txtField.state.name.value
      );
      da.info.accountcreeated(() => authForm.showSignIn());
    }
  };

  return { handleSignInSubmit, handleSignUpSubmit, handleForgetPswSubmit };
};
