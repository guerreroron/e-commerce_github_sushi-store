import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import delete_icon from '../../assets/delete_24dp.png'
import edit_icon from '../../assets/edit_24dp.png'

const ListProduct = () => {

    const [allProducts, setAllProducts] = useState([])
    const [orderType, setOrderType] = useState()

    const fetchInfo = async () => {
        let url

        switch (orderType) {
            case 'best-products':
                url = 'http://localhost:4000/bestproducts'
                break
            case 'new-products':
                url = 'http://localhost:4000/newproducts'
                break
            case 'inactive-products':
                url = 'http://localhost:4000/inactiveproducts'
                break
            default:
                url = 'http://localhost:4000/allproducts'
                break
        }

        try {
            const res = await fetch(url)
            const data = await res.json()
            setAllProducts(data.reverse())
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }
 
    useEffect(() => {
        fetchInfo()
    }, [orderType])

    const handleOrderChange = (event) => {
        setOrderType(event.target.value)
    }

    const remove_product = async (id) => {
        try {
            const res = await fetch(`http://localhost:4000/removeproduct/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if (data.success) {
                await fetchInfo()
            } else {
                console.error("Failed to remove product:", data.message)
            }
        } catch (error) {
            console.error("Error removing product:", error)
        }
    }

    const edit_product = async (id) => {
      console.log('editproduct-btn')
    }

    return (
        <div className='listproduct'>
            <h2>All product list</h2>
            <select name="product_order" id="product_order" size="1" onChange={handleOrderChange}>
                <option className='option' value="">Seleccione un orden</option>
                <option value="best-products">Productos top</option>
                <option value="new-products">Productos nuevos</option>
                <option value="inactive-products">Productos inactivos</option>
            </select>
            <div className="listprod-main headers">
                <p>Products</p>
                <p>Title</p>
                <p>Old price</p>
                <p>New price</p>
                <p>Category</p>
                <p>Edit</p>
                <p>Remove</p>
            </div>
            <div className="listprod-allproducts">
                <hr />
                {allProducts.map((product, index) => (
                    <div key={index} className="listprod-main list">
                        <img src={product.image} alt="" className="listprod-thumbnail" />
                        <p>{product.name}</p>
                        <p>${product.old_price}</p>
                        <p>{product.new_price}</p>
                        <p>{product.category}</p>
                        <img
                            onClick={() => edit_product(product.id)}
                            className='listprod-remove-icon'
                            src={edit_icon}
                            alt="icon edit"
                        />
                        <img
                            onClick={() => remove_product(product.id)}
                            className='listprod-remove-icon'
                            src={delete_icon}
                            alt="icon papelera"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListProduct
