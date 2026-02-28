import { useMutation } from "@tanstack/react-query";
import type { History } from "../../shared/types/history.type";
import history from "../../api/endpoints/history";

export const useHistoryCreateMutation = () => {
     const mutation = useMutation({
        mutationFn: async(data: History) => {
            const res = await history.newHistory(data)
            return res
        }
    })
    

    return mutation
}