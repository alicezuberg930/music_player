import axiosInstance, { AxiosError } from 'axios'

export const axios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Accept: 'application/json' },
    withCredentials: true, // This enables sending cookies with every request
    validateStatus: (status) => status >= 200 && status < 500
})

axios.interceptors.request.use(async (config) => {
    // if (document !== undefined) {
    //     const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imo5Z3Z4ZzRzbDFsZzJtNGFhMWYxdDMzMCIsImlhdCI6MTc2MzczNDIzN30.dEcNmslX9vSaBH4wbCEBqAJOAPBNgvyP-d0Bl0ByW4g"
    //     if (accessToken) {
    //         config.headers['Authorization'] = `Bearer ${accessToken}`
    //     } else {
    //         // delete config.headers['Authorization']
    //     }
    // }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    return response
}, (error: AxiosError) => {
    // if (!error.response) {
    //     console.log('Network err', error)
    // } else {
    //     switch (error.response.status) {
    //         case 401:
    //         case 404:
    //         default:
    //             break
    //     }
    // }
    console.log(error.response)
})