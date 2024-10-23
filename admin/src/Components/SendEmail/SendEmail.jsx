import React, { useEffect, useState } from 'react';
import './SendEmail.css'
import { useCtx_Ctrl_Panel } from '../../Context_CtrlPanel/Context_CtrlPanel'

const SendEmail = () => {
    const {selectedEmails = []} = useCtx_Ctrl_Panel()
    const [to, setTo] = useState(selectedEmails.join(', '))
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [showDestinatarios, setShowDestinatarios] = useState(false)
    

    useEffect(() => {
        setTo(selectedEmails.join(', '))
        setShowDestinatarios(selectedEmails.length > 0);
      }, [selectedEmails])

      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:4000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, message })
            })

            if (!response.ok) {
                throw new Error('Error en el envío del correo')
            }

            const data = await response.json()
            console.log('Email enviado a:', to)
            console.log('Asunto:', subject)
            console.log('Mensaje:', message)

            alert(`Correo enviado: ${data.messageId}`)

            // Resetear los campos después de enviar
            setTo('')
            setSubject('')
            setMessage('')
            setShowDestinatarios(false)
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema al enviar el correo: ' + error.message);
        }
    }

  return (
    <div className='sendemail-container'>
        <h2>Send email</h2>
        <form onSubmit={handleSubmit}>
            <div className='sendemail-field'>
            <label htmlFor="to" className='sendemail-label'>Para:</label>
            <input
                type="text"
                id="to"
                className='sendemail-input'
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
            />
            </div>
            <div className='sendemail-field'>
            <label htmlFor="subject" className='sendemail-label'>Asunto:</label>
            <input
                type="text"
                id="subject"
                className='sendemail-input'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />
            </div>
            <div className='sendemail-field'>
            <label htmlFor="message" className='sendemail-label'>Mensaje:</label>
            <textarea
                id="message"
                className='sendemail-textarea'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            ></textarea>
            </div>
            <div className='sendemail-btn-container'>
                <button type="submit" className='sendemail-button'>Enviar Email</button>
            </div>
        </form>
        {showDestinatarios && (
                <div className='div-destinos-padre'>
                    <p>Destinatarios en este correo:</p>
                    <div className='destinatarios-div'> 
                        {selectedEmails.map((email, index) => (
                            <p key={index} className='destinatarios'>{email}</p>
                        ))}
                    </div>
                </div>
            )}
    </div>
  )
}

export default SendEmail
