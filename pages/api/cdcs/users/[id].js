import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  console.log('api dynamic req.query', req.query);
  if (req.method === "GET") {
    try {
      const user = await CDCSUsers7.findOne(
        {_id: req.query.id},
        {
          name: 1,
          email: 1,
          mobile: 1,
          type: 1,
          dob: 1,
          allergen: 1,
          created_by: 1,
          status: 1,
          gender: 1,
        }
      )
        // .populate("created_by", "name")
        .sort({ type: -1 });
      // console.log('user:', user);
      // const username = await CDCSUsers7.findOne({_id: })
      res.json({ sucess: true, data: user });
    } catch (error) {
      console.log("cath error admin", error);
      res.json({ success: false, error: `get error: ${error}` });
    }
  }else if (req.method === "POST") {
    // console.log('req.body post update user: ', req.body)
    try {
      const user = await CDCSUsers7.updateOne(
        {_id: req.query.id}, req.body
      );
      // console.log('user:', user);
      // const username = await CDCSUsers7.findOne({_id: })
      res.json({ success: true, data: user });
    } catch (error) {
      console.log("cath error post update user", error.message);
      res.json({ success: false, error: `get error: ${error}` });
    }
  } else {
    res.json({success: false, message: `invalid method: ${req.method}`})
  }
  
}