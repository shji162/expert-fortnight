import hosts  from "../index";
import type { Deposite } from "../../shared/types/deposite.type";
import { setQuery } from "../../shared/utils/setQuery.util";

export default new class depositesMethods {

    async create(deposite: Deposite) {
        return await hosts.$depositesHost.post('', deposite)
    }

    async getByAuctionId(auctionId: string){
        const query = setQuery('auctionId', auctionId)
        return await hosts.$depositesHost.get(query)
    }

    async getByEmail(email: string) {
        const query = setQuery('email', email)
        return await hosts.$depositesHost.get(query)
    }

    async getById(id: string){
        return await hosts.$depositesHost.get(id)
    }

    async update(id: string, deposite: string){
        return await hosts.$depositesHost.patch(id, deposite)
    }

    async delete(id: string){
        return await hosts.$depositesHost.delete(id)
    }
}