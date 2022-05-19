import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import CDCSModifications from "../../../../models/cdcs/CDCSModifications";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  // console.log('api dynamic req.query', req.query);

  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
      res.json({ success: false, message: "no-token" });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      // console.log("obj:", obj);
      if (obj.type === 'Admin'){
        if (req.method === "GET") {
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
        }else if (req.method === "POST") {
          // console.log('req.body post update user: ', req.body)
            const user = await CDCSUsers7.updateOne(
              {_id: req.query.id}, req.body.new
            );
            const userModification = await CDCSModifications.create({
              new: req.body.new, old: req.body.old, type: 'UserModification', modified_by: obj._id
            });
            // console.log('user:', user);
            // const username = await CDCSUsers7.findOne({_id: })
            res.json({ success: true, data: user });
        } else {
          res.json({success: false, message: `invalid method: ${req.method}`})
        }
      }else{
        res.json({success: false, message: 'typ_x'})
      }
    }
  } catch (error) {
    console.log('catch error [id]', error)
  }

 
  
}