import ListEmployeeComponent from './components/ListEmployeeComponent'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import EmployeeComponent from './components/EmployeeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <HeaderComponent />
            <div className="container min-vh-100">
                <Routes>
                    <Route path='/' element={<ListEmployeeComponent />} />
                    <Route path='/employees' element={<ListEmployeeComponent />} />
                    <Route path='/add-employee' element={<EmployeeComponent />} />
                    <Route path='/edit-employee/:id' element={<EmployeeComponent />} />
                </Routes>
            </div>
            <FooterComponent />
        </BrowserRouter>
    )
}

export default App