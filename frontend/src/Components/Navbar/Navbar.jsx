import React, { useContext, useRef, useState, useEffect } from 'react'
import './Navbar.css'
import logo from '../../assets/sushi_logo_gris.png'
import cart_icon from '../../assets/shopping_cart_24dp.png'
import dropdown_icon from '../../assets/menu_24dp.png'
import person_icon from '../../assets/person_blue_24dp.png'
import admin_icon from '../../assets/key_24dp.png'
import { Link, useNavigate } from 'react-router-dom'
import { TiendaContext } from '../../Context/TiendaContext'
 
const Navbar = () => {
  const navigate = useNavigate()
  const [menu, setMenu] = useState('tienda')
  const { getTotalCartItems, user, handleLogout } = useContext(TiendaContext)
  const menuRef = useRef()
  const dropdownRef = useRef()
 
  const dropdown_toggle = () => {
    const menuVisible = menuRef.current.classList.toggle('nav-menu-visible')
    dropdownRef.current.classList.toggle('open', menuVisible)
  }

  const handleMenuClick = (selectedMenu) => {
    setMenu(selectedMenu)
    menuRef.current.classList.remove('nav-menu-visible')
    dropdownRef.current.classList.remove('open')
  }

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        handleLogout()
        navigate('/')
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  useEffect(() => {
    if (user) {
//      console.log('User has changed:', user)
    }
  }, [user])

  return (
    <div className='navbar'>
        <div className="nav-logo">
            <img src={logo} alt="Sushi Store" />
        </div>
            <Link to="http://localhost:5173" target='_blank' className='enlace-worker'>
                <div className="worker">
                    <p>Admin</p>
                    <img src={admin_icon} alt="admin icon" />
                </div>
            </Link>
        <div className='navbar-links'>
            <img 
                ref={dropdownRef}
                className='nav-dropdown' 
                onClick={dropdown_toggle} 
                src={dropdown_icon} 
                alt="dropdown icon" 
            />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => handleMenuClick('tienda')}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/'>Tienda</Link>
                    {menu === 'tienda' && <hr />}
                </li>
                <li onClick={() => handleMenuClick('rolls')}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/rolls'>Rolls</Link>
                    {menu === 'rolls' && <hr />}
                </li>
                <li onClick={() => handleMenuClick('handrolls')}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/handrolls'>Handrolls</Link>
                    {menu === 'handrolls' && <hr />}
                </li>
                <li onClick={() => handleMenuClick('sashimi')}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/sashimi'>Sashimi</Link>
                    {menu === 'sashimi' && <hr />}
                </li>
                <li onClick={() => handleMenuClick('tablas')}>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/tablas'>Tablas</Link>
                    {menu === 'tablas' && <hr />}
                </li>
            </ul>
        </div>
            <div className="nav-login-cart">
                {user ? (
                    <div className="perfil">
                        <img src={person_icon} alt="person icon" />
                        <p>{user.email}</p>
                    </div>
                ) : null}

                {user ? (
                    <button onClick={handleLogoutClick}>Logout</button>
                    ) : (
                    <Link to='/login'><button>Login</button></Link>
                )}

                <Link to='/cart'>
                    <img src={cart_icon} alt="cart icon" />
                </Link>
                <div onClick={() => navigate('/cart')}
                    className='nav-cart-count'>{getTotalCartItems()}
                </div>
            </div>
    </div>
  )
}

export default Navbar

