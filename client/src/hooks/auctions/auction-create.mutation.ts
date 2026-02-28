import { useMutation } from "@tanstack/react-query";
import type { Auction } from "../../shared/types/auction.type";
import auctions from "../../api/endpoints/auctions";
import { useAuctions } from "../../store/auctions.store";

export const useAuctionCreateMutation = () => {
    const {addAuction} = useAuctions((state) => state)
     const mutation = useMutation({
        mutationFn: async(auction: Auction) => {
            const data = await auctions.create(auction)
            addAuction(data.data)
            return data
        }
    })
    

    return mutation
}