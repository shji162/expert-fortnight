import { useMutation } from "@tanstack/react-query";
import deposites from "../../api/endpoints/deposites";
import { useDeposites } from "../../store/deposites.store";


interface updateDepositeInterface {
    id: string
    deposite: string
}

export const useDepositeUpdateMutation = () => {
    const {deleteDeposite, addDeposite} = useDeposites((state) => state)
     const mutation = useMutation({
        mutationFn: async({id, deposite}: updateDepositeInterface) => {
            const data = await deposites.update(id, deposite)
            deleteDeposite(id)
            addDeposite(data.data)
            return data.data
        }
    })
    

    return mutation
}