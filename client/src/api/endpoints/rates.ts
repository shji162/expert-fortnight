import hosts  from "../index";
import type { Rate } from "../../shared/types/rate.type";
import { setQuery } from "../../shared/utils/setQuery.util";

export default new class ratesMethods {

    async newRate(rate: Rate) {
        return await hosts.$ratesHost.post('', rate)
    }

    async getByAuctionId(auctionId: string) {
        const query = setQuery('auctionId', auctionId)
        return await hosts.$ratesHost.get(query)
    }

}