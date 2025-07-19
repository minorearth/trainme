//custom field types
export const CFT = {
  firstname: "firstname",
  secondname: "secondname",
  champid: "champid",
  tasknum: "tasknum",
  nickname: "nickname",
  email: "email",
  password: "current-password",
  name: "name",
};

export type FieldType = (typeof CFT)[keyof typeof CFT];
