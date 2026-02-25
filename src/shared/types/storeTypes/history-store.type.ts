import type { HistoryOutput } from "../output/history-output.type"



export type historyStoreType = {
    history: HistoryOutput[] | null,
    setHistory: (history: HistoryOutput[]) => void
}