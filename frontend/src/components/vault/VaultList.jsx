import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getVaultItems, reset } from '../../features/vault/vaultSlice'
import VaultForm from './VaultForm'
import VaultItem from './VaultItem'

const Container = styled.div`
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`

const AddButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.5);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  
  h3 {
    color: #fff;
    margin-bottom: 0.5rem;
  }
`

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`

const FilterButton = styled.button`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
  }
`

const VaultList = () => {
  const dispatch = useDispatch()
  const { items, isLoading, isError, message } = useSelector((state) => state.vault)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)


  const [filter, setFilter] = useState('All')

  useEffect(() => {
    dispatch(getVaultItems())

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const filteredItems = items.filter(item => {
    if (filter === 'All') return true
    const cat = item.category || 'General'
    return cat === filter
  })



  if (isLoading && items.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>decrypting vault...</div>
  }

  return (
    <Container>
      <Header>
        <Title>My Secure Vault</Title>
        <AddButton onClick={handleAddNew}>
          <span>+</span> New Secret
        </AddButton>
      </Header>

      <FilterContainer>
        {['All', 'General', 'Work', 'Personal', 'Finance'].map(cat => (
          <FilterButton
            key={cat}
            $active={filter === cat}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </FilterButton>
        ))}
      </FilterContainer>

      {isError && <div className="error-message" style={{ marginBottom: '1rem' }}>{message}</div>}

      {filteredItems.length > 0 ? (
        <Grid>
          {filteredItems.map((item) => (
            <VaultItem
              key={item._id}
              item={item}
              onEdit={handleEdit}
            />
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <h3>Your vault is empty</h3>
          <p>Securely store your passwords, notes, and IDs here.</p>
        </EmptyState>
      )}

      <VaultForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={editingItem}
      />
    </Container>
  )
}

export default VaultList
