import { useMutation } from "@tanstack/react-query";
import auctions from "../../api/endpoints/auctions";
import { useAuctions } from "../../store/auctions.store";

export const useAuctionRemoveMutation = () => {
    const {deleteAuction} = useAuctions((state) => state)
     const mutation = useMutation({
        mutationFn: async(id: string) => {
            const data = await auctions.delete(id)
            deleteAuction(id)
            return data
        }
    })
    

    return mutation
}