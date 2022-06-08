import dbConnect from '../../../../utils/dbConnect';
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import AMCSEmailCode from '../../../../models/amcs/AMCSEmailCode';


export default async function (req, res) {

  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      res.json({message: "noToken" });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (verified.id === 'registration') {
        const codeFind = await AMCSEmailCode.findOne({
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