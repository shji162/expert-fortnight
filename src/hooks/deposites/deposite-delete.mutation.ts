import { useMutation } from "@tanstack/react-query";
import deposites from "../../api/endpoints/deposites";
import { useDeposites } from "../../store/deposites.store";

export const useDepositeDeleteMutation = () => {
    const {deleteDeposite} = useDeposites((state) => state)
     const mutation = useMutation({
        mutationFn: async(id: string) => {
            const data = await deposites.delete(id)
            deleteDeposite(data.data)
            return data
        }
    })
    

    return mutation
}