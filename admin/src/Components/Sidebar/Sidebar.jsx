import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import add_product from '../../assets/list_alt_add_50dp.png'
import list_product from '../../assets/inventory_50dp.png'
import list_users from '../../assets/group_24dp.png'
import list_admin from '../../assets/alladmins_24dp.png'
import publications_icon from '../../assets/publications_icon_24dp.png'
import add_admin from '../../assets/add_admin_24dp.png'
import send_email from '../../assets/send_email.png'
import { useCtx_Ctrl_Panel } from '../../Context_CtrlPanel/Context_CtrlPanel'

const Sidebar = () => {

    const { userRole } = useCtx_Ctrl_Panel()
 
  return (
    <div className='sidebar-container'>
      <NavLink to="addproduct" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
            <img src={add_product} alt="add product icon" />
            <p>Add product</p>
          </div>
        )}
      </NavLink>
      <NavLink to="listproduct" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
            <img src={list_product} alt="add product icon" />
            <p>Products list</p>
          </div>
        )}
      </NavLink>
      <NavLink to="allusers" style={{ textDecoration: "none" }}>
        {({ isActive }) => (
          <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
            <img src={list_users} alt="add product icon" />
            <p>Users list</p>
          </div>
        )}
      </NavLink>

     {/* botones especiales dependiendo del userRole */}
      
      {(userRole === 'admin') && (
        <NavLink to="publications" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
              <img src={publications_icon} alt="publications icon" />
              <span><p>Publica&shy;tions</p></span>
            </div>
          )}
        </NavLink>
      )}
      {userRole === 'superuser' && (
        <NavLink to="alladmins" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
              <img src={list_admin} alt="all admin icon" />
              <p>Admin list</p>
            </div>
          )}
        </NavLink>
      )}
      {userRole === 'superuser' && (
        <NavLink to="addadmin" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
              <img src={add_admin} alt="add admin icon" />
              <p>Add Admin</p>
            </div>
          )}
        </NavLink>
      )}
      {userRole === 'superuser' && (
        <NavLink to="sendemail" style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <div className={`sidebar-item ${isActive ? 'selected' : ''}`}>
              <img src={send_email} alt="send promo icon" />
              <p>Send promo</p>
            </div>
          )}
        </NavLink>
      )}
    </div>
  )
}

export default Sidebar
