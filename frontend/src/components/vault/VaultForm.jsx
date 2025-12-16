import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createVaultItem, updateVaultItem } from '../../features/vault/vaultSlice'
import api from '../../services/api'; // To fetch decrypted content if needed
import Modal from '../common/Modal'

const VaultForm = ({ isOpen, onClose, itemToEdit }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        label: '',
        content: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const { label, content } = formData

    useEffect(() => {
        if (itemToEdit) {
            setFormData(prev => ({ ...prev, label: itemToEdit.label, content: '' }))
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
            setFormData({ label: '', content: '' })
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
                itemData: { label, content }
            }))
        } else {
            dispatch(createVaultItem({ label, content }))
        }
        setFormData({ label: '', content: '' })
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
