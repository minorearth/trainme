import { makeObservable, makeAutoObservable } from "mobx";
import { textFieldProps } from "@/components/common/customfield/setup";

const DEFAULT = { error: true, value: "", helperText: "" };

class txtField {
  state = {
    email: DEFAULT,
    name: DEFAULT,
    password: DEFAULT,
    nickname: DEFAULT,
    tasknum: { error: false, value: "5", helperText: "" },
    champid: DEFAULT,
    firstname: DEFAULT,
    secondname: DEFAULT,
  };

  setState(type, value) {
    this.state[type] = { ...this.state[type], ...value };
  }

  resetState() {
    Object.keys(this.state).forEach((field) => (this.state[field] = DEFAULT));
  }

  handleChange2(value, type) {
    if (textFieldProps[type].instantValidation) {
      const error = textFieldProps[type].validator(value);
      const helperText = error ? textFieldProps[type].helperText : "";
      this.state[type] = { error, value, helperText };
    } else this.state[type] = { ...this.state[type], value };
  }

  validate(types) {
    const res = types.map((type) => {
      const error = textFieldProps[type].validator(this.state[type].value);
      const helperText = error ? textFieldProps[type].helperText : "";
      this.state[type] = { ...this.state[type], error, helperText };
      return !error;
    });
    return res.every(Boolean);
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new txtField();
