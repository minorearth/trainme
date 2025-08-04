import { makeObservable, makeAutoObservable } from "mobx";
import { textFieldProps } from "@/components/common/customfield/setup";
import { FieldType } from "./types";

const DEFAULT = { error: true, value: "", helperText: "" };
interface Fieldstate {
  error: boolean;
  value: string;
  helperText: string;
}
class txtField {
  state: { [key in FieldType]: Fieldstate } = {
    email: DEFAULT,
    name: DEFAULT,
    password: DEFAULT,
    nickname: DEFAULT,
    tasknum: { error: false, value: "5", helperText: "" },
    champid: DEFAULT,
    firstname: DEFAULT,
    secondname: DEFAULT,
  };

  resetState() {
    Object.keys(this.state).forEach(
      (field) => (this.state[field as FieldType] = DEFAULT)
    );
  }

  handleChange2(value: string, type: FieldType) {
    if (textFieldProps[type].instantValidation) {
      const error = textFieldProps[type].validator(value);
      const helperText = error ? textFieldProps[type].helperText : "";
      this.state[type] = { error, value, helperText };
    } else this.state[type] = { ...this.state[type], value };
  }

  validate(types: FieldType[]) {
    const res = types.map((type: FieldType) => {
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

const newinstance = new txtField();
export default newinstance;
