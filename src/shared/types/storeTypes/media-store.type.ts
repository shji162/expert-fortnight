import type { MediaOutput } from "../output/media-output.type"



export type mediaStoreType = {
    media: MediaOutput[] | null,
    setMedia: (media: MediaOutput[]) => void
    addMedia: (media: MediaOutput) => void
    deleteMedia: (id: string) => void
}