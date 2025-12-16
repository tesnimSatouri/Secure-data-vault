import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

// Get all vault items
export const getVaultItems = createAsyncThunk('vault/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/vault')
        return response.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

// Create new vault item
export const createVaultItem = createAsyncThunk('vault/create', async (itemData, thunkAPI) => {
    try {
        const response = await api.post('/vault', itemData)
        return response.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

// Update vault item
export const updateVaultItem = createAsyncThunk('vault/update', async ({ id, itemData }, thunkAPI) => {
    try {
        const response = await api.put(`/vault/${id}`, itemData)
        return response.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

// Delete vault item
export const deleteVaultItem = createAsyncThunk('vault/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`/vault/${id}`)
        return id
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

// Get decrypted content for a specific item (optional, depending on UI flow)
export const getVaultItemDecrypted = createAsyncThunk('vault/getDecrypted', async (id, thunkAPI) => {
    try {
        const response = await api.get(`/vault/${id}`)
        return response.data // { id, label, content: "decrypted string", createdAt }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message)
    }
})

const vaultSlice = createSlice({
    name: 'vault',
    initialState: {
        items: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVaultItems.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getVaultItems.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.items = action.payload
            })
            .addCase(getVaultItems.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createVaultItem.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createVaultItem.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.items.push(action.payload)
            })
            .addCase(createVaultItem.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateVaultItem.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                const index = state.items.findIndex(item => item._id === action.payload._id)
                if (index !== -1) {
                    state.items[index] = action.payload
                }
            })
            .addCase(deleteVaultItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload)
            })
            .addCase(deleteVaultItem.rejected, (state, action) => {
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = vaultSlice.actions
export default vaultSlice.reducer
