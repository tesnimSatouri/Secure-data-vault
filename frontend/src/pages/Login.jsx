import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../features/auth/authSlice'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [user, navigate])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }

        dispatch(login(userData))
    }

    if (isLoading) {
        return <div className="heading">Loading...</div>
    }

    return (
        <>
            <section className="heading">
                <h1>
                    Login
                </h1>
                <p>Login to your secure vault</p>
            </section>

            <section className="form-container">
                <form onSubmit={onSubmit} className="form" noValidate>
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

                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Login
