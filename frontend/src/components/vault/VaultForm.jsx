import { useEffect, useState } from 'react';
import { FiBriefcase, FiCheck, FiChevronDown, FiCreditCard, FiFolder, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createVaultItem, updateVaultItem } from '../../features/vault/vaultSlice';
import api from '../../services/api'; // To fetch decrypted content if needed
import Modal from '../common/Modal';

const categoryIcons = {
    'General': <FiFolder />,
    'Work': <FiBriefcase />,
    'Personal': <FiUser />,
    'Finance': <FiCreditCard />
}

const SelectHeader = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    user-select: none;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
    }
`

const SelectList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-top: 0.5rem;
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`

const SelectOption = styled.div`
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${props => props.$isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)'};
    background: ${props => props.$isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
`

const VaultForm = ({ isOpen, onClose, itemToEdit }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        label: '',
        content: '',
        category: 'General'
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    const { label, content, category } = formData

    useEffect(() => {
        if (itemToEdit) {
            setFormData(prev => ({
                ...prev,
                label: itemToEdit.label,
                content: '',
                category: itemToEdit.category || 'General'
            }))
            // Optionally fetch secret to prefill
            const fetchSecret = async () => {
                setIsLoading(true)
                try {
                    const res = await api.get(`/vault/${itemToEdit._id}`)
                    setFormData(prev => ({ ...prev, content: res.data.content }))
                } catch (e) {
                    console.error("Failed to fetch secret for editing")
                } finally {
                    setIsLoading(false)
                }
            }
            fetchSecret()
        } else {
            setFormData({ label: '', content: '', category: 'General' })
        }
    }, [itemToEdit, isOpen]) // Reset when opening/changing item

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (itemToEdit) {
            dispatch(updateVaultItem({
                id: itemToEdit._id,
                itemData: { label, content, category }
            }))
        } else {
            dispatch(createVaultItem({ label, content, category }))
        }
        setFormData({ label: '', content: '', category: 'General' })
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={itemToEdit ? "Edit Secret" : "Add New Secret"}
        >
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="label" style={{ color: 'var(--text-secondary)' }}>Label</label>
                    <input
                        type="text"
                        name="label"
                        id="label"
                        className="form-control"
                        value={label}
                        onChange={onChange}
                        placeholder="Enter a label"
                        required
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem', position: 'relative' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Category</label>

                    <SelectHeader onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {categoryIcons[category]}
                            <span>{category}</span>
                        </div>
                        <FiChevronDown style={{
                            transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }} />
                    </SelectHeader>

                    {isCategoryOpen && (
                        <SelectList>
                            {Object.keys(categoryIcons).map((cat) => (
                                <SelectOption
                                    key={cat}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, category: cat }))
                                        setIsCategoryOpen(false)
                                    }}
                                    $isSelected={category === cat}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {categoryIcons[cat]}
                                        <span>{cat}</span>
                                    </div>
                                    {category === cat && <FiCheck color="#4f46e5" />}
                                </SelectOption>
                            ))}
                        </SelectList>
                    )}
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label htmlFor="content" style={{ color: 'var(--text-secondary)' }}>Secret Content</label>
                    <textarea
                        name="content"
                        id="content"
                        className="form-control"
                        value={content}
                        onChange={onChange}
                        placeholder={isLoading ? "Loading secret..." : "Enter your sensitive data here..."}
                        rows="5"
                        required
                        disabled={isLoading}
                    ></textarea>
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-reverse" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn" disabled={isLoading}>
                        {itemToEdit ? "Update Secret" : "Save to Vault"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default VaultForm
