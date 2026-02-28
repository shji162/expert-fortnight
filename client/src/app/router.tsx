import { Route, Routes } from "react-router"
import { adminRoutes, authRoutes, publicRoutes } from "../shared/consts/routes"
import { useUsers } from "../store/users.store"
import { useUserCheckMutation } from "../hooks/auth/refresh.mutation"
import { useEffect } from "react"


export const AppRouter = () => {

    const refresh = useUserCheckMutation()
    const {isAuth, isAdmin} = useUsers((state) => state)

    useEffect(() => {
        refresh.mutate()
    }, [])


    return (
        <>
        <Routes>
            {
                publicRoutes.map(el => {
                    return(
                        <Route path={el.path} element={<el.element/>}/>
                    )
                })
            }
            {
                isAuth ? 
                authRoutes.map(el => {
                    return(
                        <Route path={el.path} element={<el.element/>}/>
                    )
                }

                ) : ''
            }
            {
                isAdmin ? 
                adminRoutes.map(el => {
                    return(
                        <Route path={el.path} element={<el.element/>}/>
                    )
                }

                ) : ''
            }
        </Routes>
        </>
    )
}