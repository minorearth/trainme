import { makeObservable, makeAutoObservable } from "mobx";
import { logout } from "@/db/SA/session";

import txtField from "@/components/common/customfield/store";

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

  showResetPsw() {
    // this.resetState();
    this.pswReset = true;
    this.signIn = false;
    this.signUp = false;
  }

  constructor() {
    makeAutoObservable(this);
  }

  initialize() {
    this.logout();
  }

  logout() {
    logout();
  }
}

export default new authForm();
