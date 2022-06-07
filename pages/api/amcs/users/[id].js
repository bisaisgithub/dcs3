import dbConnect from "../../../../utils/dbConnect";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import AMCSUsers from "../../../../models/amcs/Users";
import AMCSModifications from "../../../../models/amcs/AMCSModifications";

export default async (req, res) => {
  // console.log('api dynamic req.query', req.query);

  try {
    await dbConnect();
    const token = getCookie("amcsjwt", { req, res });
    if (!token) {
      res.json({ success: false, message: "no-token" });
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRETAMCS);
      // console.log("verified.id:", verified);
      const obj = await AMCSUsers.findOne({ _id: verified.id }, { type: 1 });
      // console.log("obj:", obj);
      if (obj.type === 'Admin' || obj.type === 'Receptionist'){
        if (req.method === "GET") {
          const user = await AMCSUsers.findOne(
            {_id: req.query.id},
            {
              name: 1,
              email: 1,
              mobile: 1,
              type: 1,
              dob: 1,
              guardian: 1,
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
            const user = await AMCSUsers.updateOne(
              {_id: req.query.id}, req.body.new
            );
            const userModification = await AMCSModifications.create({
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