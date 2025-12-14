import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            animation: 'fadeIn 0.2s ease-in-out'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                padding: '2rem',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out',
                zIndex: 100000
            }} onClick={e => e.stopPropagation()}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)'
                    }}>{title}</h2>
                </div>

                <div style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    {children}
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem'
                }}>
                    {footer}
                </div>
            </div>
        </div>,
        document.body
    )
}

export default Modal
