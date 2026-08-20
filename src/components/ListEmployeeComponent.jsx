import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ListEmployeeComponent = () => {
    const [employees, setEmployees] = useState([])
    const navigator = useNavigate()

    useEffect(() => {
        getAllEmployees()
    }, [])

    function getAllEmployees() {
        axios.get('http://localhost:8080/api/employees')
            .then(response => {
                setEmployees(response.data)
            })
            .catch(error => console.error(error))
    }

    function addNewEmployee() {
        navigator('/add-employee')
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`)
    }

    function removeEmployee(id) {
        axios.delete(`http://localhost:8080/api/employees/${id}`)
            .then(response => {
                console.log(response.data)
                getAllEmployees()
            })
            .catch(error => console.error(error))
    }

    return (
        <div className='container mt-5'>
            <h2 className='text-center mb-4'>List of Employees</h2>
            <button className='btn btn-primary mb-3' onClick={addNewEmployee}>
                Add Employee
            </button>
            <table className='table table-striped table-bordered'>
                <thead className='table-dark'>
                <tr>
                    <th>Employee ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    employees.map(employee =>
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.email}</td>
                            <td>
                                <button className='btn btn-info' onClick={() => updateEmployee(employee.id)}>Update</button>
                                <button className='btn btn-danger' onClick={() => removeEmployee(employee.id)} style={{marginLeft: '10px'}}>Delete</button>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}

export default ListEmployeeComponent