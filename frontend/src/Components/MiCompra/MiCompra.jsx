import React, { useEffect, useState, useContext } from 'react'
import { TiendaContext } from '../../Context/TiendaContext'
import './MiCompra.css'

const MiCompra = () => {
    const { user, authToken, clearCart  } = useContext(TiendaContext)
    const [ lastPurchase, setLastPurchase ] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (user && authToken) {  
            setIsLoading(true)
            fetch('http://localhost:4000/micompra', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
            .then((response) => response.json())
            .then((data) => {
//                console.log('Compra recibida:', data)
                setLastPurchase(data)
                setIsLoading(false)
                clearCart()
            })
            .catch((error) => {
                setError(error)
                setIsLoading(false)
            })
        }
    }, [user, authToken])

    if (isLoading) {
        return <div className='micompra'>Loading...</div>;
    }

    if (error) {
        return <div className='micompra'>Error: {error.message}</div>;
    }

    if (!lastPurchase) {
        return <div className='micompra'>No purchases found.</div>;
    }
 
    return (
        <div className='micompra'>
                <h2>Última Compra</h2>
            <div>
                <p className='dateCompra'>Fecha: {new Date(lastPurchase.date).toLocaleString()}</p>
                <p className='dateCompra'> Id de compra: {lastPurchase._id}</p>
            </div>
            <p className='special-left-align'><strong>{user.email}</strong></p>
            <p className='special-left-align'>Detalle</p>
            <div className='micompra-items'>
                <div className="items-title">
                    <p>Producto</p>
                    <p>Cantidad</p>
                    <p>$ Unit.</p>
                    <p>Subtotal</p>
                </div>
                <ul>
                    {lastPurchase.products.map((p) => (
                        <li key={p.id} className="item-row">
                            <div>{p.name}</div>
                            <div className='cantidad'>{p.quantity}</div>
                            <div>${p.price}</div>
                            <div>${p.quantity * p.price}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='micompra-total'>
                <p>Total compra: ${lastPurchase.totalAmount}</p>
            </div>
        </div>
        )
    }

export default MiCompra
