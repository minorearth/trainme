import { da } from "@/components/common/dialog/dialogMacro";

//DB direct call
import { cleanUpCSP } from "@/db/localstorage";

//services(external)
import { signUp, signIn } from "@/userlayers/services/servicesAuth";

//repository(external)
import { resetPsw } from "@/userlayers/repository/repositoryAuth";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";
import txtField from "@/components/common/customfield/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { AppRouterInstance } from "";

export const signInSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  router: AppRouterInstance
) => {
  event.preventDefault();
  if (txtField.validate(["email", "password"])) {
    splash.setShowProgress();
    cleanUpCSP();
    await signIn({
      email: txtField.state.email.value,
      password: txtField.state.password.value,
      router,
    });
    splash.closeProgress();
    // router.replace("/chapters"); // заменяет текущую страницу
  } else {
  }
};

export const recoverPswSubmit = () => {
  if (txtField.validate(["email"])) {
    resetPsw(txtField.state.email.value);
    da.info.resetpsw(() => authForm.showSignIn());
  }
};

export const signUpSubmit = async (event: Event) => {
  event.preventDefault();
  if (txtField.validate(["email", "password", "name"])) {
    await signUp({
      email: txtField.state.email.value,
      password: txtField.state.password.value,
      name: txtField.state.name.value,
    });
    da.info.accountcreeated(() => authForm.showSignIn());
  }
};
