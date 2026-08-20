import React, { useEffect } from 'react'
import { CheckCircleIcon, AlertCircleIcon, XIcon } from './Icons'

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => {
            onClose()
        }, 4000)
        return () => clearTimeout(timer)
    }, [toast, onClose])

    if (!toast) return null

    const isSuccess = toast.type === 'success'

    return (
        <div className={`toast-notification ${isSuccess ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-icon">
                {isSuccess ? <CheckCircleIcon size={20} /> : <AlertCircleIcon size={20} />}
            </div>
            <div className="toast-content">
                <p className="toast-title">{isSuccess ? 'Success' : 'Error'}</p>
                <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close" onClick={onClose} aria-label="Close notification">
                <XIcon size={16} />
            </button>
        </div>
    )
}

export default Toast
