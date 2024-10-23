import React from 'react'
import './Navbar.css'
import nav_logo from '../../assets/nav_logo_admin.png'
import { useCtx_Ctrl_Panel } from '../../Context_CtrlPanel/Context_CtrlPanel'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

    const { userRole, username } = useCtx_Ctrl_Panel()

  return (
    <div className='navbar-container'>
      <div className='navImg'>
        <img src={nav_logo} alt="navbar logo" className="nav-logo" />
      </div>
      <div className='navHead'>
        <div className="navTitle">
        <NavLink className='enlaceNav' to={userRole === 'superuser' ? '/superuser' : '/admin'}>
            <p><span>{userRole === 'superuser' ? 'SUPERUSER' : 'ADMIN'}</span></p>
        </NavLink>
        </div>
      </div>
      {(userRole === 'admin' || userRole === 'superuser') && (
        <div className="navUser">
            <NavLink className="enlace" to='/login'>Logout</NavLink>
            <p>{username || 'User'}</p>
        </div>
      )}
    </div>
  )
}
   
export default Navbar
