import { useMutation } from "@tanstack/react-query";
import { useRates } from "../../store/rates.store";
import type { Rate } from "../../shared/types/rate.type";
import rates from "../../api/endpoints/rates";

export const useRateCreateMutation = () => {
    const {addRate} = useRates((state) => state)
     const mutation = useMutation({
        mutationFn: async(rate: Rate) => {
            const data = await rates.newRate(rate)
            addRate(data.data)
            return data
        }
    })
    

    return mutation
}