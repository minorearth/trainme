import { makeObservable, makeAutoObservable } from "mobx";
import txtField from "@/components/authcomps/components/textfield/store";
class authForm {
  signUp = false;
  signIn = true;
  pswReset = false;

  showSignUp() {
    txtField.resetState();
    this.signUp = true;
    this.signIn = false;
    this.pswReset = false;
  }
  showSignIn() {
    txtField.resetState();
    this.signIn = true;
    this.signUp = false;
    this.pswReset = false;
  }

  showResetPsw(email) {
    // this.resetState();
    this.pswReset = true;
    this.signIn = false;
    this.signUp = false;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new authForm();
