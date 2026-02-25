import type { Status } from "./enums/auction-status.enum"


export type History = {
    userId: string
    auctionId: string
    status: Status
}