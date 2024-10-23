import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Noticias.css'


const Noticias = () => {

    const navigate = useNavigate()

    const handleClick = () => {
      alert('Debes ser cliente para recibir promociones y descuentos por correo.')
      navigate('/login')
    }

  return (
    <div className='fondo-noticias'>
        <div className='container-noticias'>
          <h2>Recibe cupones de descuento<br/>por correo</h2>
          <div className="noticias">
            <p>Suscribete con tu email para estar actualizado con nuestras promociones</p>
            <div className='email-btn'>
                <input type='email' placeholder='tu email aquí'/>
                <button onClick={handleClick}>Suscribirse</button>
            </div>
          </div>
    </div>
    </div>
  )
}

export default Noticias
