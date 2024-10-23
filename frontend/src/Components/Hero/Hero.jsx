import { useNavigate } from 'react-router-dom'
import './Hero.css'
import hero_right from '../../assets/hero.jpg'
import Carrusel from '../Carrusel/Carrusel'

const Hero = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/tablas')
  }

  return (
    <div className='hero'>
        <div className="hero-carrusel">
            <Carrusel />
        </div>
        <h2>Nuestras tablas</h2>
        <div className='pather-hero'>
            <div className='pather'>
                <div className="child-left">
                    <span>Ingredientes de primera calidad</span>
                    <p>Sólo utilizamos materias primas seleccionadas frescas y de mercados locales.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate blanditiis deserunt vitae hic.</p>
                    <div className='hero-btn'>
                    <button onClick={handleClick}>Ver tablas</button>
                    </div>
                </div>
                <div className="child-right">
                    <img src={hero_right} alt="Imagen de tabla" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
