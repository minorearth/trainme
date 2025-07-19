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
} as const;

export type FieldType = (typeof CFT)[keyof typeof CFT];
