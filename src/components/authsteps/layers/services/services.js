import { da } from "@/components/common/dialog/dialogMacro";
import { cleanUpCSP } from "@/db/localstorage";
import { SignUpUser, signInNow } from "@/userlayers/services/authentication";
import { resetPsw } from "@/userlayers/repository/authrepository";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";
import txtField from "@/components/common/customfield/store";

export const handleSignInSubmit = async (event, router) => {
  event.preventDefault();
  splash.setShowProgress();
  if (txtField.validate(["email", "password"])) {
    cleanUpCSP();
    await signInNow(
      txtField.state.email.value,
      txtField.state.password.value,
      router
    );
    // router.replace("/chapters"); // заменяет текущую страницу
  } else {
    splash.closeProgress();
  }
};

export const handleForgetPswSubmit = (event) => {
  event.preventDefault();
  if (txtField.validate(["email"])) {
    resetPsw(txtField.state.email.value);
    da.info.resetpsw(() => authForm.showSignIn());
  }
};

export const handleSignUpSubmit = async (event) => {
  event.preventDefault();
  if (txtField.validate(["email", "password", "name"])) {
    await SignUpUser(
      txtField.state.email.value,
      txtField.state.password.value,
      txtField.state.name.value
    );
    da.info.accountcreeated(() => authForm.showSignIn());
  }
};
