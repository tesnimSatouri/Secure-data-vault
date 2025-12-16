// Session slice for managing active user sessions
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSessions = createAsyncThunk('session/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/sessions')
        return response.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const revokeSession = createAsyncThunk('session/revoke', async (sessionId, thunkAPI) => {
    try {
        await api.delete(`/sessions/${sessionId}`)
        return sessionId
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

const sessionSlice = createSlice({
    name: 'session',
    initialState: { list: [], isLoading: false, isError: false, message: '' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessions.pending, (state) => { state.isLoading = true })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.isLoading = false
                state.list = action.payload
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(revokeSession.fulfilled, (state, action) => {
                state.list = state.list.filter(s => s.id !== action.payload)
            })
    }
})

export default sessionSlice.reducer
