import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout, reset } from '../../features/auth/authSlice'

export default function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className='header'>
            <div className="container header-content">
                <div className='logo'>
                    <Link to='/'>Secure Vault</Link>
                </div>
                <ul>
                    {user ? (
                        <li>
                            <button className='btn' onClick={onLogout}>
                                Logout
                            </button>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to='/login'>
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to='/register'>
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    )
}
