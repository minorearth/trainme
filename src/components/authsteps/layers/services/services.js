import { da } from "@/components/common/dialog/dialogMacro";

import { cleanUpCSP } from "@/db/localstorage";

//services
import { signUpUser, signInNow } from "@/userlayers/services/servicesAuth";

//repository
import { resetPsw } from "@/userlayers/repository/repositoryAuth";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";
import txtField from "@/components/common/customfield/store";

export const signInSubmit = async (event, router) => {
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

export const recoverPswSubmit = (event) => {
  event.preventDefault();
  if (txtField.validate(["email"])) {
    resetPsw(txtField.state.email.value);
    da.info.resetpsw(() => authForm.showSignIn());
  }
};

export const signUpSubmit = async (event) => {
  event.preventDefault();
  if (txtField.validate(["email", "password", "name"])) {
    await signUpUser(
      txtField.state.email.value,
      txtField.state.password.value,
      txtField.state.name.value
    );
    da.info.accountcreeated(() => authForm.showSignIn());
  }
};
