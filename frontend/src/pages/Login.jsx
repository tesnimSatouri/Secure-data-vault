import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, verify2FA } from '../features/auth/authSlice'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        code: ''
    })

    const { email, password, code } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, message, twoFactorRequired, tempUserId } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (user) {
            navigate('/')
        }

        // Reset state on unmount or when leaving (optional)
        return () => {
            // dispatch(reset()) 
        }
    }, [user, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (twoFactorRequired) {
            dispatch(verify2FA({ userId: tempUserId, code }))
        } else {
            const userData = { email, password }
            dispatch(login(userData))
        }
    }

    if (isLoading) {
        return <div className="heading">Loading...</div>
    }

    return (
        <>
            <section className="heading">
                <h1>{twoFactorRequired ? 'Two-Factor Auth' : 'Login'}</h1>
                <p>{twoFactorRequired ? 'Enter the 6-digit code sent to your email' : 'Login to your secure vault'}</p>
            </section>

            <section className="form-container">
                <form onSubmit={onSubmit} className="form" noValidate>
                    {!twoFactorRequired ? (
                        <>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Enter your email"
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Enter password"
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="code"
                                name="code"
                                value={code}
                                placeholder="Enter 6-digit Code"
                                onChange={onChange}
                                required
                                maxLength="6"
                                style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem' }}
                            />
                        </div>
                    )}

                    {isError && (
                        <div className="error-message">
                            {message}
                            {message.includes('verify') && (
                                <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                    Check your spam folder or register again if you didn't receive the email.
                                </p>
                            )}
                        </div>
                    )}

                    {!twoFactorRequired && (
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <a href="/forgot-password" style={{ color: '#aaa', fontSize: '0.9rem', textDecoration: 'none' }}>
                                Forgot Password?
                            </a>
                        </div>
                    )}

                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            {twoFactorRequired ? 'Verify Code' : 'Submit'}
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login
