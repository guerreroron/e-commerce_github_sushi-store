import React from 'react'
import './Admin.css'
import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import ListUsers from '../../Components/ListUsers/ListUsers'
import Navbar from '../../Components/Navbar/Navbar'
import Publications from '../../Components/Publications/Publications'

const Admin = () => {
  return (
    <div>
      <Navbar />
        <div className='admin-container'>
        <Sidebar />
            <Routes>
                <Route path='addproduct' element={<AddProduct />} />
                <Route path='listproduct' element={<ListProduct />} />
                <Route path='allusers' element={<ListUsers />} />
                <Route path='publications' element={<Publications />} />
            </Routes>
        </div>
    </div>
  )
}

export default Admin
