import React from 'react'
import './Footer.css'
import footer_logo from '../../assets/sushi_logo_footer.png'
import instagram_icon from '../../assets/instagram-50.png'
import facebook_icon from '../../assets/facebook-50.png'
import twitter_icon from '../../assets/twitter-50.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img src={footer_logo} alt="" />
        </div>
        <div className="footer-direction">
            <p>Casa Matriz. Campana Real 435. Solares. Chile</p>
            <p>+569 3389 0088</p>
            <p>pedidos@sushistore.com</p>
        </div>
        <div className='footer-social'>
            <div className='instagram-logo'>
                <img src={instagram_icon} alt="instagram" />
            </div>
            <div className='facebook-logo'>
                <img src={facebook_icon} alt="facebook" />
            </div>
            <div className='x-logo'>
                <img src={twitter_icon} alt="x" />
            </div>
        </div>
        <div className='footer-copyright'>
            <p>LLC Copyright ©. Chile</p>
            <p>Ronald Guerrero ADL FSJS-G64</p>
        </div>
    </div>
  )
}

export default Footer
