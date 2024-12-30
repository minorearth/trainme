import { makeObservable, makeAutoObservable } from "mobx";
class authenticationForm {
  signUp = false;
  signIn = true;
  pswReset = false;
  email = "";

  showSignUp() {
    this.signUp = true;
    this.signIn = false;
    this.pswReset = false;
  }
  showSignIn() {
    this.signIn = true;
    this.signUp = false;
    this.pswReset = false;
  }

  showResetPsw(email) {
    this.pswReset = true;
    this.signIn = false;
    this.signUp = false;
    this.email = email;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new authenticationForm();
