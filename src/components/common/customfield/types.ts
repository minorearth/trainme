//custom field types
//TODO:dupliicated, see field state
export const CFT = {
  firstname: "firstname",
  secondname: "secondname",
  champid: "champid",
  tasknum: "tasknum",
  nickname: "nickname",
  email: "email",
  password: "password",
  name: "name",
};

export type FieldType = (typeof CFT)[keyof typeof CFT];
