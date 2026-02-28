import { useQuery } from "@tanstack/react-query"
import rates from "../../api/endpoints/rates.ts"
import type { RateOutput } from "../../shared/types/output/rate-output.type.ts"
import { useRates } from "../../store/rates.store.ts"

export const useRatesByAuctionIdQuery = (auctionId: string) => {
  const { setRates } = useRates((state) => state)

  const query = useQuery({
    queryKey: ["rates", auctionId],
    enabled: !!auctionId,
    queryFn: async (): Promise<RateOutput[] | undefined> => {
      const res = await rates.getByAuctionId(auctionId)
      setRates(res.data)
      return res.data
    },
  })

  return query
}
