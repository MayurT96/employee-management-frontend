import React from 'react'
import { BuildingIcon } from './Icons'

const FooterComponent = () => {
    return (
        <footer className="app-footer">
            <div className="footer-container">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} <strong>EMS Pro</strong> — Employee Management System. Crafted by Mayur.
                </p>
                <div className="footer-badge">
                    <BuildingIcon size={16} />
                    <span>Enterprise Ready Edition</span>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent