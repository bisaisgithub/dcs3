import dbConnect from '../../../../utils/dbConnect';
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSEmailCode from '../../../../models/cdcs/CDCSEmailCode';
// import CDCSUsers7 from '../../../../models/cdcs/Users';


export default async function (req, res) {

  try {
    await dbConnect();
    // const token = getCookie("cdcsjwt", { req, res });
    if (
      // !token
      false
      ) {
      res.json({message: "noToken" });
    } else {
      // const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (
        // verified.id === 'registration'
        true
        ) {
        const codeFind = await CDCSEmailCode.findOne({
          email: req.body.email,
          code: req.body.code
        });
        if (codeFind) {
          res.json({message: "codeOk" });
        } else {
          res.json({message: "codeInvalid" });
        }
      }else{
        res.json({message: "invalidToken" });
      }
    }
  } catch (error) {
    console.log('cdcs send email catch error: ', error)
  }
}
