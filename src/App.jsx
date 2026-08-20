import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import ListEmployeeComponent from './components/ListEmployeeComponent'
import EmployeeComponent from './components/EmployeeComponent'

function App() {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <HeaderComponent />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<ListEmployeeComponent />} />
                        <Route path="/employees" element={<ListEmployeeComponent />} />
                        <Route path="/add-employee" element={<EmployeeComponent />} />
                        <Route path="/edit-employee/:id" element={<EmployeeComponent />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <FooterComponent />
            </div>
        </BrowserRouter>
    )
}

export default App