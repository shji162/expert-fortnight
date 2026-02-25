import { useQuery } from "@tanstack/react-query"
import users from "../../api/endpoints/users.ts"
import type { UserOutput } from "../../shared/types/output/user-output.type.ts"

export const useUserByIdQuery = (id: string) => {
    const query = useQuery({
        queryKey: ['users', id],
        queryFn: async(): Promise<UserOutput | undefined> => {
            const res = await users.getById(id)
            return res.data
        },

    })
    
    return query
}

