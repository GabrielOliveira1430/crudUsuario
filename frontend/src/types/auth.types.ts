export type Permission =
  | "user.delete"
  | "user.update"
  | "user.view"
  | "user.create";

export type Role = "ADMIN" | "USER";

export type User = {
  name: string;
  email: string;
  role: Role;
  permissions?: Permission[];
};