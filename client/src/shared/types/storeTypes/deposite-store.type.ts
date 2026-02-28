
import type { DepositeOutput } from "../output/deposite-output.type"



export type depositeStoreType = {
    deposites: DepositeOutput[] | null,
    selectedDeposite: DepositeOutput | null,
    search: string,
    setSearch: (search: string) => void
    setDeposites: (deposites: DepositeOutput[]) => void
    setSelectedDeposite: (deposite: DepositeOutput) => void
    addDeposite: (deposite: DepositeOutput) => void
    deleteDeposite: (id: string) => void
}