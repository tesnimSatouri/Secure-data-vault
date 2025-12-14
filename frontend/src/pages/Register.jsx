import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { register, reset } from '../features/auth/authSlice'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        checkPassword: '',
        consent: false,
    })

    const [errors, setErrors] = useState({})

    const { name, email, password, checkPassword, consent } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            // Error is handled in render
        }

        if (isSuccess) {
            // Form cleaned up in render
        }
    }, [isError, isSuccess, message, navigate, dispatch])

    // Clean up state on unmount
    useEffect(() => {
        return () => {
            dispatch(reset())
        }
    }, [dispatch])

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: value,
        }))
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!name.trim()) newErrors.name = 'Name is required'

        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'Password must be 8+ chars, have 1 uppercase, 1 lowercase, 1 number, and 1 special char.'
        }

        if (password !== checkPassword) {
            newErrors.checkPassword = 'Passwords do not match'
        }

        if (!consent) {
            newErrors.consent = 'You must agree to the Terms and Privacy Policy'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            const userData = {
                name,
                email,
                password,
            }
            dispatch(register(userData))
        }
    }

    if (isLoading) {
        return <div className="heading">Loading...</div>
    }

    if (isSuccess) {
        return (
            <div className="card-container text-center">
                <span className="icon-large">📧</span>
                <h1 className="card-title">Check your email</h1>
                <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
                    We have sent a verification link to <strong>{email}</strong>.
                </p>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    Please check your inbox (and spam folder) and click the link to activate your account.
                </p>
                <div className="mt-4">
                    <Link to="/login" className="btn btn-reverse">
                        Proceed to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <>
            <section className="heading">
                <h1>
                    Register
                </h1>
                <p>Create your secure account</p>
            </section>

            <section className="form-container">
                <form onSubmit={onSubmit} className="form" noValidate>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
                            placeholder="Enter your name"
                            onChange={onChange}
                        />
                        {errors.name && <small className="error-text">{errors.name}</small>}
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={onChange}
                        />
                        {errors.email && <small className="error-text">{errors.email}</small>}
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
                        />
                        {errors.password && <small className="error-text">{errors.password}</small>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="checkPassword"
                            name="checkPassword"
                            value={checkPassword}
                            placeholder="Confirm password"
                            onChange={onChange}
                        />
                        {errors.checkPassword && <small className="error-text">{errors.checkPassword}</small>}
                    </div>

                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            id="consent"
                            name="consent"
                            checked={consent}
                            onChange={onChange}
                        />
                        <label htmlFor="consent">
                            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
                        </label>
                    </div>
                    {errors.consent && <small className="error-text">{errors.consent}</small>}

                    {isError && <div className="error-message">{message}</div>}

                    <div className="form-group">
                        <button type="submit" className="btn btn-block">
                            Secure Register
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register
