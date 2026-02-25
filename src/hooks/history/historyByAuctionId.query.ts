import { useQuery } from "@tanstack/react-query"
import type { HistoryOutput } from "../../shared/types/output/history-output.type.ts"
import history from "../../api/endpoints/history.ts"
import { useHistory } from "../../store/history.store.ts"

export const useHistoryByAuctionIdQuery = (auctionId: string) => {
  const { setHistory } = useHistory((state) => state)

  const query = useQuery({
    queryKey: ["history", auctionId],
    enabled: !!auctionId,
    queryFn: async (): Promise<HistoryOutput[] | undefined> => {
      const res = await history.getByAuctionId(auctionId)
      setHistory(res.data)
      return res.data
    },
  })

  return query
}
