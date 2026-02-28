import { BrowserRouter } from "react-router"
import { AppRouter } from "./router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Header } from "../components/header/header"

const queryClient = new QueryClient()


function App() {
  

  return (
    <>
    <QueryClientProvider client={queryClient}>
       <BrowserRouter>
          <Header/>
        <AppRouter/>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  )
}

export default App
