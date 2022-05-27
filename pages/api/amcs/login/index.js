import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import dbConnect from "../../../../utils/dbConnect";
import AMCSUsers from "../../../../models/amcs/Users";
const bcrypt = require("bcrypt");

dbConnect();

export default async function (req, res) {
  try {
    // console.log("req.body.email:", req.body.email);
    const user = await AMCSUsers.findOne(
      { email: req.body.email },
      { password: 1 }
    );
    // console.log("user:", user);
    if (!user) {
      return res.json({ success: false, message: "invalid email" });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.json({ success: false, message: "invalid password" });
    } else {
      const token = sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRETAMCS,
        { expiresIn: "1d" }
      );
      const serialised = serialize("amcsjwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      res.setHeader("Set-Cookie", serialised);

      res.json({ success: true, message: "tagumpay ang login nya"});
    }
  } catch (error) {
    res.json({ success: false, error: `get error: ${error}` });
  }

}
