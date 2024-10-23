import React from 'react'
import './Bradcrum.css'
import bread_arrow from '../../assets/chevron_right_white_24dp.png'
import { NavLink } from 'react-router-dom'

const Breadcrum = (props) => {
    const {product} = props

    const routes = {
        categories: {
            roll:'rolls',
            handroll:'handrolls',
            sashimi:'sashimi',
            table:'tablas'
        }
    }

  return (
    <div className='breadcrum'>
        <NavLink className="enlace" to="/">Tienda</NavLink>
        <img src={bread_arrow} alt="arrow_icon" />
        <NavLink className="enlace" to={`/${routes.categories[product.category]}`}>
            {product.category}
        </NavLink>
         <img src={bread_arrow} alt="arrow_icon" />
        {product.name}
    </div>
  )
}

export default Breadcrum
