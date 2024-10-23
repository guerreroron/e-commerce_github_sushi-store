import React, { useContext } from 'react'
import { TiendaContext } from '../Context/TiendaContext'
import { useParams } from 'react-router-dom'
import '../Pages/CSS/Product.css'
import Breadcrum from '../Components/Breadcrums/Breadcrum'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox'
import RelatedProd from '../Components/RelatedProd/RelatedProd'

const Product = () => {
    const {all_product} = useContext(TiendaContext)
    
    const {productId} = useParams()
    const product = all_product.find((e) => e.id === Number(productId))
  return (
    <div className='product'>
      <Breadcrum product = {product} />
      <ProductDisplay product = {product} />
      <DescriptionBox product = {product} />
      <RelatedProd product={product} />
    </div>
  )
}

export default Product
