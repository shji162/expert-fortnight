import { useQuery } from "@tanstack/react-query"
import { useMedia } from "../../store/media.store.ts"
import type { Media } from "../../shared/types/media.type.ts"
import media from "../../api/endpoints/media.ts"

export const useMediaByAuctionIdQuery = (auctionId: string) => {
  const { setMedia } = useMedia((state) => state)

  const query = useQuery({
    queryKey: ["media", auctionId],
    enabled: !!auctionId,
    queryFn: async (): Promise<Media[] | undefined> => {
      const res = await media.getByAuctionId(auctionId)
      setMedia(res.data)
      return res.data
    },
  })

  return query
}

