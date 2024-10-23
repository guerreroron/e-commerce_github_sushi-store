import React, { useState } from 'react';
import './AdminLogin.css';
import { useCtx_Ctrl_Panel } from '../../Context_CtrlPanel/Context_CtrlPanel';
import { useNavigate } from 'react-router-dom';
import head_image from '../../assets/nav_logo_admin.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { loginadm } = useCtx_Ctrl_Panel()
    const navigate = useNavigate()

    const resetForm = () => {
        setEmail('')
        setPassword('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:4000/adminlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!data.success) {
                alert('Credenciales incorrectas')
                resetForm()
                return
            }

            loginadm(data.token, data.role, data.username, data.adminId)

            // Redirigir al usuario según su rol
            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'superuser') {
                navigate('/superuser') 
            } else {
                alert('Rol no reconocido')
            }
        } catch (error) {
            console.error('Error al hacer login:', error)
        }
    }

    return (
        <div className='adminlogin-container'>
            <div className="headImg">
                <img src={head_image} alt="logo empresa" />
            </div>
            <div className="admin-login">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
