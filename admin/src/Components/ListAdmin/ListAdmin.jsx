import React, { useEffect, useState } from 'react'
import './ListAdmin.css'
import edit_icon from '../../assets/edit_24dp.png'
import delete_icon from '../../assets/delete_24dp.png'

const ListAdmin = () => {

    const [allAdmins, setAllAdmins] = useState([
/* 
      //Data Dummie  
    {
        _id: '1',
        name:'Joaquin Soto',
        username: 'Admin1',
        email: 'admin1@testing.com',
        password: '7Jugh8NghtR4',
      },
    {
        _id: '2',
        name:'Lorena Ibarra',
        username: 'Admin2',
        email: 'admin2@testing.com',
        password: 'hJu76De3nM8o',
    }, */
    
  ])



  const fetchAdminInfo = async () => {
    try {
      const res = await fetch('http://localhost:4000/alladmins')
      const data = await res.json()
        /* console.log('data --->', data) */
      setAllAdmins(data)
    } catch (error) {
      console.error("Error fetching admins:", error)
    }
  }

  useEffect(() => {
    fetchAdminInfo()
  }, [])

  const editAdmin = (adminId) => {
    console.log(`Edit admin with ID: ${adminId}`)
    // Lógica para editar administrador
  }


  const removeAdmin = async (adminId) => {
    try {
      const res = await fetch(`http://localhost:4000/removeadmin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const data = await res.json()
      if (data.success) {
        await fetchAdminInfo()
      } else {
        console.error("Failed to remove admin:", data.message)
      }
    } catch (error) {
      console.error("Error removing admin:", error)
    }
  }

  return (
    <div className='adminlist'>
            <h2>Admin List</h2>
            <div className="adminlist-headers">
                <p>Name</p>
                <p>Username</p>
                <p>Email</p>
                <p>Password</p>
                <p>Edit</p>
                <p>Remove</p>
            </div>
            <div className="adminlist-data">
                <hr />
                {allAdmins.map((admin) => (
                    <div key={admin._id} className="adminlist-item">
                        <p className={admin.role === 'superuser' ? 'superuser' : ''}>
                            {admin.name}
                        </p>
                        <p>{admin.username}</p>
                        <p>{admin.email}</p>
                        <p className='password'>
                           {admin.password}
                        </p>
                        <img 
                            onClick={() => editAdmin(admin._id)}
                            className='icon'
                            src={edit_icon} 
                            alt="edit admin icon" 
                        />
                        <img
                            onClick={() => removeAdmin(admin._id)}
                            className='icon'
                            src={delete_icon}
                            alt="delete admin icon"
                        />
                    </div>
                ))}
            </div>
        </div>
  )
}

export default ListAdmin
