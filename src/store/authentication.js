import { makeObservable, makeAutoObservable } from "mobx";
class authForm {
  signUp = false;
  signIn = true;
  pswReset = false;
  state = {
    email: { error: false, value: "", helperText: "" },
    name: { error: false, value: "", helperText: "" },
    password: { error: false, value: "", helperText: "" },
  };

  setState(type, value) {
    this.state[type] = { ...this.state[type], ...value };
  }

  resetState() {
    this.state = {
      email: { error: false, value: "", helperText: "" },
      name: { error: false, value: "", helperText: "" },
      password: { error: false, value: "", helperText: "" },
    };
  }

  showSignUp() {
    this.resetState();
    this.signUp = true;
    this.signIn = false;
    this.pswReset = false;
  }
  showSignIn() {
    this.resetState();
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
