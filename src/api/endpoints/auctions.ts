import hosts  from "../index";
import type { Auction } from "../../shared/types/auction.type";
import { setQuery } from "../../shared/utils/setQuery.util";

export default new class auctionsMethods {

    async create(auction: Auction) {
        return await hosts.$auctionsHost.post('', auction)
    }

    async getById(id: string){
        return await hosts.$auctionsHost.get(id)
    }

    async getByName(name: string) {
        const query = setQuery('name', name)
        return await hosts.$auctionsHost.get(query)
    }

    async getAllAdmin() {
        return await hosts.$auctionsHost.get('all')
    }

    async delete(id: string){
        return await hosts.$auctionsHost.delete(id)
    }

    async finish(id: string) {
        return await hosts.$auctionsHost.patch(`${id}/finish`)
    }
}