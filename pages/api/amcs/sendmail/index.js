import dbConnect from '../../../../utils/dbConnect';
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSEmailCode from '../../../../models/cdcs/CDCSEmailCode';
// import CDCSUsers7 from '../../../../models/cdcs/Users';
import AMCSUsers from '../../../../models/amcs/Users';
import AMCSEmailCode from '../../../../models/amcs/AMCSEmailCode';

const nodemailer = require('nodemailer');
const {google} = require('googleapis')

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: process.env.GOOGLE_REFRESH_TOKEN})


export default async function (req, res) {

  try {
    await dbConnect();
    const token = getCookie("amcsjwt", { req, res });
    if (!token) {
      res.json({message: "noToken" });
    } else {
      const code = Math.floor(1000 + Math.random() * 9000);
      const verified = jwt.verify(token, process.env.JWT_SECRETAMCS);
      if (verified.id === 'registration') {
        const checkNameExist = await AMCSUsers.find({
          email: req.body.email, 
          // email: req.body.email
        }, {name: 1}
        )
        // console.log('checkNameExist', checkNameExist.length)
        // res.json({success: true, data: checkUserExist})
        if (checkNameExist.length > 0) {
          res.json({message: 'existEmail'})
        } else {
          const accessToken = await oAuth2Client.getAccessToken()
          const transport = nodemailer.createTransport({
            service: 'gmail',
            auth:{
              type: 'OAuth2',
              user: process.env.EMAIL_USER,
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
              accessToken: accessToken
            }
          });
          const mailOptions = {
            from: `Pedia Clinic System <${process.env.EMAIL_USER}>`,
            to: `${req.body.email}`,
            subject: 'Pedia Registration Code',
            text: `Pedia Clinic Registration code: ${code}`,
            html: `<h3>Pedia Clinic Registration Code: ${code}</h3>`,
          };
          transport.sendMail(mailOptions, async (err)=>{
            if (err) {
              console.log('sending email error: ',err);
              res.json({message: 'sendingEmailError'})
            }else{
              // console.log('email sent')
              const codeFind = await AMCSEmailCode.findOne({email: req.body.email});
              if (codeFind) {
                const codeUpdate = await AMCSEmailCode.updateOne({
                  email: req.body.email}, {code, generated_times: codeFind.generated_times + 1});
                  if (codeUpdate.modifiedCount) {
                    res.json({ message: 'emailSentCodeUpdated' });
                  }else{
                    res.json({ message: 'failedEmailCodeUpdated' });
                  }
              }else{
                const codeCreate = await AMCSEmailCode.create({
                  email: req.body.email,
                  code, generated_times: 1
                });
                if (codeCreate) {
                  res.json({ message: 'emailSentCodeCreated' });
                } else {
                  res.json({ message: 'failedEmailCodeCreated' });
                }
                
              }
            }
          })
            
        }
      }else{
        res.json({message: "invalidToken" });
      }
    }
  } catch (error) {
    console.log('amcs send email catch error: ', error)
  }
}