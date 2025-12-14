import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user || null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        try {
            return await authService.login(data)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (data, thunkAPI) => {
        try {
            return await authService.register(data)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token, thunkAPI) => {
        try {
            return await authService.verifyEmail(token)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            localStorage.removeItem('user')
        },
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                localStorage.setItem('user', JSON.stringify(action.payload))
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(register.pending, (state) => { // Added pending state for register
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload.message
                // Do not set user, requiring login after verification
            })
            .addCase(register.rejected, (state, action) => { // Added rejected state for register
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(verifyEmail.pending, (state) => {
                state.isLoading = true
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload.message
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { logout, reset } = authSlice.actions
export default authSlice.reducer
