import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSInventory from "../../../../models/cdcs/CDCSInventory";

export default async (req, res) => {
  try {
    await dbConnect();
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
        res.json({success: false, message: 'tkn_e'})
    } else {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
        if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Dental Assistant')){
          const response = await CDCSInventory.findOne({_id: req.query.id},
            {
              createdAt: 0,updatedAt:0 
            })
          .populate({path: 'supplier_id', select: ['name', 'email','contact', 'address']})
          if (response) {
            res.json({success: true, data: response })
          } else {
            res.json({success: true, message: 'empty resp' })
          }
        }else if(req.method === 'POST' && (obj.type === 'Admin'|| obj.type === 'Dental Assistant')){
          // console.log('req.body', req.body.data.inventory)
          console.log('req.query', req.query.id)
          console.log('req.body', req.body.data.inventory)
          if (req.body.data.inventory.supplier_id === undefined || req.body.data.inventory.supplier_id._id !=='' ) {
            console.log('not empty supplier')
            let data = {...req.body.data.inventory, 
              // supplier_id: req.body.data.inventory.supplier_id.id
            }
            const response = await CDCSInventory.updateOne({_id: req.query.id},data)
            console.log('response', response);
            if (response) {
                  res.json({ success: true, data: response });
                } else {
                  res.json({success: false, message: 'failed mdb'})
                }
          } else {
            console.log('empty supplier')
            let data = {...req.body.data.inventory}
            const response = await CDCSInventory.updateOne({_id: req.query.id},data)
            if (response) {
              res.json({ success: true, data: response });
            } else {
              res.json({success: false, message: 'failed mdb'})
            }
          }
        }else {
          res.json({success: false, message: `mthd ${req.method} _x and nt a`})
        }
    }
  } catch (error) {
    console.log('catch error appointment id: ', error)
    res.json({success: false, message: `catch err`})
  }
}