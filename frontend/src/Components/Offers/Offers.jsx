import React, { useEffect, useState } from 'react'
import './Offers.css'
import Item from '../Item/Item'

// import data_tables from '../Assets/tables'

const Offers = () => {

    const [tables, setTables] = useState([])

    useEffect(() => {
      fetch('http://localhost:4000/tablas-promo')
      .then((response) => response.json())
      .then((data) => {
        // Orden de menor a mayor
        const sortedData = data.sort((a, b) => a.new_price - b.new_price)
        setTables(sortedData)
      })
    }, [])
    

  return (
    <div className='container-offers'>
        <h2>Tablas en promoción</h2>
        <div className="offers">
          { tables.map((item, i)=> {
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

export default Offers
