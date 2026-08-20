import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UsersIcon, UserPlusIcon, SparklesIcon } from './Icons'

const HeaderComponent = () => {
    const location = useLocation()

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="brand-logo">
                    <div className="brand-icon-wrapper">
                        <UsersIcon size={22} />
                    </div>
                    <div>
                        <h1 className="brand-title">EMS Pro</h1>
                        <p className="brand-subtitle">Employee Hub</p>
                    </div>
                </Link>

                <nav className="header-nav">
                    <div className="nav-status-badge d-none d-sm-inline-flex">
                        <span className="status-dot"></span>
                        <span>API Connected</span>
                    </div>

                    <Link to="/employees" className={`btn-modern-secondary ${location.pathname === '/' || location.pathname === '/employees' ? 'active' : ''}`}>
                        <UsersIcon size={16} />
                        <span className="d-none d-sm-inline">Directory</span>
                    </Link>

                    <Link to="/add-employee" className="btn-modern-primary">
                        <UserPlusIcon size={18} />
                        <span>Add Employee</span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default HeaderComponent