import { create } from "zustand";
import type { depositeStoreType } from "../shared/types/storeTypes/deposite-store.type";


export const useDeposites = create<depositeStoreType>((set, get) => ({
    deposites: [],
    selectedDeposite: null,
    search: "",
    setSearch: (search) => set({search: search}),
    setDeposites: (deposites) => set({deposites: deposites}),
    setSelectedDeposite: (deposite) => set({selectedDeposite: deposite}),
    addDeposite: (deposite) => {
        const newDeposites = [...(get().deposites ?? []), deposite]
        set({deposites: newDeposites})
    },

    deleteDeposite: (id) => {
        const newDeposites = get().deposites?.filter(deposite => deposite.id !== id)

        set({deposites: newDeposites})
    }
}))