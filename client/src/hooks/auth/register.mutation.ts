import auth from "../../api/endpoints/auth";
import { Roles } from "../../shared/types/enums/role.enum";
import type { User } from "../../shared/types/user.type";
import { useUsers } from "../../store/users.store";

import { useMutation } from "@tanstack/react-query";



export const useUserCreateMutation = () => {
        const {setAuth, setUser, setAdmin} = useUsers((state) => state)
     const mutation = useMutation({
        mutationFn: async(user: User) => {
           const res = await auth.register({...user, role: Roles.USER})
           if(res.data.tokens.accessToken || res.data.tokens.refreshToken){
            localStorage.setItem('token', res.data.tokens.accessToken)
            setAuth(true)
            setUser(res.data.user)
            setAdmin(res.data.user.role === Roles.ADMIN)
           }
           return res
        }
    })
    

    return mutation
}