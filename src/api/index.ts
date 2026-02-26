import axios from "axios"
import backendRoutes  from "../shared/consts/backendRoutes"
import { requestInterceptor, resInterceptorError } from "./interceptors/auth.interceptor"

export default new class hosts {
    private createHost(baseURL: string) {
        const host = axios.create({
            baseURL: baseURL,
            withCredentials: true
        })
        
        host.interceptors.request.use(requestInterceptor)
        host.interceptors.response.use((config) => {
            return config
        }, resInterceptorError)

        return host
    }

    $authHost = this.createHost(backendRoutes.authRoute)
    $usersHost = this.createHost(backendRoutes.usersRoute)
    $auctionsHost = this.createHost(backendRoutes.auctionsRoute)
    $depositesHost = this.createHost(backendRoutes.depositesRoute)
    $ratesHost = this.createHost(backendRoutes.ratesRoute)
    $mediaHost = this.createHost(backendRoutes.mediaRoute)
    $historyHost = this.createHost(backendRoutes.authRoute)
     $emailConfirmationHost = this.createHost(backendRoutes.emailConfirmationRoute)
    $passwordRecoveryHost = this.createHost(backendRoutes.passwordRecoveryRoute)
}
