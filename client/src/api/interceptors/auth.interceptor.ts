import auth from "../endpoints/auth"
import hosts from "../index"



export const requestInterceptor = (config: any) => { 
    try {
        const accessToken = localStorage.getItem('token')

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
    
        return config
    } catch (error) {
        return config
    }
}

export const resInterceptorError = async (error: any) => {
    const originalReq = error.config
    if(error.response.status === 401 && error.config && !error.config._isRetry){
        originalReq._isRetry = true
        try {
            const tokens = await auth.refresh()
            localStorage.setItem('accesstoken', tokens.data.accessToken)
            return hosts.$authHost.request(originalReq)
        } catch (error) {
            
        }
    }
    throw error
}

