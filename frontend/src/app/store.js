import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import vaultReducer from '../features/vault/vaultSlice'
import sessionReducer from '../features/session/sessionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    vault: vaultReducer
  }
})
