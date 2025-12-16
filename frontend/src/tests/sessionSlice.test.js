// Tests for sessionSlice
import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import thunk from 'redux-thunk'
import sessionReducer, { fetchSessions, revokeSession } from '../features/session/sessionSlice'

const mock = new MockAdapter(axios)

describe('sessionSlice', () => {
    const store = configureStore({
        reducer: { session: sessionReducer },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
    })

    afterEach(() => {
        mock.reset()
    })

    it('should handle fetchSessions fulfilled', async () => {
        const sessions = [{ id: '1', device: 'Chrome', lastUsed: '2025-01-01T00:00:00Z' }]
        mock.onGet('/sessions').reply(200, sessions)
        await store.dispatch(fetchSessions())
        const state = store.getState().session
        expect(state.list).toEqual(sessions)
        expect(state.isLoading).toBe(false)
        expect(state.isError).toBe(false)
    })

    it('should handle revokeSession fulfilled', async () => {
        const initial = [{ id: '1' }, { id: '2' }]
        store.dispatch({ type: fetchSessions.fulfilled.type, payload: initial })
        mock.onDelete('/sessions/1').reply(200)
        await store.dispatch(revokeSession('1'))
        const state = store.getState().session
        expect(state.list).toEqual([{ id: '2' }])
    })
})
