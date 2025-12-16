import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../components/common/Modal'
import { changePassword, deleteAccount, reset, updateProfile } from '../features/auth/authSlice'
import { fetchSessions, revokeSession } from '../features/session/sessionSlice'

function Profile() {
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)
    const { list: sessions, isLoading: sessionsLoading } = useSelector((state) => state.session)

    const [name, setName] = useState(user?.name || '')
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const dispatch = useDispatch()

    // Sync local state with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '')
        }
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            // Clear passwords on success
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            })
            // Reset state after 3 seconds to clear success message
            setTimeout(() => {
                dispatch(reset())
            }, 3000)
        }
    }, [isSuccess, dispatch])

    useEffect(() => {
        dispatch(fetchSessions())
    }, [dispatch])

    const handleUpdateProfile = (e) => {
        e.preventDefault()
        dispatch(updateProfile({ name }))
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("New passwords do not match")
            return
        }
        dispatch(changePassword({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        }))
    }

    const onPasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        })
    }

    const handleDeleteAccount = () => {
        dispatch(deleteAccount())
        setIsDeleteModalOpen(false)
    }

    const handleRevokeSession = (id) => {
        if (window.confirm('Are you sure you want to revoke this session?')) {
            dispatch(revokeSession(id))
        }
    }

    if (isLoading) {
        return <div className="card-container text-center"><h1>Loading...</h1></div>
    }

    return (
        <div className="card-container" style={{ maxWidth: '600px' }}>
            <h1 className="card-title">My Profile</h1>
            <p className="card-subtitle">Manage your account settings</p>

            {isError && <div className="error-message" style={{ marginBottom: '1rem' }}>{message}</div>}
            {isSuccess && <div className="error-message" style={{ marginBottom: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.2)' }}>{message}</div>}

            <div className="card-content">
                <section style={{ marginBottom: '2rem' }}>
                    <h3>Profile Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label style={{ color: 'var(--text-secondary)' }}>Email</label>
                            <input type="text" className="form-control" value={user?.email} disabled style={{ opacity: 0.7 }} />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label style={{ color: 'var(--text-secondary)' }}>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-block">Update Profile</button>
                        </div>
                    </form>
                </section>

                <hr style={{ borderColor: 'var(--border-glass)', margin: '2rem 0' }} />

                <section>
                    <h3>Security</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={onPasswordChange}
                                placeholder="Current Password"
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={onPasswordChange}
                                placeholder="New Password"
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmNewPassword"
                                value={passwords.confirmNewPassword}
                                onChange={onPasswordChange}
                                placeholder="Confirm New Password"
                            />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-reverse btn-block">Change Password</button>
                        </div>
                    </form>
                </section>

                <hr style={{ borderColor: 'var(--border-glass)', margin: '2rem 0' }} />

                <section>
                    <h3>Active Sessions</h3>
                    <div style={{ marginTop: '1rem' }}>
                        {sessionsLoading ? (
                            <p>Loading sessions...</p>
                        ) : (
                            sessions && sessions.length > 0 ? (
                                sessions.map(session => (
                                    <div key={session.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-glass)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                                {session.device}
                                                {session.isCurrent && (
                                                    <span style={{
                                                        marginLeft: '0.5rem',
                                                        fontSize: '0.7em',
                                                        background: 'var(--success)',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        color: 'white'
                                                    }}>
                                                        Current
                                                    </span>
                                                )}
                                            </p>
                                            <p style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                                                {session.browser} on {session.os}
                                            </p>
                                            <p style={{ fontSize: '0.75em', color: 'var(--text-secondary)' }}>
                                                Last active: {new Date(session.lastActive).toLocaleString()}
                                            </p>
                                        </div>
                                        {!session.isCurrent && (
                                            <button
                                                type="button"
                                                className="btn btn-reverse"
                                                onClick={() => handleRevokeSession(session.id)}
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85em' }}
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No active sessions found.</p>
                            )
                        )}
                    </div>
                </section>

                <hr style={{ borderColor: 'var(--border-glass)', margin: '2rem 0' }} />

                <section style={{ opacity: 0.9 }}>
                    <h3 style={{ color: 'var(--danger)' }}>Danger Zone</h3>
                    <div style={{
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        background: 'rgba(239, 68, 68, 0.05)'
                    }}>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                            className="btn btn-block"
                            style={{ background: 'var(--danger)', color: 'white' }}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account?"
                footer={
                    <>
                        <button
                            className="btn btn-reverse"
                            onClick={() => setIsDeleteModalOpen(false)}
                            style={{ border: 'none' }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn"
                            onClick={handleDeleteAccount}
                            style={{ background: 'var(--danger)', color: 'white' }}
                        >
                            Delete Permanently
                        </button>
                    </>
                }
            >
                <p>
                    Are you absolutely sure you want to delete your account?
                    This action will permanently remove all your data and cannot be undone.
                </p>
            </Modal>
        </div>
    )
}

export default Profile
