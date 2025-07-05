import { da } from "@/components/common/dialog/dialogMacro";

//DB direct call
import { cleanUpCSP } from "@/db/localstorage";

//services(external)
import { signUpUser, signInNow } from "@/userlayers/services/servicesAuth";

//repository(external)
import { resetPsw } from "@/userlayers/repository/repositoryAuth";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";
import txtField from "@/components/common/customfield/store";

export const signInSubmit = async (event, router) => {
  event.preventDefault();
  if (txtField.validate(["email", "password"])) {
    splash.setShowProgress();
    cleanUpCSP();
    await signInNow(
      txtField.state.email.value,
      txtField.state.password.value,
      router
    );
    splash.closeProgress();
    // router.replace("/chapters"); // заменяет текущую страницу
  } else {
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
