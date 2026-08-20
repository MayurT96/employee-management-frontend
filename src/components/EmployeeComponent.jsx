import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
    UsersIcon,
    MailIcon,
    ArrowLeftIcon,
    SparklesIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    BuildingIcon
} from './Icons'
import Toast from './Toast'

const EmployeeComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    
    // UI states
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState(null)

    const { id } = useParams()
    const navigator = useNavigate()
    const BASE_URL = 'https://ems-backend-1-9k1k.onrender.com/api/employees'

    useEffect(() => {
        if (id) {
            axios.get(`${BASE_URL}/${id}`)
                .then((response) => {
                    setFirstName(response.data.firstName || '')
                    setLastName(response.data.lastName || '')
                    setEmail(response.data.email || '')
                })
                .catch(error => {
                    console.error(error)
                    setToast({ type: 'error', message: 'Failed to fetch employee details. Server may be connecting.' })
                })
        }
    }, [id])

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {}
        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!email.trim()) {
            newErrors.email = 'Email address is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        const employee = { 
            firstName: firstName.trim(), 
            lastName: lastName.trim(), 
            email: email.trim() 
        }

        if (id) {
            axios.put(`${BASE_URL}/${id}`, employee)
                .then(() => {
                    setIsSubmitting(false)
                    navigator('/employees')
                })
                .catch(error => {
                    console.error(error)
                    setIsSubmitting(false)
                    setToast({ type: 'error', message: 'Failed to update employee. Please check connection.' })
                })
        } else {
            axios.post(BASE_URL, employee)
                .then(() => {
                    setIsSubmitting(false)
                    navigator('/employees')
                })
                .catch(error => {
                    console.error(error)
                    setIsSubmitting(false)
                    setToast({ type: 'error', message: 'Failed to save employee. Please check connection.' })
                })
        }
    }

    // Avatar preview initials
    const getInitials = () => {
        const f = firstName ? firstName[0].toUpperCase() : ''
        const l = lastName ? lastName[0].toUpperCase() : ''
        return (f + l) || '?'
    }

    return (
        <div className="main-wrapper">
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Top Navigation */}
            <div className="mb-4">
                <Link to="/employees" className="btn-modern-secondary btn-sm">
                    <ArrowLeftIcon size={16} />
                    <span>Back to Directory</span>
                </Link>
            </div>

            <div className="form-page-layout">
                {/* FORM INPUT SECTION */}
                <div className="form-main-card">
                    <div className="form-card-header">
                        <h2 className="form-header-title">
                            {id ? 'Update Employee Profile' : 'Register New Employee'}
                        </h2>
                        <p className="form-header-subtitle">
                            {id 
                                ? 'Modify existing staff credentials and information' 
                                : 'Fill in the information below to add a new team member'}
                        </p>
                    </div>

                    <div className="form-card-body">
                        <form onSubmit={saveOrUpdateEmployee} noValidate>
                            {/* First Name */}
                            <div className="form-group-modern">
                                <label className="form-label-modern">First Name</label>
                                <div className="input-with-icon">
                                    <UsersIcon size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Alex"
                                        name="firstName"
                                        value={firstName}
                                        className={`form-input-modern ${errors.firstName ? 'is-invalid' : ''}`}
                                        onChange={(e) => {
                                            setFirstName(e.target.value)
                                            if (errors.firstName) setErrors(prev => ({ ...prev, firstName: null }))
                                        }}
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="invalid-feedback-text">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="form-group-modern">
                                <label className="form-label-modern">Last Name</label>
                                <div className="input-with-icon">
                                    <UsersIcon size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Johnson"
                                        name="lastName"
                                        value={lastName}
                                        className={`form-input-modern ${errors.lastName ? 'is-invalid' : ''}`}
                                        onChange={(e) => {
                                            setLastName(e.target.value)
                                            if (errors.lastName) setErrors(prev => ({ ...prev, lastName: null }))
                                        }}
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="invalid-feedback-text">{errors.lastName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-group-modern">
                                <label className="form-label-modern">Email Address</label>
                                <div className="input-with-icon">
                                    <MailIcon size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="e.g. alex.johnson@company.com"
                                        name="email"
                                        value={email}
                                        className={`form-input-modern ${errors.email ? 'is-invalid' : ''}`}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (errors.email) setErrors(prev => ({ ...prev, email: null }))
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="invalid-feedback-text">{errors.email}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="form-actions-row">
                                <Link to="/employees" className="btn-modern-secondary">
                                    Cancel
                                </Link>
                                <button 
                                    type="submit" 
                                    className="btn-modern-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>Saving Profile...</span>
                                    ) : (
                                        <>
                                            <CheckCircleIcon size={18} />
                                            <span>{id ? 'Save Changes' : 'Create Employee'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* LIVE ID CARD PREVIEW */}
                <div className="preview-sticky-wrap d-none d-md-block">
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <SparklesIcon size={16} className="text-primary" />
                        <span className="fw-bold small text-uppercase text-muted">Live ID Preview</span>
                    </div>

                    <div className="live-id-badge-card">
                        <div className="live-badge-top">
                            <span className="live-badge-company">EMS ENTERPRISE</span>
                            <span className="live-badge-tag">{id ? `ID #${id}` : 'NEW PASS'}</span>
                        </div>

                        <div className="live-badge-body">
                            <div className="live-badge-avatar">
                                {getInitials()}
                            </div>
                            <h3 className="live-badge-name">
                                {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Employee Name'}
                            </h3>
                            <p className="live-badge-email">
                                {email || 'employee.email@domain.com'}
                            </p>
                            <div className="live-badge-chip">
                                <BuildingIcon size={14} />
                                <span>VERIFIED MEMBER</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeComponent