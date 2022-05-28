import dbConnect from "../../../../utils/dbConnect";
import Appointments from "../../../../models/cdcs/appointments";
import CDCSUsers7 from "../../../../models/cdcs/Users";
// import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSFields from "../../../../models/cdcs/Fields";

export default async (req, res) => {
  
  // await dbConnect();
  // const response = await CDCSFields.findOne()
  //         .sort({ createdAt: -1 });
  // res.json({success: true, data: response})
  
  try {
    // console.log('appointment api index')
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
        // removeCookies("cdcsjwt", { req, res });
        // return { redirect: { destination: "/cdcs/login" } };
        res.json({success: false, message: 'tkn_e'})
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      if (obj.type === 'Admin') {
        if (req.method === 'GET') {
          const response = await CDCSFields.findOne()
          .sort({ createdAt: -1 });
          res.json({success: true, data: response})
        } else if(req.method === 'POST'){
            // console.log('req.body', req.body)
            let data = { fields: req.body, modified_by: obj._id}
            // console.log('data', data);
            // console.log('req.body, ', req.body)
              const response = await CDCSFields.create(data);
              if (response) {
                res.json({ success: true, data: response });
              } else {
                res.json({success: false, message: 'failed mdb'})
              }
              // res.json({success: true, message: 'test'})
        }else {
          res.json({success: false, message: `mthd ${req.method}`})
        }
      } else {
        res.json({success: false, message: 'obj t nt a'})
      }
    }
  } catch (error) {
    console.log('catch error appointment index: ', error)
  }
}