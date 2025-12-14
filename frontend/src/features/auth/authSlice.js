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

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, thunkAPI) => {
        try {
            return await authService.updateProfile(userData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwordData, thunkAPI) => {
        try {
            return await authService.changePassword(passwordData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteAccount = createAsyncThunk(
    'auth/deleteAccount',
    async (_, thunkAPI) => {
        try {
            return await authService.deleteAccount()
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
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = { ...state.user, name: action.payload.name } // Update local user state
                localStorage.setItem('user', JSON.stringify({ ...state.user, name: action.payload.name }))
                state.message = 'Profile updated successfully'
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload.message
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // Delete Account
            .addCase(deleteAccount.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = null
                localStorage.removeItem('user')
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { logout, reset } = authSlice.actions
export default authSlice.reducer
