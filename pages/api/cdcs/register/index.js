import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from '../../../../models/cdcs/Users'
const bcrypt = require("bcrypt");

dbConnect();

export default async function (req, res) {
  try {
    const token = sign(
      {
        id: 'registration', 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const serialised = serialize("cdcsjwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    res.setHeader("Set-Cookie", serialised);
    res.json({success: true, message: 'registration-tkn'})
  } catch (error) {
    res.json({success: false, message: 'error check admin'})
  }
}