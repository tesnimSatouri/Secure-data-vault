import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register } from '../features/auth/authSlice'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        checkPassword: '',
    })

    const [passwordError, setPasswordError] = useState('')

    const { name, email, password, checkPassword } = formData

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

        if (password !== checkPassword) {
            setPasswordError('Passwords do not match')
            return
        } else {
            setPasswordError('')
        }

        const userData = {
            name,
            email,
            password,
        }

        dispatch(register(userData))
    }

    if (isLoading) {
        return <div className="heading">Loading...</div>
    }

    return (
        <>
            <section className="heading">
                <h1>
                    Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className="form-container">
                <form onSubmit={onSubmit} className="form">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
                            placeholder="Enter your name"
                            onChange={onChange}
                            required
                        />
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
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            id="checkPassword"
                            name="checkPassword"
                            value={checkPassword}
                            placeholder="Confirm password"
                            onChange={onChange}
                            required
                        />
                    </div>

                    {passwordError && <div className="error-message">{passwordError}</div>}
                    {isError && <div className="error-message">{message}</div>}

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

export default Register
