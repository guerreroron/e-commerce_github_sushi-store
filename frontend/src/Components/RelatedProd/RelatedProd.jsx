import React, { useContext, useEffect, useState } from 'react';
import './RelatedProd.css'
import Item from '../Item/Item'
import { TiendaContext } from '../../Context/TiendaContext'

// import data_product from '../Assets/data'

const RelatedProd = ({ product }) => {
    const { fetchRelatedProducts } = useContext(TiendaContext)
    const [relatedProducts, setRelatedProducts] = useState([])
    
    useEffect(() => {
        if (product.category) {
//          console.log("Fetching related products for category:", product.category)
          fetchRelatedProducts(product.category)
            .then((data) => {
//              console.log("Related products fetched:", data)
              setRelatedProducts(data)
            })
            .catch((error) => console.error("Error fetching related products:", error))
        }
      }, [product.category, fetchRelatedProducts])
    
  return (
    <div className='container-related'>
        <h2>Productos relacionados</h2>
        <div className="related">
          { relatedProducts.map((item, i)=> {
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
 
export default RelatedProd
