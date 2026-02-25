import { useMutation } from "@tanstack/react-query";
import type { Deposite } from "../../shared/types/deposite.type";
import deposites from "../../api/endpoints/deposites";
import { useDeposites } from "../../store/deposites.store";

export const useDepositeCreateMutation = () => {
    const {addDeposite} = useDeposites((state) => state)
     const mutation = useMutation({
        mutationFn: async(deposite: Deposite) => {
            const data = await deposites.create(deposite)
            addDeposite(data.data)
            return data
        }
    })
    

    return mutation
}