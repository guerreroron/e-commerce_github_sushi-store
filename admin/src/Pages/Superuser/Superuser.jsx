import React from 'react'
import './Superuser.css'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListUsers from '../../Components/ListUsers/ListUsers'
import ListAdmin from '../../Components/ListAdmin/ListAdmin'
import Navbar from '../../Components/Navbar/Navbar'
import AddAdmin from '../../Components/AddAdmin/AddAdmin'
import SendEmail from '../../Components/SendEmail/SendEmail'
import Dashboard from '../../Components/Dashboard/Dashboard'

const Superuser = () => {
  return (
    <div>
      <Navbar />
      <div className='superuser-container'>
        <Sidebar />
          <Routes>
              <Route path='addproduct' element={<AddProduct />} />
              <Route path='listproduct' element={<ListProduct />} />
              <Route path='allusers' element={<ListUsers />} />
              <Route path='alladmins' element={<ListAdmin />} />
              <Route path='addadmin' element={<AddAdmin />} />
              <Route path='sendemail' element={<SendEmail />} />
              <Route path='/' element={<Dashboard />} />
          </Routes>
      </div>
    </div>
  )
}

export default Superuser