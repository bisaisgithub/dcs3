const nodemailer = require('nodemailer');



export default async function (req, res) {
  try {
  console.log('req.body: ', req.body)
  let mailTransporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user: 'benaremailtestapp@gmail.com',
      pass: 'Raneb@g012583e21'
    }
  })
  const code = Math.floor(1000 + Math.random() * 9000);
  let details = {
    from: 'benaremailtestapp@gmail.com',
    to: `${req.body.email}`,
    subject: 'test sendmail nodemailer',
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
  }
  

  
}