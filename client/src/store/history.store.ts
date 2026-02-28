import { create } from "zustand";
import type { historyStoreType } from "../shared/types/storeTypes/history-store.type";



export const useHistory = create<historyStoreType>((set) => ({
    history: [],
    setHistory: (history) => set({history: history}),
}))