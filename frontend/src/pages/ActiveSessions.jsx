import { useEffect } from 'react'
import styled from 'styled-components'
import { useSessions } from '../app/hooks'

const Container = styled.div`
  padding: 2rem;
`

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`

const ActiveSessions = () => {
    const { list, isLoading, isError, loadSessions, removeSession } = useSessions()

    useEffect(() => {
        loadSessions()
    }, [])

    if (isLoading) return <p>Loading sessions...</p>
    if (isError) return <p>Error loading sessions.</p>

    return (
        <Container>
            <h2>Active Sessions</h2>
            {list.length === 0 ? (
                <p>No active sessions.</p>
            ) : (
                list.map(session => (
                    <SessionItem key={session.id}>
                        <span>{session.device || 'Unknown Device'} – {new Date(session.lastUsed).toLocaleString()}</span>
                        <button onClick={() => removeSession(session.id)}>Revoke</button>
                    </SessionItem>
                ))
            )}
        </Container>
    )
}

export default ActiveSessions
