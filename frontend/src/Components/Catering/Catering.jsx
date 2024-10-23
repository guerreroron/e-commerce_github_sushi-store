import React, { useEffect, useState } from 'react'
import './Catering.css'
import Item from '../Item/Item'

// import data_product from '../Assets/data'

const Catering = () => {

    const [catering, setCatering] = useState([])
    
    useEffect(() => {
        fetch('http://localhost:4000/catering')
        .then((response) => response.json())
        .then((data) => {
            //Orden de mayor a menor
            const sortedData = data.sort((b, a) => a.new_price - b.new_price)
            setCatering(sortedData)
        })
    }, [])

  return (
    <div className='container-catering'>
        <h2>Servicio de catering y alimentación para eventos</h2>
        <div className='catering'>
        { catering.map((item, i)=> {
            return (
                    <div key={item.id} className='item-container'>
                        <Item id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                    </div>
                )
          })}
        </div>
    </div>
  )
}

export default Catering
