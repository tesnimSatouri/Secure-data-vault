import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { reset, resetPassword } from '../features/auth/authSlice'

function ResetPassword() {
    const [passwords, setPasswords] = useState({ password: '', confirm: '' })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams()
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                dispatch(reset())
                navigate('/login')
            }, 3000)
        }
    }, [isSuccess, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        if (passwords.password !== passwords.confirm) {
            alert('Passwords do not match')
            return
        }
        const cleanToken = token.trim().split(' ')[0]
        dispatch(resetPassword({ token: cleanToken, password: passwords.password }))
    }

    if (isLoading) return <div className="heading">Resetting...</div>

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '5rem' }}>
            <section className="heading">
                <h1>Reset Password</h1>
                <p>Enter your new password</p>
            </section>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        value={passwords.password}
                        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-block">Set New Password</button>
                </div>
            </form>

            {message && <div style={{
                marginTop: '1rem',
                padding: '10px',
                background: isError ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
                color: isError ? 'red' : 'lightgreen',
                borderRadius: '5px',
                textAlign: 'center'
            }}>
                {message}
            </div>}
        </div>
    )
}

export default ResetPassword
