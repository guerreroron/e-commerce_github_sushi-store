const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "osvaldo55@ethereal.email",
    pass: "FQ6FH9JkCvtavNA61G"
  },
  tls: {
    rejectUnauthorized: false 
  }
})

const sendMail = async (req, res) => {
    const { to, subject, message } = req.body

    try {
      const info = await transporter.sendMail({
        from: '"Testing 53!" <testing53@ethereal.email>',
        to,
        subject,
        text: message,
        html: `<b>${message}</b>`
      });
    
    console.log("Message sent: %s", info.messageId)
    res.status(200).json({ messageId: info.messageId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error sending email' })
  }
}

module.exports = { sendMail }