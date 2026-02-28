import type { AuctionOutput } from "../output/auction-output.type"


export type auctionStoreType = {
    auctions: AuctionOutput[] | null,
    selectedAuction: AuctionOutput | null,
    search: string,
    setSearch: (search: string) => void
    setAuctions: (auctions: AuctionOutput[]) => void
    setSelectedAuction: (auction: AuctionOutput) => void
    addAuction: (auction: AuctionOutput) => void
    deleteAuction: (id: string) => void
}