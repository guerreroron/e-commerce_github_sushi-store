import React from 'react'

const SendMail = () => {
    const handleSendEmail = async () => {
        try {
          const response = await fetch('http://localhost:4000/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          const data = await response.json();
          if (response.ok) {
            console.log('Email sent successfully:', data.messageId)
          } else {
            console.error('Error sending email:', data.error)
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
    
      return (
        <div>
          <h1>Send Email</h1>
          <button onClick={handleSendEmail}>Send Email</button>
        </div>
      )
    }

export default SendMail
