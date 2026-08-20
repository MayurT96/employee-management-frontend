import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EmployeeComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')

    const { id } = useParams()
    const navigator = useNavigate()

    const BASE_URL = 'https://ems-backend-1-9k1k.onrender.com/api/employees'

    useEffect(() => {
        if (id) {
            axios.get(`${BASE_URL}/${id}`)
                .then((response) => {
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
            axios.put(`${BASE_URL}/${id}`, employee)
                .then((response) => {
                    console.log(response.data)
                    navigator('/employees')
                })
                .catch(error => console.error(error))
        } else {
            axios.post(BASE_URL, employee)
                .then((response) => {
                    console.log(response.data)
                    navigator('/employees')
                })
                .catch(error => console.error(error))
        }
    }

    function pageTitle() {
        if (id) {
            return <h2 className='text-center'>Update Employee</h2>
        } else {
            return <h2 className='text-center'>Add Employee</h2>
        }
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    {pageTitle()}
                    <div className='card-body'>
                        <form onSubmit={saveOrUpdateEmployee}>
                            <div className='form-group mb-2'>
                                <label className='form-label'>First Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter First Name'
                                    name='firstName'
                                    value={firstName}
                                    className='form-control'
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Last Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Last Name'
                                    name='lastName'
                                    value={lastName}
                                    className='form-control'
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Email:</label>
                                <input
                                    type='email'
                                    placeholder='Enter Email'
                                    name='email'
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