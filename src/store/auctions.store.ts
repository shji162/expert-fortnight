import { create } from "zustand";
import type { auctionStoreType } from "../shared/types/storeTypes/auction-store.type";


export const useAuctions = create<auctionStoreType>((set, get) => ({
    auctions: [],
    selectedAuction: null,
    search: "",
    setSearch: (search) => set({search: search}),
    setAuctions: (auctions) => set({auctions: auctions}),
    setSelectedAuction: (auction) => set({selectedAuction: auction}),
    addAuction: (auction) => {
        const newAuctions = [...(get().auctions ?? []), auction]
        set({auctions: newAuctions})
    },

    deleteAuction: (id) => {
        const newAuctions = get().auctions?.filter(auction => auction.id !== id)

        set({auctions: newAuctions})
    }
}))