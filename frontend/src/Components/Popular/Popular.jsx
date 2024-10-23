import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

// import data_product from '../Assets/data'

const Popular = () => {

    const [newArrivals, setNewArrivals] = useState([])
   
      // Efecto para productos nuevos
      useEffect(() => {
        fetch('http://localhost:4000/newarrivals')
        .then((response) => response.json())
        .then((data) => {
          // Establecer los productos más recientes
          setNewArrivals(data)
        })
        .catch((error) => console.error('Error fetching new arrivals:', error))
      }, [])

  return (
    <div className='container-popular'>
        <h2>Agregados recientemente</h2>
        <div className="popular">
          { newArrivals.map((item, i)=> {
            return (
                    <div key={item.id} className='item-container'>
                        <Item id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                    </div>
                )
          }) }
        </div>
    </div>   
  )
}
 
export default Popular
 