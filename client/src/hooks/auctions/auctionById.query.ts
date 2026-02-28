import { useQuery } from "@tanstack/react-query"
import auctions from "../../api/endpoints/auctions.ts"
import type { AuctionOutput } from "../../shared/types/output/auction-output.type.ts"
import { useAuctions } from "../../store/auctions.store.ts"

export const useAuctionByIdQuery = (id: string) => {
    const {setSelectedAuction} = useAuctions((state) => state)
    const query = useQuery({
        queryKey: ['auctions', id],
        queryFn: async(): Promise<AuctionOutput | undefined> => {
            const res = await auctions.getById(id)
            setSelectedAuction(res.data)
            return res.data
        },

    })
    
    return query
}

