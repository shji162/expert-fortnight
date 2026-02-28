import type { Roles } from "../enums/role.enum";

export type updateUser = {
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
  isBanned?: boolean;
};