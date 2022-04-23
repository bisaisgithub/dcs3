import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from '../../../../models/cdcs/Users'
const bcrypt = require("bcrypt");

dbConnect();

export default async function (req, res) {
  try {
    // console.log("req.body.email:", req.body.email);
    const user = await CDCSUsers7.findOne(
      { email: req.body.email },
    );
    // console.log("user:", user);
    if (!user) {
      return res.json({ success: true, message: "email does not exist" });
    }else{
      return res.json({ success: false, message: "email exist" });
    }
  } catch (error) {
    res.json({ success: false, error: `get error: ${error}` });
  }

}
