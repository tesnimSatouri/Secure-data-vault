import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, reset } from '../features/auth/authSlice'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(reset())
    }, [dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email))
    }

    if (isLoading) return <div className="heading">Sending...</div>

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '5rem' }}>
            <section className="heading">
                <h1>Forgot Password</h1>
                <p>Enter your email to reset your password</p>
            </section>

            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-block">Send Reset Link</button>
                </div>
            </form>

            {message && <div className={isError ? "error-message" : "success-message"} style={{
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

export default ForgotPassword
