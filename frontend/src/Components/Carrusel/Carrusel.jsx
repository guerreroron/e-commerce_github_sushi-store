import React, { useEffect, useState } from 'react'
import './Carrusel.css'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import img1_carrusel from '../../assets/sashimi_5.png'
import img2_carrusel from '../../assets/sushi-boat.jpg'
import img3_carrusel from '../../assets/vegan_sushi.png'
import img4_carrusel from '../../assets/promo_code_banner.png'
import { useNavigate } from 'react-router-dom'

const Carrusel = () => {

    const navigate = useNavigate()

    const totalSlides = 4

    const changeSlide = (currentSlide, totalSlides) => {
      return (currentSlide + 1) % totalSlides
    }
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => changeSlide(prevSlide, totalSlides))
      }, 12000)
  
      return () => clearInterval(interval)
    }, [totalSlides])
  
    const [currentSlide, setCurrentSlide] = useState(0)
    

    const handleClick1 = () => {
        navigate('/sashimi')
    }
    
    const handleClick2 = () => {
        navigate('/tablas')
    }

    const handleClick3 = () => {
        navigate('/rolls')
    }

    const handleClick4 = () => {
        navigate('/login')
    }

  return (
    <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={30}
        totalSlides={totalSlides}
        currentSlide={currentSlide}
        >
        <Slider className="carousel-slider">
            <Slide index={0}>
                <div className='slide'>
                    <div className="slide-left">
                        <img src={img1_carrusel} alt='image1'/>
                    </div>
                    <div className="slide-right">
                        <p>Nuestros cortes de pescado son siempre frescos y de productos locales. Lo que asegura la calidad y su exquisito sabor. Ideal para gustos saludables y exigentes.</p>
                        <button onClick={handleClick1}>Ver más</button>
                    </div>
                </div>
            </Slide>
            <Slide index={1}>
                <div className='slide'>
                    <div className="slide-left">
                        <img src={img2_carrusel} alt='image2'/>
                    </div>
                    <div className="slide-right">
                        <p>Exquisitas tablas preparadas con los ingredientes más frescos. Sabores diversos que se combinan con diferentes salsas para una experiencia sublime.</p>
                        <button onClick={handleClick2}>Ver más</button>
                    </div>
                </div>
            </Slide>
            <Slide index={2}>
                <div className='slide'>
                    <div className="slide-left">
                        <img src={img3_carrusel} alt='image3'/>
                    </div>
                    <div className="slide-right">
                        <p>Sushi delicadamente preparado. Equilibrados en sabor y textura que aseguran una experiencia culinaria moderna y sana.</p>
                        <button onClick={handleClick3}>Ver más</button>
                    </div>
                </div>
            </Slide>
            <Slide index={3}>
                <div className='slide'>
                    <div className="slide-left">
                        <img src={img4_carrusel} alt='image4'/>
                    </div>
                    <div className="slide-right">
                        <p><span>¿Aún no eres cliente?</span>  <br/>Hazte cliente de nuestra tienda con tu primera compra online y recibe descuentos exclusivos directamente en tu correo electrónico.</p>
                        <button onClick={handleClick4}>Ver más</button>
                    </div>
                </div>
            </Slide>
        </Slider>
        <ButtonBack>‹</ButtonBack>
        <ButtonNext>›</ButtonNext>
    </CarouselProvider>
  )
}

export default Carrusel
