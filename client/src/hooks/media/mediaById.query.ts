import { useQuery } from "@tanstack/react-query"
import media from "../../api/endpoints/media.ts"
import type { MediaOutput } from "../../shared/types/output/media-output.type.ts"

export const useMediaByIdQuery = (id: string) => {
    const query = useQuery({
        queryKey: ['media', id],
        queryFn: async(): Promise<MediaOutput | undefined> => {
            const res = await media.getById(id)
            return res.data
        },

    })
    
    return query
}

