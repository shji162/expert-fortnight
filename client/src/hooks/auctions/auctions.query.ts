import { useQuery } from "@tanstack/react-query"
import auctions from "../../api/endpoints/auctions.ts"
import type { AuctionOutput } from "../../shared/types/output/auction-output.type.ts"
import { useAuctions } from "../../store/auctions.store.ts"

export const useAuctionsQuery = (name: string) => {
    const {setAuctions} = useAuctions((state) => state)
    const query = useQuery({
        queryKey: ['auctions', name],
        queryFn: async(): Promise<AuctionOutput[] | undefined> => {
            const res = await auctions.getByName(name)
            setAuctions(res.data)
            return res.data
        },

    })
    
    return query
}

