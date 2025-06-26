import { makeObservable, makeAutoObservable } from "mobx";
import { textFieldProps } from "@/components/authcomps/components/textfield/setup";
class txtField {
  state = {
    email: { error: false, value: "", helperText: "" },
    name: { error: false, value: "", helperText: "" },
    password: { error: false, value: "", helperText: "" },
  };

  setState(type, value) {
    this.state[type] = { ...this.state[type], ...value };
  }

  resetState() {
    Object.keys(this.state).forEach(
      (field) =>
        (this.state[field] = { error: false, value: "", helperText: "" })
    );
  }

  handleChange(value, type) {
    console.log(value, type);
    const error = textFieldProps[type].validator(value);
    const helperText = error ? textFieldProps[type].helperText : "";
    this.state[type] = { error, value, helperText };
  }

  handleChange2(value, type) {
    this.state[type] = { ...this.state[type], value };
  }

  validate(types) {
    const res = types.map((type) => {
      const error = textFieldProps[type].validator(this.state[type].value);
      const helperText = error ? textFieldProps[type].helperText : "";
      this.state[type] = { ...this.state[type], error, helperText };
      return !error;
    });
    console.log("res", res);
    return res.every(Boolean);
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new txtField();
