import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import VaultList from '../components/vault/VaultList'

function Dashboard() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    return (
        <>
            <section className="heading">
                <h1>Welcome {user && user.name}</h1>
                <p>Secure Vault Dashboard</p>
            </section>

            <VaultList />
        </>
    )
}

export default Dashboard
