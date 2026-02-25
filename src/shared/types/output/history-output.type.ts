import type { Status } from "../enums/auction-status.enum"



export type HistoryOutput = {
    id: string
    userId: string
    auctionId: string
    status: Status
}