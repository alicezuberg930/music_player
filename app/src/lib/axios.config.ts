import axiosInstance, { AxiosError } from 'axios'

export const axios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Accept: 'application/json' },
    validateStatus: (status) => status >= 200 && status < 500
})

axios.interceptors.request.use(async (config) => {
    if (document !== undefined) {
        const response = await fetch(`/api/auth/token`)
        const accessToken = (await response.json()).token as string
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        } else {
            delete config.headers['Authorization']
        }
    }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    console.log(error)
    if (!error.response) {
        console.log('Network err', error.message)
    } else {
        switch (error?.response.status) {
            case 401:
            // window.location.href = '/'
            // break
            case 404:
                console.log('error.response.message', error)
                break
            default:
                console.log(
                    `%c ${error.response.status}  :`,
                    'color: red font-weight: bold',
                    error.config,
                )
                break
        }
    }
})