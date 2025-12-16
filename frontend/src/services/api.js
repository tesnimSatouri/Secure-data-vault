import axios from 'axios'

let store

export const injectStore = (_store) => {
    store = _store
}

const api = axios.create({
    baseURL: 'http://localhost:5000'
})

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if it's not the login page itself (to avoid loops if login fails with 401)
            if (!window.location.pathname.includes('/login')) {
                if (store) {
                    store.dispatch({ type: 'auth/logout' })
                }
                // Optional: Alert user
                // alert('Session expired. Please login again.')
            }
        }
        return Promise.reject(error)
    }
)

export default api
