import { useQuery } from "@tanstack/react-query"
import deposites from "../../api/endpoints/deposites.ts"
import { useDeposites } from "../../store/deposites.store.ts"
import type { DepositeOutput } from "../../shared/types/output/deposite-output.type.ts"

export const useDepositeByIdQuery = (id: string) => {
    const {setSelectedDeposite} = useDeposites((state) => state)
    const query = useQuery({
        queryKey: ['deposites', id],
        queryFn: async(): Promise<DepositeOutput[] | undefined> => {
            const res = await deposites.getById(id)
            setSelectedDeposite(res.data)
            return res.data
        },

    })
    
    return query
}

