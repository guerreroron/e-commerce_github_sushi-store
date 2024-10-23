import React, { useContext } from 'react'
import './DescriptionBox.css'
import PublicationList from '../PublicationList/PublicationList'

const DescriptionBox = (props) => {

    const {product} = props

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-nav">
        <div className="descriptionbox-nav-box">Publicaciones</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        <div className="descriptionbox-nav-spacer"></div>
      </div>
      <div className="descriptionbox-desc">
        <PublicationList product={product} />
      </div>
    </div>
  ) 
}

export default DescriptionBox
