import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom' 
import { TiendaContext } from '../Context/TiendaContext'
import './CSS/Loginsignup.css'
 
const LoginSignup = () => {
    const { handleLogin } = useContext(TiendaContext)
    const navigate = useNavigate()

    const [state, setState] = useState("Login")
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
    })

    const [errorMessage, setErrorMessage] = useState("")

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
//        console.log("Form data changed:", formData)
    }

    const validateSignup = () => {
        const isValid = formData.name && formData.email && formData.password
        console.log("Signup validation result:", isValid)
        if (!isValid) {
            setErrorMessage("Please fill in all fields to sign up.")
            return false
        }
        return true
    }


    const login = async () => {
//        console.log("Attempting to log in with data:", formData)

        if (!formData.email || !formData.password) {
          setErrorMessage("Please fill in all fields to log in.")
          return
        }
    
        try {
          const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
          })
      
          const data = await response.json()
//          console.log("Login response data:", data)

      
          if (data.success) {
            handleLogin(formData)
            navigate('/')
          } else {
            setErrorMessage(data.errors)
          }
        } catch (error) {
            console.error("Login error:", error)

          setErrorMessage("Error during login")
        }
      }
    

      const signup = async () => {
        if (!validateSignup()) return
      
        const termsAccepted = document.querySelector('input[type="checkbox"]').checked
        if (!termsAccepted) {
          setErrorMessage("Please accept the terms of use & privacy policy.")
          return
        }
      
        try {
          const response = await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
          })
      
          const data = await response.json()
      
          if (data.success) {
            handleLogin(formData)
            navigate('/')
          } else {
            setErrorMessage(data.errors)
          }
        } catch (error) {
            console.error("Signup error:", error)
          setErrorMessage("Error during signup")
        }
      }

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <h2>{state}</h2>
                <div className="loginsignup-fields">
                    {state === "Sign Up" &&
                        <input
                            name='name'
                            value={formData.name}
                            onChange={changeHandler}
                            type="text"
                            placeholder='Username' />}
                    <input
                        name='email'
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        placeholder='Email' />
                    <input
                        name='password'
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        placeholder='Password' />
                </div>
                <button
                    onClick={() => {
                        state === "Login"
                            ? login()
                            : signup()
                    }} 
                >Continuar</button>

                {state === "Sign Up"
                    ? <p className="loginsignup-login">
                        Ya tienes una cuenta?
                        <span onClick={() => { setState("Login") }}>Login</span></p>
                    : <p className="loginsignup-login">
                        Crear una cuenta
                        <span onClick={() => { setState("Sign Up") }}>Click aquí</span></p>}

                {state === "Sign Up" && 
                    <div className="loginsignup-agree">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms">By continuing, I agree to the terms of use & privacy policy.</label>
                    </div>}
            </div>
        </div>
    )
}

export default LoginSignup
