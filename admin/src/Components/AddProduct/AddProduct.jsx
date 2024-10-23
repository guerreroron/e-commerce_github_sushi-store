import React, { useState } from 'react'
import './AddProduct.css'
import add_image from '../../assets/upload_image.png'
import add_image_thumb from '../../assets/upload_image_thumbnail.png'

const AddProduct = () => {
    const [image, setImage] = useState(null) // Imagen principal
    const [thumbnails, setThumbnails] = useState([]) // Imágenes miniaturas
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        thumbnails: [],
        category: "",
        new_price: "",
        old_price: "",
        description: ""
    })
    const [alertMessage, setAlertMessage] = useState(null)

    const maxSize = 300 * 1024

    const imageHandler = (e) => {
        const selectedImage = e.target.files[0]
        if (selectedImage && selectedImage.size > maxSize) {
            setAlertMessage('Error: El tamaño de las imagenes no debe ser mayor a 300 KB.')
            resetForm()
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
            return
        }
        setImage(e.target.files[0]) // Manejar la imagen principal
    }

    const thumbnailHandler = (event, index) => {
        const files = event.target.files
        if (files.length > 0) {
            if (files[0].size > maxSize) {
                setAlertMessage('Error: El tamaño de las imagenes no debe ser mayor a 300 KB.')
                resetForm()
                setTimeout(() => {
                    setAlertMessage(null)
                }, 3000)
                return
            }
            const newThumbnails = [...thumbnails]
            newThumbnails[index] = files[0] // Actualizar la imagen de miniatura
            setThumbnails(newThumbnails)
        }
    }

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }

    const addProduct = async () => {
        let responseData

        // Subir la imagen principal y las miniaturas
        const formData = new FormData()
        formData.append('product', image) // Imagen principal

        // Añadir miniaturas
        thumbnails.forEach((thumbnail) => {
            if (thumbnail) {
                formData.append('thumbnails', thumbnail) // Añadir cada miniatura
            }
        })

        // Realizar la solicitud de subida
        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: formData
        }).then((resp) => resp.json()).then((data) => {
            responseData = data
        })

        if (responseData.success) {
            // Actualizar el objeto productDetails con las URLs recibidas
            const product = {
                ...productDetails,
                image: responseData.image_url, // URL de la imagen principal
                thumbnails: responseData.thumbnails // URLs de miniaturas
            }

            // Añadir el producto
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }).then((resp) => resp.json()).then((data) => {
                if (data.success) {
                    setAlertMessage('Product added')

                    // Resetear formulario
                    setProductDetails({
                        name: "",
                        image: '',
                        thumbnails: [], 
                        category: "",
                        new_price: "",
                        old_price: "",
                        description: ""
                    })
                    setImage(null)
                    setThumbnails([]) // Reset thumbnails
                } else {
                    setAlertMessage('Fail adding product')
                }

                // Ocultar alerta después de 3 segundos
                setTimeout(() => {
                    setAlertMessage(null)
                }, 3000)
            })
        } else {
            setAlertMessage('Failed to upload images')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }

    const resetForm = () => {
        setImage(null)
        setThumbnails([])
    }

    return (
        <div className='addproduct'>
            <h2>Add product</h2>
            <div className="addprod-item-field">
                <p>Product title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name='name'
                    placeholder='Type here' />
            </div>
            <div className="addprod-item-price">
                <div className="addprod-item-field">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text" name='old_price'
                        placeholder='Type here' />
                </div>
                <div className="addprod-item-field">
                    <p>Offer price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="text" name='new_price'
                        placeholder='Type here' />
                </div>
            </div>
            <div className='addprod-selectimage'>
                <div className="addprod-item-field">
                    <p>Product category</p>
                    <select
                        value={productDetails.category}
                        onChange={changeHandler}
                        name="category"
                        className='addprod-selector'>
                        <option disabled value="">Select a category</option>
                        <option value="roll">Rolls</option>
                        <option value="handroll">Handrolls</option>
                        <option value="sashimi">Sashimi</option>
                        <option value="table">Tablas</option>
                    </select>
                    <p>Description</p>
                    <textarea
                        value={productDetails.description}
                        onChange={changeHandler}
                        name='description'
                        placeholder='Type here'
                        rows="5"
                        cols="40"
                    />
                </div>
                <div className="addprod-item-field-image">
                    <div className='main-image'>
                        <label htmlFor="file-input">
                            <img src={image
                                ? URL.createObjectURL(image)
                                : add_image}
                                className='add-image-icon'
                                alt="upload image icon" />
                        </label>
                        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
                    </div>
                    <div className="thumb-images">
                        {[0, 1, 2, 3].map(index => (
                            <div key={index} className="thumb-image">
                                <label htmlFor={`file-input-${index}`}>
                                    <img src={thumbnails[index] ? URL.createObjectURL(thumbnails[index]) : add_image_thumb} className='add-image-icon' alt={`thumbnail ${index + 1}`} />
                                </label>
                                <input onChange={(e) => thumbnailHandler(e, index)} type="file" name={`thumbnail-${index}`} id={`file-input-${index}`} hidden />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='addprod-btn-container'>
                <button
                    onClick={() => addProduct()}
                    className='addprod-btn'>ADD
                </button>
            </div>
            <div className={`alertmessage ${alertMessage ? 'active' : ''}`}>
                {alertMessage && <div className="alert">{alertMessage}</div>}
            </div>
        </div>
    )
}

export default AddProduct
