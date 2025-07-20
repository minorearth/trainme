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
import { CFT } from "@/components/common/customfield/types";
// import { AppRouterInstance } from "";
import E, { throwInnerError } from "@/globals/errorMessages";
export const signInSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  router: AppRouterInstance
) => {
  event.preventDefault();
  if (txtField.validate([CFT.email, CFT.password])) {
    splash.showProgress(false, "progressdots", 0);
    cleanUpCSP();
    await signIn({
      email: txtField.state.email.value,
      password: txtField.state.password.value,
      router,
    });
  } else {
  }
};

export const recoverPswSubmit = () => {
  if (txtField.validate([CFT.email])) {
    try {
      resetPsw(txtField.state.email.value);
      da.info.resetpsw(() => authForm.showSignIn());
    } catch (e) {
      throw throwInnerError(e);
    }
  }
};

export const signUpSubmit = async (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
  if (txtField.validate([CFT.email, CFT.password, CFT.name])) {
    await signUp({
      email: txtField.state.email.value,
      password: txtField.state.password.value,
      name: txtField.state.name.value,
    });
    da.info.accountcreeated(() => authForm.showSignIn());
  }
};
