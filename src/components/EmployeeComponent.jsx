import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const EmployeeComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const { id } = useParams()
    const navigator = useNavigate()

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/api/employees/${id}`)
                .then(response => {
                    setFirstName(response.data.firstName)
                    setLastName(response.data.lastName)
                    setEmail(response.data.email)
                })
                .catch(error => console.error(error))
        }
    }, [id])

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault()
        const employee = { firstName, lastName, email }

        if (id) {
            axios.put(`http://localhost:8080/api/employees/${id}`, employee)
                .then(response => {
                    console.log('Updated:', response.data)
                    navigator('/employees')
                })
                .catch(error => console.error(error))
        } else {
            axios.post('http://localhost:8080/api/employees', employee)
                .then(response => {
                    console.log('Saved:', response.data)
                    navigator('/employees')
                })
                .catch(error => console.error(error))
        }
    }

    const pageTitle = () => {
        if (id) {
            return <h2 className='text-center mt-3'>Update Employee</h2>
        } else {
            return <h2 className='text-center mt-3'>Add Employee</h2>
        }
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    {pageTitle()}
                    <div className='card-body'>
                        <form onSubmit={saveOrUpdateEmployee}>
                            <div className='form-group mb-3'>
                                <label className='form-label'>First Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter First Name'
                                    value={firstName}
                                    className='form-control'
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Last Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Last Name'
                                    value={lastName}
                                    className='form-control'
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'>Email:</label>
                                <input
                                    type='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    className='form-control'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button type='submit' className='btn btn-success'>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeComponent