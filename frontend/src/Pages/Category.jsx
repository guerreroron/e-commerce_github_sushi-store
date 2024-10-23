import React, { useContext, useState } from 'react'
import './CSS/Category.css'
import { TiendaContext } from '../Context/TiendaContext'
import Item from '../Components/Item/Item'

const Category = (props) => {

    const {all_product} = useContext(TiendaContext)
    const [order, setOrder] = useState('')

    const handleOrderChange = (event) => {
      setOrder(event.target.value)
    }

    //Filtrar según categoría
    const filteredProducts = all_product.filter(item => item.category === props.category)

    //Ordenar los productos filtrados
    const sortedProducts = () => {
      if (order === 'asc') {
        return filteredProducts.sort((a,b) => a.new_price - b.new_price)
      } else if (order === 'desc') {
        return filteredProducts.sort((a,b) => b.new_price - a.new_price)
      }
      filteredProducts.sort((a, b) => new Date(b.Date) - new Date(a.Date))
      return filteredProducts.reverse()
    }

  return (
    <div className='category-container'>
      <img className='img-banner' src={props.banner} alt="Banner promocional" />
      <div className="category-sort">
        <select name="select-order" id="selectOrder" onChange={handleOrderChange} value={order}>
            <option value="">Ordenar por</option>
            <option value="asc">Precio 🔺</option>
            <option value="desc">Precio 🔻</option>
        </select>
      </div>
      <div className='container-products'>
        <div className="category-products">
          {
            sortedProducts().map(item => (
                <div key={item.id} className='item-container'>
                    <Item 
                        id = {item.id}
                        name = {item.name}
                        image = {item.image}
                        new_price = {item.new_price}
                        old_price = {item.old_price}
                    />
                </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Category