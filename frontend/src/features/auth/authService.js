import api from '../../services/api'

const register = async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
}

const login = async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data
}

const verifyEmail = async (token) => {
    const res = await api.post('/auth/verify-email', { token })
    return res.data
}

// User Profile Service
const updateProfile = async (userData) => {
    const res = await api.put('/users/me', userData)
    return res.data
}

const changePassword = async (passwordData) => {
    const res = await api.put('/users/change-password', passwordData)
    return res.data
}

const deleteAccount = async () => {
    const res = await api.delete('/users/me')
    return res.data
}

export default { register, login, verifyEmail, updateProfile, changePassword, deleteAccount }
