import hosts  from "../index";
import backendRoutes from "../../shared/consts/backendRoutes";
import type { updateUser } from "../../shared/types/update/user-update.type";
import { setQuery } from "../../shared/utils/setQuery.util";

export default new class usersMethods {

    async getById(id: string){
        return await hosts.$usersHost.get(id)
    }

    async getAll(){
        return await hosts.$usersHost.get(backendRoutes.getAllUsersRoute)
    }

    async getByEmail(email: string) {
        const query = setQuery('email', email)
        return await hosts.$usersHost.get(query)
    }

    async update(id: string, user: updateUser){
        return await hosts.$usersHost.patch(id, user)
    }

    async delete(id: string){
        return await hosts.$usersHost.delete(id)
    }
}