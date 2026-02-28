import type { Roles } from "./enums/role.enum"


export type User = {
    name: string
    email: string
    password: string
    role: Roles
}