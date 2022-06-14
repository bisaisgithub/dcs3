import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSSupplier from "../../../../models/cdcs/CDCSSupplier";

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
        if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Receptionist')){
          const response = await CDCSSupplier.find()
          console.log('response', response)
          if (response) {
            res.json({ success: true, data: response });
          }else{
            res.json({ success: false, message: 'failed mdb find'});
          }
        }else if(req.method === 'POST' && obj.type === 'Admin'){
            // console.log('req.body', req.body)
            let data = { ...req.body.supplier, created_by: obj._id}
            console.log('data', data);
            // console.log('req.body, ', req.body)
              const response = await CDCSSupplier.create(data);
              if (response) {
                res.json({ success: true, data: response });
              } else {
                res.json({success: false, message: 'failed mdb'})
              }
              // res.json({success: true, message: 'test'})
        }else {
          res.json({success: false, message: `mthd ${req.method} _x and nt a`})
        }
      } else {
        res.json({success: false, message: 'obj t nt a'})
      }
    }
  } catch (error) {
    console.log('catch error appointment index: ', error)
  }
}