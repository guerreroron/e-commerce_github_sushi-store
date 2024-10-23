import React, { useState } from 'react'
import './AddAdmin.css'

const AddAdmin = () => {
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role:"admin",
    securityQuestions:[]
  })
  const [alertMessage, setAlertMessage] = useState(null)

  const handleChange = (e) => {
    setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value })
  }

  const addAdmin = async () => {
    if (!adminDetails.name || !adminDetails.username || !adminDetails.email || !adminDetails.password) {
      setAlertMessage('All fields are required')
      setTimeout(() => setAlertMessage(null), 3000)
      return
    }

    try {
            
        const response = await fetch('http://localhost:4000/addadmin', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminDetails),
        })
    
      const data = await response.json()

      if (data.success) {
        setAlertMessage('Admin added successfully')
        setAdminDetails({
          name: "",
          username: "",
          email: "",
          password: "",
          role: "admin", 
          securityQuestions: []
        })
      } else {
        setAlertMessage(data.message || 'Failed to add admin')
      }
    } catch (error) {
      setAlertMessage('Error uploading admin', error)
    } finally {
      setTimeout(() => {
        setAlertMessage(null)
      }, 3000)
    }
  }

  return (
    <div className='addadmin'>
      <h2>Add Admin</h2>
      <div className="addadmin-item-field">
        <p>Nombre</p>
        <input
          value={adminDetails.name}
          onChange={handleChange}
          type="text"
          name='name'
          placeholder='Type here' />
      </div>
      <div className="addadmin-item-field">
        <p>Username</p>
        <input
          value={adminDetails.username}
          onChange={handleChange}
          type="text"
          name='username'
          placeholder='Type here' />
      </div>
      <div className="addadmin-item-field">
        <p>Email</p>
        <input
          value={adminDetails.email}
          onChange={handleChange}
          type="email"
          name='email'
          placeholder='Type here' />
      </div>
      <div className="addadmin-item-field">
        <p>Password</p>
        <input
          value={adminDetails.password}
          onChange={handleChange}
          type="text"
          name='password'
          placeholder='Type here' />
      </div>
      <div className='addadmin-btn-container'>
        <button
          onClick={addAdmin}
          className='addadmin-btn'
          >
          ADD ADMIN
        </button>
      </div>
      <div className={`alertmessage ${alertMessage ? 'active' : ''}`}>
        {alertMessage && <div className="alert">{alertMessage}</div>}
      </div>
    </div>
  )
}

export default AddAdmin
