import { useMutation } from "@tanstack/react-query";
import { useMedia } from "../../store/media.store";
import media from "../../api/endpoints/media";

export const useMediaDeleteMutation = () => {
    const {deleteMedia} = useMedia((state) => state)
     const mutation = useMutation({
        mutationFn: async(id: string) => {
            const data = await media.delete(id)
            deleteMedia(data.data)
            return data
        }
    })
    

    return mutation
}