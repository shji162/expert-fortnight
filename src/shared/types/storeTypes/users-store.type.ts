import type { UserOutput } from "../output/user-output.type"


export type userStoreType = {
    user: UserOutput | null
    isAuth: boolean
    isAdmin: boolean
    setUser: (user: UserOutput | null) => void
    setAuth: (isAuth: boolean) => void
    setAdmin: (isAdmin: boolean) => void
}