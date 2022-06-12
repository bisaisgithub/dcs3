import dbConnect from "../../../../utils/dbConnect";
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
      if (obj.type === 'Admin' || obj.type === 'Receptionist') {
        if (req.method === 'GET') {
          const response = await CDCSFields.findOne({'fields.postType': 'procedure'})
          .sort({ createdAt: -1 });
          // console.log('response',response)
          res.json({success: true, data: response})
        } else if(req.method === 'POST' && obj.type === 'Admin'){
          if (req.body.postType === 'procedure') {
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
          }else if (req.body.postType === 'getItemName') {
            // console.log('test getitemname req.body', req.body)
            const response = await CDCSFields.findOne({'fields.postType': 'getItemName'})
            .sort({ createdAt: -1 });
            // console.log('response',response)
            if (response) {
              res.json({success: true, data: response})
            } else {
              res.json({success: false, message: 'failed mdb'})
            }
            
          }else if (req.body.postType === 'updateItemName') {
            // console.log('test getitemname req.body', req.body)
            let data = { fields:{app: {...req.body.app}, postType: 'getItemName'} , modified_by: obj._id}
            // console.log('data', data);
            // console.log('req.body, ', req.body)
              const response = await CDCSFields.create(data);
              if (response) {
                res.json({ success: true, data: response });
              } else {
                res.json({success: false, message: 'failed mdb'})
              }
          }else {
            res.json({success: false, message: `postT ${req.body.postType} _x`})
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