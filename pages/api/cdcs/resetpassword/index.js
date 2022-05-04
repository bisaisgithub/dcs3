import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from '../../../../models/cdcs/Users'
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

dbConnect();

export default async function (req, res) {
  try {
    // console.log("req.body.email:", req.body.email);
    const user = await CDCSUsers7.findOne(
      { email: req.body.email },
    );
    // console.log("user:", user);
    if (!user) {
      return res.json({ success: false, message: "email does not exist" });
    }else{
      const password = Math.floor(1000 + Math.random() * 9000);
      const hash = bcrypt.hashSync(password.toString(), 10);
      try {
        const user = await CDCSUsers7.updateOne(
          {email: req.body.email}, {password: hash}
        );
        // console.log('user:', user);
        // const username = await CDCSUsers7.findOne({_id: })
        try {
          let mailTransporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          })
          let details = {
            from: process.env.EMAIL_USER,
            to: `${req.body.email}`,
            subject: 'Calimlim: Password Reset',
            text: `Calimlim: Your new password is: ${password}`
          }
          
            mailTransporter.sendMail(details, (err)=>{
              if (err) {
                console.log('sending email error: ',err);
                res.json({success: false, message: 'sending email error check server console'})
              }else{
                // console.log('email sent')
                res.json({success: true, data: user})
              }
            })
          } catch (error) {
            console.log('catch error line 53: ', error)
            res.json({success: false})
          }
        // res.json({ success: true, data: user });
      } catch (error) {
        console.log("cath error post update user", error.message);
        res.json({ success: false, error: `get error: ${error}` });
      }
      // return res.json({ success: false, message: "email exist" });
    }
  } catch (error) {
    res.json({ success: false, error: `get error: ${error}` });
  }

}