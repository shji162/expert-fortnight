import type { Roles } from "../enums/role.enum";

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Roles;
  isBanned?: boolean;
};