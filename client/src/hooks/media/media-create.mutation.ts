import { useMutation } from "@tanstack/react-query";
import { useMedia } from "../../store/media.store";
import type { Media } from "../../shared/types/media.type";
import media from "../../api/endpoints/media";

export const useMediaCreateMutation = () => {
    const {addMedia} = useMedia((state) => state)
     const mutation = useMutation({
        mutationFn: async(data: Media) => {
            const res = await media.create(data)
            addMedia(res.data)
            return res
        }
    })
    

    return mutation
}