import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

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
                <p>Dashboard</p>
            </section>

            <section className="content">
                <p>Your secure data vault is ready.</p>
            </section>
        </>
    )
}

export default Dashboard
