import { useQuery } from "@tanstack/react-query"
import users from "../../api/endpoints/users.ts"
import type { UserOutput } from "../../shared/types/output/user-output.type.ts"

export const useUsersQuery = () => {
    
    const query = useQuery({
        queryKey: ['users'],
        queryFn: async(): Promise<UserOutput[] | undefined> => {
            const res = await users.getAll()
            return res.data
        },

    })
    
    return query
}

