
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { reset, verifyEmail } from '../features/auth/authSlice'

function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (!token) {
            // If no token, redirect to login
            navigate('/login')
        } else {
            // Dispatch verification
            dispatch(verifyEmail(token))
        }

        // Cleanup on unmount
        return () => {
            dispatch(reset())
        }
    }, [token, dispatch, navigate])

    if (isLoading) {
        return (
            <div className="card-container text-center">
                <span className="icon-large">🔄</span>
                <h1 className="card-title">Verifying...</h1>
                <p>Please wait while we verify your email address.</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="card-container text-center">
                <span className="icon-large">❌</span>
                <h1 className="card-title">Verification Failed</h1>
                <p className="error-text" style={{ fontSize: '1.2rem', margin: '1rem 0' }}>{message}</p>
                <div className="mt-4">
                    <Link to="/register" className="btn">
                        Register Again
                    </Link>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="card-container text-center">
                <span className="icon-large">✅</span>
                <h1 className="card-title">Verification Successful!</h1>
                <p className="card-subtitle">Your account has been verified.</p>
                <div className="mt-4">
                    <Link to="/login" className="btn btn-block">
                        Login Now
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="card-container text-center">
            <span className="icon-large">🔄</span>
            <h1 className="card-title">Verifying Email...</h1>
        </div>
    )
}

export default VerifyEmail
