import { useMutation } from "@tanstack/react-query";
import { useMedia } from "../../store/media.store";
import media from "../../api/endpoints/media";


interface updateMediaInterface {
    id: string
    updateMedia: string
}

export const useMediaUpdateMutation = () => {
    const {deleteMedia, addMedia} = useMedia((state) => state)
     const mutation = useMutation({
        mutationFn: async({id, updateMedia}: updateMediaInterface) => {
            const data = await media.update(id, updateMedia)
            deleteMedia(id)
            addMedia(data.data)
            return data.data
        }
    })
    

    return mutation
}