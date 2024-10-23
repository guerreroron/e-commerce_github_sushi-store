import React, { createContext, useCallback, useEffect, useState } from 'react'

export const TiendaContext = createContext(null)

const getDefaultCart = () => {
    let cart = {}
    for (let index = 0; index < 100 + 1; index++) {
        cart[index] = 0
    }
    return cart
}
 
const TiendaContextProvider = (props) => {
    const [all_product, setAll_product] = useState([])
    const [cartItems, setCartItems] = useState(getDefaultCart())
    const [user, setUser] = useState(null)
    const [authToken, setAuthToken] = useState(null)
    const [selectedSauces, setSelectedSauces] = useState({})
    const [sessionWarning, setSessionWarning] = useState(false)
    const tokenExpireTime = 15 * 60 * 1000 // 15 minutos en milisegundos
    

    // Función para renovar el token
    const renewToken = async () => {
        try {
            const response = await fetch('http://localhost:4000/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                credentials: 'include',
            })
            const data = await response.json()
            if (data.success) {
                setAuthToken(data.token)
                setSessionWarning(false) // Quitar la advertencia de sesión
            } else {
                alert('Error al renovar el token')
                handleLogout() // Si la renovación falla, desloguear al usuario
            }
        } catch (error) {
            console.error('Error during token renewal:', error)
            alert('Error al renovar el token')
            handleLogout()
        }
    }

    // Función para mostrar alerta y renovar token si es aceptada
    const showSessionWarning = () => {
        setSessionWarning(true)
        const userAction = window.confirm('Tu sesión expirará en 60 segundos. ¿Quieres renovarla?')
        if (userAction) {
            renewToken()
        }
    }

    useEffect(() => {
        let warningTimeout, expirationTimeout

        if (authToken) {
            // Mostrar alerta 60 segundos antes de la expiración
            warningTimeout = setTimeout(() => {
                showSessionWarning()
            }, tokenExpireTime - 60 * 1000) // 60 segundos antes

            // Desloguear si el token expira
            expirationTimeout = setTimeout(() => {
                handleLogout()
            }, tokenExpireTime)
        }

        return () => {
            clearTimeout(warningTimeout)
            clearTimeout(expirationTimeout)
        }
    }, [authToken])

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
        .then((response) => response.json())
        .then((data) => setAll_product(data))
    }, [])

    const goHome = useCallback(() => {
        window.location.href = '/'
    }, [])

    useEffect(() => {
        if (authToken) {
            fetch('http://localhost:4000/getuser', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user)
                } else {
                    setAuthToken(null)
                    setUser(null)
                }
            })
            .catch(() => {
                setAuthToken(null)
                setUser(null)
            })
        }
    }, [authToken])

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    }

    const addSauceToCart = (itemId, sauce) => {
        setSelectedSauces((prev) => ({ ...prev, [itemId]: sauce }))
    }

    const getSauceForItem = (itemId) => {
        return selectedSauces[itemId] || 'Ninguna salsa'
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const clearCart = () => {
        setCartItems(getDefaultCart())
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = all_product.find((product) => product.id === Number(item))
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item]
                } else {
                    console.warn(`Item with ID ${item} not found in product list`)
                }
            }
        }
        return totalAmount
    }

    const getTotalCartItems = () => {
        let totalItem = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item]
            }
        }
        return totalItem
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include',
            })
            const data = await response.json()
            if (data.success) {
                setUser(null)
                setAuthToken(null)
                goHome()
            }
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }
 
    // Método para iniciar sesión y almacenar el token
    const handleLogin = async (credentials) => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })
            const data = await response.json()
            if (data.success) {
                setAuthToken(data.token) // Almacena el token
                setUser(data.user)
            } else {
                // Maneja errores de autenticación
                alert('Error de autenticación')
            }
        } catch (error) {
            console.error('Error during login:', error)
            alert('Error de autenticación')
        }
    }

    // Related products
    const fetchRelatedProducts = async (category) => {
        try {
            const response = await fetch(`http://localhost:4000/products?category=${category}`)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching products by category:', error)
            return []
        }
    }

    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
        user,
        setUser,
        handleLogout,
        handleLogin, 
        fetchRelatedProducts,
        addSauceToCart,
        getSauceForItem,
        authToken,
        clearCart, 
        renewToken, 
        sessionWarning
    }

    return (
        <TiendaContext.Provider value={contextValue}>
            {props.children}
        </TiendaContext.Provider>
    )
}

export default TiendaContextProvider
