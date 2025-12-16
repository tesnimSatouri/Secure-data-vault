import { useDispatch, useSelector } from 'react-redux'
import { fetchSessions, revokeSession } from '../features/session/sessionSlice'

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector

export const useSessions = () => {
    const dispatch = useAppDispatch()
    const { list, isLoading, isError, message } = useAppSelector(state => state.session)

    const loadSessions = () => dispatch(fetchSessions())
    const removeSession = (id) => dispatch(revokeSession(id))

    return { list, isLoading, isError, message, loadSessions, removeSession }
}
