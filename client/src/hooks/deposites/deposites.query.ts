import { useQuery } from "@tanstack/react-query"
import deposites from "../../api/endpoints/deposites.ts"
import { useDeposites } from "../../store/deposites.store.ts"
import type { DepositeOutput } from "../../shared/types/output/deposite-output.type.ts"

export const useDepositesQuery = (email: string) => {
    const {setDeposites} = useDeposites((state) => state)
    const query = useQuery({
        queryKey: ['deposites', email],
        queryFn: async(): Promise<DepositeOutput[] | undefined> => {
            const res = await deposites.getByEmail(email)
            setDeposites(res.data)
            return res.data
        },

    })
    
    return query
}

