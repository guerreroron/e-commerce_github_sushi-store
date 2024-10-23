import React, { createContext, useContext, useState } from 'react'

const Context_CtrlPanel = createContext()

export const useCtx_Ctrl_Panel = () => useContext(Context_CtrlPanel)

export const CtxProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null)
  const [authToken, setAuthToken] = useState(null)
  const [redirectPath, setRedirectPath] = useState(null)
  const [username, setUsername] = useState(null)
  const [adminId, setAdminId] = useState(null)
  const [selectedEmails, setSelectedEmails] = useState([])

    // Función para agregar o eliminar correos seleccionados
    const toggleEmailSelection = (email) => {
        setSelectedEmails((prevEmails) => {
            const newEmails = prevEmails.includes(email)
                // Eliminar el email si ya está seleccionado
                ? prevEmails.filter(e => e !== email) 
                // Agregar el email si no está seleccionado
                : [...prevEmails, email]
            
            /* console.log("Correos seleccionados:", newEmails) */
            return newEmails
        })
    }

// Función de login para administradores
const loginadm = (token, role, user, id) => { 
    setAuthToken(token)
    setUserRole(role)
    setUsername(user)
    setAdminId(id)


    // Ruta de redirección según rol
    if (role === 'admin') {
      setRedirectPath('/admin')
    } else if (role === 'superuser') {
      setRedirectPath('/security-quest')
    }
  }

  // Cerrar sesión
  const logout = () => {
    setAuthToken(null)
    setUserRole(null)
    setUsername(null)
    setAdminId(null) 
    setRedirectPath('/login')
  }

  return (
    <Context_CtrlPanel.Provider value={{ 
        userRole, 
        authToken, 
        loginadm, 
        logout, 
        redirectPath, 
        username, 
        adminId, 
        selectedEmails, 
        toggleEmailSelection 
    }}>
      {children}
    </Context_CtrlPanel.Provider>
  )
}