import { create } from "zustand";
import type { mediaStoreType } from "../shared/types/storeTypes/media-store.type";


export const useMedia = create<mediaStoreType>((set, get) => ({
    media: [],
    setMedia: (media) => set({media: media}),
    addMedia: (media) => {
        const newMedia = [...(get().media ?? []), media]
        set({media: newMedia})
    },

    deleteMedia: (id) => {
        const newMedias = get().media?.filter(media => media.id !== id)

        set({media: newMedias})
    }
}))