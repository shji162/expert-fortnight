import { useMutation } from "@tanstack/react-query";
import { useUsers } from "../../store/users.store";
import auth from "../../api/endpoints/auth";
import type { login } from "../../shared/types/interfaces/login.interface";



export const useUserLoginMutation = () => {
      const {setAuth, setUser, setAdmin, user} = useUsers((state) => state)
     const mutation = useMutation({
        mutationFn: async(User: login) => {
           const res = await auth.login(User)
           if(res.data.tokens.accessToken || res.data.tokens.refreshToken){
            localStorage.setItem('token', res.data.tokens.accessToken)
            setAuth(true)
            setUser(res?.data.user)
            setAdmin(res.data.user.role === 'ADMIN')
            console.log(user)  
           }
           return res
        }
    })
    

    return mutation
}