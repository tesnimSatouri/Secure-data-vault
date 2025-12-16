import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Modal from '../components/common/Modal'
import { changePassword, deleteAccount, reset, updateProfile } from '../features/auth/authSlice'
import { fetchSessions, revokeSession } from '../features/session/sessionSlice'
import api from '../services/api'

// --- Styled Components ---

const PageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const PageSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
`

const Section = styled.section`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: transform 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-left: 1rem;
  }
`

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
`

const Input = styled.input`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  background: ${props => props.variant === 'danger'
        ? 'rgba(239, 68, 68, 0.1)'
        : (props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary)')};
  color: ${props => props.variant === 'danger'
        ? '#ef4444'
        : (props.variant === 'secondary' ? '#fff' : '#fff')};
  border: ${props => props.variant === 'danger'
        ? '1px solid rgba(239, 68, 68, 0.2)'
        : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    background: ${props => props.variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : undefined};
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`

const SessionCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 1px solid ${props => props.isCurrent ? 'rgba(34, 197, 94, 0.3)' : 'transparent'};
`

const Badge = styled.span`
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`

const DangerSection = styled(Section)`
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
`

const ExportInfo = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #93c5fd;
  font-size: 0.9rem;
`

// --- Component ---

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
    const [isExporting, setIsExporting] = useState(false)

    const dispatch = useDispatch()

    // Sync local state with user data
    useEffect(() => {
        if (user) {
            setName(user.name || '')
        }
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
            setTimeout(() => dispatch(reset()), 3000)
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
        setPasswords({ ...passwords, [e.target.name]: e.target.value })
    }

    const handleDeleteAccount = () => {
        dispatch(deleteAccount())
        setIsDeleteModalOpen(false)
    }

    const handleRevokeSession = (id) => {
        if (window.confirm('Revoke this session? The user will be logged out properly on their next action.')) {
            dispatch(revokeSession(id))
        }
    }

    const handleExportData = async () => {
        setIsExporting(true)
        try {
            const response = await api.get('/gdpr/export', { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `data-export-${user._id || 'user'}.json`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Export failed', error)
            alert('Failed to export data')
        } finally {
            setIsExporting(false)
        }
    }

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading profile...</div>
    }

    return (
        <PageContainer>
            <Header>
                <PageTitle>My Profile</PageTitle>
                <PageSubtitle>Manage your account, security, and privacy</PageSubtitle>
            </Header>

            {isError && <div className="error-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
            {isSuccess &&
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {message || 'Profile updated successfully'}
                </div>
            }

            <Section>
                <SectionTitle>👤 Profile Details</SectionTitle>
                <form onSubmit={handleUpdateProfile}>
                    <FormGrid>
                        <FormGroup>
                            <Label>Email Address</Label>
                            <Input value={user?.email} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Full Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Display Name"
                            />
                        </FormGroup>
                        <Button type="submit">Update Details</Button>
                    </FormGrid>
                </form>
            </Section>

            <Section>
                <SectionTitle>🔐 Password</SectionTitle>
                <form onSubmit={handleChangePassword}>
                    <FormGrid>
                        <FormGroup>
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={onPasswordChange}
                                placeholder="••••••••"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={onPasswordChange}
                                placeholder="••••••••"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                name="confirmNewPassword"
                                value={passwords.confirmNewPassword}
                                onChange={onPasswordChange}
                                placeholder="••••••••"
                            />
                        </FormGroup>
                        <Button type="submit" variant="secondary">Change Password</Button>
                    </FormGrid>
                </form>
            </Section>

            <Section>
                <SectionTitle>📱 Active Sessions</SectionTitle>
                {sessionsLoading ? (
                    <p style={{ color: '#aaa' }}>Loading sessions...</p>
                ) : (
                    sessions && sessions.length > 0 ? (
                        sessions.map(session => (
                            <SessionCard key={session.id} isCurrent={session.isCurrent}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center' }}>
                                        {session.device || 'Unknown Device'}
                                        {session.isCurrent && <Badge>Current</Badge>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                                        {session.browser} on {session.os} • {new Date(session.lastActive).toLocaleDateString()}
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <Button variant="danger" onClick={() => handleRevokeSession(session.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                        Revoke
                                    </Button>
                                )}
                            </SessionCard>
                        ))
                    ) : (
                        <p>No active sessions found.</p>
                    )
                )}
            </Section>

            <Section>
                <SectionTitle>🛡️ GDPR Privacy Data</SectionTitle>
                <ExportInfo>
                    Under GDPR Article 15 (Right of Access), you have the right to obtain a copy of your personal data.
                    Click details below to download a JSON file containing your profile info and decrypted vault items.
                </ExportInfo>
                <Button onClick={handleExportData} disabled={isExporting}>
                    {isExporting ? 'Preparing Download...' : '📥 Export My Data'}
                </Button>
            </Section>

            <DangerSection>
                <SectionTitle style={{ color: '#ef4444' }}>⚠️ Danger Zone</SectionTitle>
                <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)' }}>
                    Deleting your account is permanent. All your vault items and personal data will be erased immediately.
                </p>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Account</Button>
            </DangerSection>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account?"
                footer={null}
            >
                <p style={{ marginBottom: '2rem' }}>
                    Are you absolutely sure? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>Permanently Delete</Button>
                </div>
            </Modal>
        </PageContainer>
    )
}

export default Profile
