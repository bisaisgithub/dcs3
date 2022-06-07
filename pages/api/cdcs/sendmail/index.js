const nodemailer = require('nodemailer');



export default async function (req, res) {
  try {
  // console.log('req.body: ', req.body)
  // console.log(`${process.env.EMAIL_USER} + ${process.env.EMAIL_PASS}` )
  let mailTransporter = nodemailer.createTransport({
    // service:'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    ignoreTLS: false,
    secure: false,
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  const code = Math.floor(1000 + Math.random() * 9000);
  let details = {
    from: process.env.EMAIL_USER,
    to: `${req.body.email}`,
    subject: 'Calimlim Registration Code',
    text: `Calimlim Registration code: ${code}`
  }
  
    mailTransporter.sendMail(details, (err)=>{
      if (err) {
        console.log('sending email error: ',err);
        res.json({success: false})
      }else{
        // console.log('email sent')
        res.json({success: true, c:code})
      }
    })
  } catch (error) {
    res.json({success: false})
    console.log('catch email error:', error)
  }
  

  
}