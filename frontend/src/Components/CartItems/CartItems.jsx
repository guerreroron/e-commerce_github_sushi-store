import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './CartItems.css'
import { TiendaContext } from '../../Context/TiendaContext'
import remove_icon from '../../assets/close_24dp.png'
import add_icon from '../../assets/add_shopping_cart_24dp.png'

const CartItems = () => {
    const { 
        all_product, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        getTotalCartAmount,
        user,
        getSauceForItem,
        authToken,
    } = useContext(TiendaContext)

    const navigate = useNavigate()

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    const handlePayment = async () => {
        if (!user) {
            alert('Para hacer una compra debes ingresar con tu cuenta')
            navigate('/login')
            return
        }
        try {
            const response = await fetch('http://localhost:4000/purchased', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                },
                body: JSON.stringify({
                    products: all_product.filter(product => cartItems[product.id] > 0).map(product => ({
                        id: product.id,
                        name: product.name,
                        quantity: cartItems[product.id],
                        price: product.new_price,
                    })),
                    totalAmount: getTotalCartAmount(),
                }),
            })
            const data = await response.json()
            if (data.success) {
                alert('Compra exitosa!')
                navigate('/micompra')
            } else {
                alert('Hubo un error procesando tu compra.')
            }
        } catch (error) {
            console.error('Error during purchase:', error)
            alert('Hubo un error procesando tu compra.')
        }
    }

    return (
        <>
            <div className='cartitems-container'>
                <div className="cartitems-format-main">
                    <p>Products</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Add</p>
                    <p>Remove</p>
                </div>
                {all_product.map((e) => {
                    if (cartItems[e.id] > 0) {
                      return (
                            <div key={e.id}>
                                <div className="cartitems-format">
                                    <img
                                        src={e.image}
                                        alt={`Product ${e.name}`}
                                        className='cart-item-product-icon'
                                        onClick={() => handleProductClick(e.id)}
                                    />
                                    <div className='cartitems-format-title'>
                                        <p>{e.name}</p>
                                        {getSauceForItem(e.id) !== 'Ninguna salsa' && (
                                            <span>[{getSauceForItem(e.id)}]</span>
                                        )}
                                    </div>
                                    <p>${e.new_price}</p>
                                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                    <p>${(e.new_price * cartItems[e.id]).toFixed(0)}</p>
                                    <img 
                                        src={add_icon} 
                                        onClick={() => addToCart(e.id)} 
                                        alt="add-icon" 
                                    />
                                    <img 
                                        src={remove_icon} 
                                        onClick={() => removeFromCart(e.id)} 
                                        alt="remove-icon" 
                                    />
                                </div>
                                <div className='hr-top'></div>
                            </div>
                        )
                    }
                    return null
                })}
                <div className="cartitems-down">
                    <div className="cartitems-total">
                        <h3>Total</h3>
                        <div className="cartitems-total-item">
                            <div>
                                <p>Subtotal</p>
                                <p>${getTotalCartAmount().toFixed(0)}</p>
                            </div>
                            <hr />
                            <div> 
                                <p>Retiro en tienda</p>
                                <p>Gratis</p>
                            </div>
                            <hr />
                            <div>
                                <h4>Total</h4>
                                <h4>${getTotalCartAmount().toFixed(0)}</h4>
                            </div>
                            <button onClick={handlePayment}>PAGAR</button>
                        </div>
                    </div>
                    <div className="cartitems-promocode">
                        <p>Si tienes algún código de descuento, ingrésalo y envíalo antes de pagar</p>
                        <div className="cartitem-promobox">
                            <input type="text" placeholder='promo code' />
                            <button>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartItems
