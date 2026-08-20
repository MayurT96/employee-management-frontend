import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
    UsersIcon,
    UserPlusIcon,
    SearchIcon,
    EditIcon,
    TrashIcon,
    MailIcon,
    EyeIcon,
    RefreshCwIcon,
    GridIcon,
    ListIcon,
    SparklesIcon,
    BuildingIcon,
    AlertCircleIcon,
    CopyIcon,
    XIcon
} from './Icons'
import Toast from './Toast'

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState({ show: false, employee: null, isDeleting: false })
    const [previewModal, setPreviewModal] = useState({ show: false, employee: null })
    
    // Toast notification
    const [toast, setToast] = useState(null)
    const [copiedEmail, setCopiedEmail] = useState(null)

    const navigator = useNavigate()
    const BASE_URL = 'https://ems-backend-1-9k1k.onrender.com/api/employees'

    useEffect(() => {
        getAllEmployees()
    }, [])

    function getAllEmployees() {
        setLoading(true)
        setError(null)
        axios.get(BASE_URL)
            .then(response => {
                setEmployees(Array.isArray(response.data) ? response.data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Backend server might be waking up (Render cold-start). Please wait a few seconds or retry.')
                setLoading(false)
            })
    }

    function addNewEmployee() {
        navigator('/add-employee')
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`)
    }

    function openDeleteModal(employee) {
        setDeleteModal({ show: true, employee, isDeleting: false })
    }

    function closeDeleteModal() {
        setDeleteModal({ show: false, employee: null, isDeleting: false })
    }

    function confirmDelete() {
        if (!deleteModal.employee) return
        setDeleteModal(prev => ({ ...prev, isDeleting: true }))

        axios.delete(`${BASE_URL}/${deleteModal.employee.id}`)
            .then(() => {
                setToast({ type: 'success', message: `${deleteModal.employee.firstName} was successfully removed.` })
                closeDeleteModal()
                getAllEmployees()
            })
            .catch(err => {
                console.error(err)
                setToast({ type: 'error', message: 'Failed to delete employee. Please try again.' })
                setDeleteModal(prev => ({ ...prev, isDeleting: false }))
            })
    }

    function openPreviewModal(employee) {
        setPreviewModal({ show: true, employee })
    }

    function closePreviewModal() {
        setPreviewModal({ show: false, employee: null })
    }

    function handleCopyEmail(email) {
        if (!email) return
        navigator.clipboard?.writeText(email)
        setCopiedEmail(email)
        setToast({ type: 'success', message: `Copied "${email}" to clipboard!` })
        setTimeout(() => setCopiedEmail(null), 2500)
    }

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        if (!searchTerm.trim()) return employees
        const lower = searchTerm.toLowerCase()
        return employees.filter(emp => 
            (emp.firstName && emp.firstName.toLowerCase().includes(lower)) ||
            (emp.lastName && emp.lastName.toLowerCase().includes(lower)) ||
            (emp.email && emp.email.toLowerCase().includes(lower)) ||
            (emp.id && emp.id.toString().includes(lower))
        )
    }, [employees, searchTerm])

    // Get initials for avatar badge
    const getInitials = (firstName, lastName) => {
        const f = firstName ? firstName[0].toUpperCase() : ''
        const l = lastName ? lastName[0].toUpperCase() : ''
        return `${f}${l}` || 'EP'
    }

    return (
        <div className="main-wrapper">
            {/* Toast System */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Page Header */}
            <div className="page-header-section">
                <div>
                    <h1 className="page-title">Employee Directory</h1>
                    <p className="page-subtitle">Manage, search, and monitor all organization team members</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <button 
                        className="btn-modern-secondary" 
                        onClick={getAllEmployees} 
                        title="Refresh List"
                        disabled={loading}
                    >
                        <RefreshCwIcon size={16} className={loading ? 'fa-spin' : ''} />
                        <span>Sync Data</span>
                    </button>
                    <button className="btn-modern-primary" onClick={addNewEmployee}>
                        <UserPlusIcon size={18} />
                        <span>Add New Employee</span>
                    </button>
                </div>
            </div>

            {/* Metric Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-icon-primary">
                        <UsersIcon size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{employees.length}</span>
                        <span className="stat-label">Total Registered Staff</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-icon-success">
                        <SparklesIcon size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{filteredEmployees.length}</span>
                        <span className="stat-label">Showing in View</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-icon-accent">
                        <BuildingIcon size={26} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">Active</span>
                        <span className="stat-label">Directory Status</span>
                    </div>
                </div>
            </div>

            {/* Error / Cold Start Alert Box */}
            {error && (
                <div className="backend-alert-box">
                    <div className="d-flex align-items-center gap-2">
                        <AlertCircleIcon size={22} />
                        <span>{error}</span>
                    </div>
                    <button className="btn-modern-secondary btn-sm" onClick={getAllEmployees}>
                        Retry Now
                    </button>
                </div>
            )}

            {/* Search & View Controls Toolbar */}
            <div className="toolbar-card">
                <div className="search-box-wrapper">
                    <SearchIcon size={18} className="search-icon-inside" />
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Search employees by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                            <XIcon size={16} />
                        </button>
                    )}
                </div>

                <div className="toolbar-controls">
                    <div className="view-toggle-group">
                        <button 
                            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Table View"
                        >
                            <ListIcon size={16} />
                            <span className="d-none d-md-inline">Table</span>
                        </button>
                        <button 
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Card Grid View"
                        >
                            <GridIcon size={16} />
                            <span className="d-none d-md-inline">Cards</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area: Loading vs Empty vs Data */}
            {loading ? (
                <div className="table-card p-4">
                    <div className="d-flex flex-column gap-3">
                        <div className="skeleton" style={{ height: '40px', width: '100%' }}></div>
                        <div className="skeleton" style={{ height: '50px', width: '100%' }}></div>
                        <div className="skeleton" style={{ height: '50px', width: '100%' }}></div>
                        <div className="skeleton" style={{ height: '50px', width: '100%' }}></div>
                    </div>
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="table-card empty-state-box">
                    <div className="empty-icon-circle">
                        <UsersIcon size={36} />
                    </div>
                    <h3 className="empty-title">
                        {searchTerm ? 'No matching employees found' : 'No employees in directory yet'}
                    </h3>
                    <p className="empty-subtitle">
                        {searchTerm 
                            ? `We couldn't find any results matching "${searchTerm}". Try a different keyword.` 
                            : 'Get started by adding your first employee to the management system.'}
                    </p>
                    {searchTerm ? (
                        <button className="btn-modern-secondary" onClick={() => setSearchTerm('')}>
                            Clear Search
                        </button>
                    ) : (
                        <button className="btn-modern-primary" onClick={addNewEmployee}>
                            <UserPlusIcon size={18} />
                            <span>Add First Employee</span>
                        </button>
                    )}
                </div>
            ) : viewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="table-card table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th style={{ width: '90px' }}>ID</th>
                                <th>Employee</th>
                                <th>Email Address</th>
                                <th>Department</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td>
                                        <span className="id-pill">#{emp.id}</span>
                                    </td>
                                    <td>
                                        <div className="employee-cell">
                                            <div className="avatar-badge">
                                                {getInitials(emp.firstName, emp.lastName)}
                                            </div>
                                            <div>
                                                <p className="employee-name-text">
                                                    {emp.firstName} {emp.lastName}
                                                </p>
                                                <small className="text-muted">Staff Member</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="email-chip btn p-0 text-start" 
                                            onClick={() => handleCopyEmail(emp.email)}
                                            title="Click to copy email"
                                        >
                                            <MailIcon size={14} />
                                            <span>{emp.email}</span>
                                            <CopyIcon size={12} className="ms-1 opacity-50" />
                                        </button>
                                    </td>
                                    <td>
                                        <span className="card-role-badge">
                                            <BuildingIcon size={12} />
                                            Engineering & Ops
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions justify-content-end">
                                            <button 
                                                className="btn-icon-action btn-action-view"
                                                onClick={() => openPreviewModal(emp)}
                                                title="View Details"
                                            >
                                                <EyeIcon size={16} />
                                            </button>
                                            <button 
                                                className="btn-icon-action btn-action-edit"
                                                onClick={() => updateEmployee(emp.id)}
                                                title="Edit Employee"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button 
                                                className="btn-icon-action btn-action-delete"
                                                onClick={() => openDeleteModal(emp)}
                                                title="Delete Employee"
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* CARD GRID VIEW */
                <div className="employee-grid">
                    {filteredEmployees.map(emp => (
                        <div key={emp.id} className="employee-card">
                            <div className="card-header-flex">
                                <div className="card-avatar-large">
                                    {getInitials(emp.firstName, emp.lastName)}
                                </div>
                                <span className="id-pill">#{emp.id}</span>
                            </div>

                            <h3 className="card-name">{emp.firstName} {emp.lastName}</h3>
                            <div>
                                <span className="card-role-badge">
                                    <BuildingIcon size={12} />
                                    General Staff
                                </span>
                            </div>

                            <div className="card-email-box">
                                <MailIcon size={15} />
                                <span>{emp.email}</span>
                            </div>

                            <div className="card-footer-actions">
                                <button 
                                    className="btn-modern-secondary btn-sm"
                                    onClick={() => openPreviewModal(emp)}
                                >
                                    <EyeIcon size={15} />
                                    <span>Profile</span>
                                </button>
                                <div className="d-flex gap-2">
                                    <button 
                                        className="btn-icon-action btn-action-edit"
                                        onClick={() => updateEmployee(emp.id)}
                                        title="Edit"
                                    >
                                        <EditIcon size={16} />
                                    </button>
                                    <button 
                                        className="btn-icon-action btn-action-delete"
                                        onClick={() => openDeleteModal(emp)}
                                        title="Delete"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteModal.show && deleteModal.employee && (
                <div className="modal-backdrop-custom" onClick={closeDeleteModal}>
                    <div className="modal-card-custom" onClick={e => e.stopPropagation()}>
                        <div className="modal-icon-danger">
                            <TrashIcon size={26} />
                        </div>
                        <h3 className="modal-title-custom">Delete Employee</h3>
                        <p className="modal-desc-custom">
                            Are you sure you want to remove <strong>{deleteModal.employee.firstName} {deleteModal.employee.lastName}</strong> (ID #{deleteModal.employee.id})? This action cannot be undone.
                        </p>
                        <div className="modal-buttons-row">
                            <button 
                                className="btn-modern-secondary" 
                                onClick={closeDeleteModal}
                                disabled={deleteModal.isDeleting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-danger-solid" 
                                onClick={confirmDelete}
                                disabled={deleteModal.isDeleting}
                            >
                                {deleteModal.isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PREVIEW DETAILS MODAL */}
            {previewModal.show && previewModal.employee && (
                <div className="modal-backdrop-custom" onClick={closePreviewModal}>
                    <div className="modal-card-custom" onClick={e => e.stopPropagation()}>
                        <div className="live-id-badge-card">
                            <div className="live-badge-top">
                                <span className="live-badge-company">EMS PRO ID</span>
                                <span className="live-badge-tag">VERIFIED</span>
                            </div>
                            <div className="live-badge-body">
                                <div className="live-badge-avatar">
                                    {getInitials(previewModal.employee.firstName, previewModal.employee.lastName)}
                                </div>
                                <h2 className="live-badge-name">
                                    {previewModal.employee.firstName} {previewModal.employee.lastName}
                                </h2>
                                <p className="live-badge-email">{previewModal.employee.email}</p>
                                <div className="live-badge-chip">
                                    <span>EMP ID: #{previewModal.employee.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button className="btn-modern-secondary" onClick={closePreviewModal}>
                                Close
                            </button>
                            <button 
                                className="btn-modern-primary" 
                                onClick={() => {
                                    const id = previewModal.employee.id
                                    closePreviewModal()
                                    updateEmployee(id)
                                }}
                            >
                                <EditIcon size={16} />
                                <span>Edit Details</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListEmployeeComponent