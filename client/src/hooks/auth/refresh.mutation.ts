import { useMutation } from "@tanstack/react-query";
import { useUsers } from "../../store/users.store";
import auth from "../../api/endpoints/auth";



export const useUserCheckMutation = () => {
    const {setAuth, setUser, setAdmin} = useUsers((state) => state)
    
     const mutation = useMutation({
        mutationFn: async() => {
            const response = await auth.refresh()
            localStorage.setItem('token', response.data.accessToken);
            setAuth(true);
            setUser(response.data.user);
            setAdmin(response.data.user.role === 'ADMIN')
    }})
    

    return mutation
}