import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
// import CDCSSupplier from "../../../../models/cdcs/CDCSSupplier";
import CDCSUsers7 from "../../../../../models/cdcs/Users";
import dbConnect from "../../../../../utils/dbConnect";
import CDCSInventory from "../../../../../models/cdcs/CDCSInventory";

export default async (req, res) => {
  
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
        res.json({success: false, message: 'tkn_e'})
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      if (obj.type === 'Admin' || obj.type === 'Receptionist') {
        if (req.method === 'GET') {
          console.log('req.query.id', req.query.id);
          const item = await CDCSInventory.findOne({ "items:": [{"qty_remain":{ $gte: 0}}] });
          res.json({ success: true, data: item });
        } else {
          res.json({success: false, message: `mthd ${req.method} _x`})
        }
        // if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Receptionist')){
        //   const response = await CDCSSupplier.find()
        //   console.log('response', response)
        //   if (response) {
        //     res.json({ success: true, data: response });
        //   }else{
        //     res.json({ success: false, message: 'failed mdb find'});
        //   }
        // }else if(req.method === 'POST' && obj.type === 'Admin'){
        //     let data = { ...req.body.supplier, created_by: obj._id}
        //     console.log('data', data);
        //       const response = await CDCSSupplier.create(data);
        //       if (response) {
        //         res.json({ success: true, data: response });
        //       } else {
        //         res.json({success: false, message: 'failed mdb'})
        //       }
        // }else {
        //   res.json({success: false, message: `mthd ${req.method} _x and nt a`})
        // }
      } else {
        res.json({success: false, message: 'obj t nt a'})
      }
    }
  } catch (error) {
    console.log('catch error appointment index: ', error)
  }
}