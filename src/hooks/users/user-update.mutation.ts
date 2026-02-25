import { useMutation } from "@tanstack/react-query";
import type { updateUser } from "../../shared/types/update/user-update.type";
import users from "../../api/endpoints/users";


interface updateUserInterface {
    id: string
    user: updateUser
}

export const useUserUpdateMutation = () => {
     const mutation = useMutation({
        mutationFn: async({id, user}: updateUserInterface) => {
            const data = await users.update(id, user)
            return data.data
        }
    })
    

    return mutation
}