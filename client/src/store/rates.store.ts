import { create } from "zustand";
import type { rateStoreType } from "../shared/types/storeTypes/rate-store.type";



export const useRates = create<rateStoreType>((set, get) => ({
    rates: [],
    setRates: (rates) => set({rates: rates}),
    addRate: (rate) => {
        const newRates = [...(get().rates ?? []), rate]
        set({rates: newRates})
    },
}))