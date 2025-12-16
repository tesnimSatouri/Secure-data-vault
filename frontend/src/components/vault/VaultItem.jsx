import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { deleteVaultItem } from '../../features/vault/vaultSlice'
import api from '../../services/api'

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column; 
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #00f260, #0575e6); /* Example premium gradient */
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const Label = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Meta = styled.p`
  margin: 0.25rem 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  padding-left: 2rem; /* Align with text not icon */
`

const Badge = styled.span`
  background: ${props => {
    if (props.type === 'Work') return 'rgba(59, 130, 246, 0.2)'
    if (props.type === 'Finance') return 'rgba(16, 185, 129, 0.2)'
    if (props.type === 'Personal') return 'rgba(139, 92, 246, 0.2)'
    return 'rgba(255, 255, 255, 0.1)'
  }};
  color: ${props => {
    if (props.type === 'Work') return '#60a5fa'
    if (props.type === 'Finance') return '#34d399'
    if (props.type === 'Personal') return '#a78bfa'
    return '#9ca3af'
  }};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  border: 1px solid ${props => {
    if (props.type === 'Work') return 'rgba(59, 130, 246, 0.3)'
    if (props.type === 'Finance') return 'rgba(16, 185, 129, 0.3)'
    if (props.type === 'Personal') return 'rgba(139, 92, 246, 0.3)'
    return 'rgba(255, 255, 255, 0.2)'
  }};
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.variant === 'danger' ? '#ff3b30' : '#fff'};
  border: 1px solid ${props => props.variant === 'danger' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`

const SecretDisplay = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #00f260;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  word-break: break-all;
  position: relative;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin { to { transform: rotate(360deg); } }
`

const VaultItem = ({ item, onEdit }) => {
  const dispatch = useDispatch()
  const [showSecret, setShowSecret] = useState(false)
  const [secretContent, setSecretContent] = useState('')
  const [isLoadingSecret, setIsLoadingSecret] = useState(false)

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this secret?')) {
      dispatch(deleteVaultItem(item._id))
    }
  }

  const toggleSecret = async () => {
    if (showSecret) {
      setShowSecret(false)
      setSecretContent('')
    } else {
      setIsLoadingSecret(true)
      try {
        const response = await api.get(`/vault/${item._id}`)
        setSecretContent(response.data.content)
        setShowSecret(true)
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Could not decrypt info.'
        alert(`Decryption Failed: ${msg}`)
      } finally {
        setIsLoadingSecret(false)
      }
    }
  }

  return (
    <ItemCard>
      <Header>
        <div>
          <Label>
            🔒 {item.label || 'Untitled Secret'}
            <Badge type={item.category || 'General'}>{item.category || 'General'}</Badge>
          </Label>
          <Meta>Last updated: {new Date(item.createdAt).toLocaleDateString()}</Meta>
        </div>
      </Header>

      {showSecret && (
        <SecretDisplay>
          {secretContent}
        </SecretDisplay>
      )}

      <Actions>
        <ActionButton onClick={toggleSecret} disabled={isLoadingSecret}>
          {isLoadingSecret ? <Spinner /> : (showSecret ? '🙈 Hide' : '👁️ Reveal')}
        </ActionButton>

        <ActionButton onClick={() => onEdit(item)}>
          ✏️ Edit
        </ActionButton>

        <ActionButton variant="danger" onClick={handleDelete}>
          🗑️ Delete
        </ActionButton>
      </Actions>
    </ItemCard>
  )
}

export default VaultItem
