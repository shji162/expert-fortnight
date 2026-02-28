import type { RateOutput } from "../output/rate-output.type"



export type rateStoreType = {
    rates: RateOutput[] | null,
    setRates: (rates: RateOutput[]) => void
    addRate: (rate: RateOutput) => void
}