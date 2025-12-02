import axiosInstance from 'axios'

export const axios = axiosInstance.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Accept: 'application/json' },
    withCredentials: true, // This enables sending cookies with every request
    validateStatus: (status) => status >= 200 && status < 500
})

// Add request and response interceptors if needed
// For example, you can add an authorization token to the headers or handle errors globally
axios.interceptors.request.use(config => {
    return config
}, (error) => {
    return Promise.reject(error)
})

// Handle responses globally
// You can log errors or handle specific status codes here
axios.interceptors.response.use(response => {
    return response
}, (error) => {
    console.log(error)
    return Promise.reject(error)
})