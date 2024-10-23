import React, { useContext, useState } from 'react'
import './ProductDisplay.css'
import star_icon from '../../assets/star_filled_24dp.png'
import star_empty from '../../assets/star_empty_24dp.png'
import { TiendaContext } from '../../Context/TiendaContext'
import { NavLink } from 'react-router-dom'

const ProductDisplay = (props) => {
    const { product } = props

    const { addToCart, addSauceToCart, getTotalCartAmount } = useContext(TiendaContext)

    const [selectedSauce, setSelectedSauce] = useState(null)
    const sauces = ['Soya', 'Teriyaki', 'Mayo picante', 'Cilantro']
    const [hoverThumb, setHoverThumb] = useState(null)
 
    const handleSauceSelection = (sauce) => {
        setSelectedSauce(sauce)
    }

    const clearSauceSelection = () => {
        setSelectedSauce(null)
    }

    const defaultDescription = (
        <>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni natus corrupti dolorem odit. Debitis, repellat fugit. Ab nesciunt, ipsa asperiores voluptatem recusandae ullam.</p>
        </>
    )
 
    return (
        <div className='productdisplay'>
            <div className="prod-display-left">
            	<div className="prod-display-img-list">
                    {product.thumbnails && product.thumbnails.length > 0 ? (
                        product.thumbnails.map((thumb, index) => (
                            <img 
                                key={index} 
                                src={thumb} 
                                alt={`thumbnail-${index}`} className="thumbnail-image" 
                                onMouseEnter={() => setHoverThumb(thumb)}
                                onMouseLeave={() => setHoverThumb(null)} 
                            />
                        ))
                    ) : (
                        <p>No thumbnails available</p>
                    )}
                </div>
                <div className="prod-display-image">
                    <img 
                        className='prod-display-main-img' 
                        src={hoverThumb || product.image}
                        alt="imagen principal del producto" 
                    />
                </div>
            </div>
            <div className="prod-display-right">
                <h2>{product.name}</h2>
                <div className="prod-display-right-stars">
                    <img src={star_icon} alt="star image" />
                    <img src={star_icon} alt="star image" />
                    <img src={star_icon} alt="star image" />
                    <img src={star_icon} alt="star image" />
                    <img src={star_empty} alt="star half-image" />
                    <p>(122)</p>
                </div>
                <div className="prod-display-right-prices">
                    <div className="prod-disp-right-old">
                        ${product.old_price}
                    </div>
                    <div className="prod-disp-right-new">
                        ${product.new_price}
                    </div>
                </div>
                <div className="prod-disp-right-descrip">
                    {product.description ? (
                        <p>{product.description}</p>
                    ) : (
                        defaultDescription
                    )} 
                </div>
                <div className="prod-disp-right-size">
                    <h3>Seleccione la salsa deseada:<span onClick={clearSauceSelection}>(o ninguna)👈</span></h3>
                    <div className="prod-disp-right-sauces">
                        {sauces.map((sauce) => (
                            <div
                                key={sauce}
                                className={`sauce-option ${selectedSauce === sauce ? 'selected' : ''}`}
                                onClick={() => handleSauceSelection(sauce)}
                            >
                                {sauce}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='boton-agregar-carrito'>
                    <button 
                        onClick={(event) => {
                            event.preventDefault()
                            addToCart(product.id)
                            addSauceToCart(product.id, selectedSauce)
                        }}
                    >
                    Agregar al carro
                    </button>
                    <div className='total'>
                        <NavLink to="/cart" className="enlace-total">
                        <p>Total carro: {getTotalCartAmount().toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 })}</p>
                        </NavLink>
                    </div>
                </div>
                <div className='prod-disp-right-category'>
                    <div className='categorias'>
                        <u><em>Ver otras categorias:</em></u>
                        <ul>
                            <NavLink to="/rolls" className="enlaces"><li>Rolls</li></NavLink> 
                            <NavLink to="/handrolls" className="enlaces"><li>Handrolls</li></NavLink>
                            <NavLink to="/sashimi" className="enlaces"><li>Sashimi</li></NavLink>
                            <NavLink to="/tablas" className="enlaces"><li>Tablas</li></NavLink>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDisplay
 