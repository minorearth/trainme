//DB direct call
import { cleanUpCSP } from "@/db/localstorage";

//services(external)
import { signUp, signIn } from "@/auth/services/servicesAuth";

//repository(external)
import { resetPsw } from "@/db/repository/repositoryFBAuth";

// stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";
import txtField from "@/components/common/customfield/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CFT } from "@/components/common/customfield/types";
// import { AppRouterInstance } from "";
import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "tpconst/lang";
import { throwInnerError } from "@/globals/errorsHandling/errorHandlers";
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
      dialogs.action({
        ...L.ru.msg["psw_recovery"].params,
        action: () => authForm.showSignIn(),
      });
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
    dialogs.action({
      ...L.ru.msg["account_created"].params,
      action: () => authForm.showSignIn(),
    });
  }
};
