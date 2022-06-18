import dbConnect from "../../../../utils/dbConnect";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSSupplier from "../../../../models/cdcs/CDCSSupplier";
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
      if (obj.type === 'Admin') {
        if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Receptionist')){
          const items_per_page = req.query.itemsPerPage || 10;
          const page = req.query.page || 1;
          const skip = (page-1) * items_per_page;
          const query = 
          {
              status: {$nin: [
                // 'In Request', 'In Supplier', 'In Shipping',
                'In Received'
              ]}
          }
          const count = await CDCSInventory.countDocuments(query);
          // console.log('page', page);
          // console.log('skip', skip);
          const response = await CDCSInventory.find(
            query
            )
          .skip(skip)
          .limit(items_per_page)
          .populate("supplier_id", "name")
          // .populate("patient_id", "name")
          // .populate("doctor_id", "name")
          res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
        }else if(req.method === 'POST' && obj.type === 'Admin'){
          // console.log('req.body', req.body.data.inventory)
          if (req.body.data.inventory.supplier.id !=='' ) {
            let data = {...req.body.data.inventory, supplier_id: req.body.data.inventory.supplier.id}
            const response = await CDCSInventory.create(data)
            // console.log('response', response);
            if (response) {
                  res.json({ success: true, data: response });
                } else {
                  res.json({success: false, message: 'failed mdb'})
                }
          } else {
            let data = {...req.body.data.inventory}
            const response = await CDCSInventory.create(data)
            // console.log('response', response);
            if (response) {
              res.json({ success: true, data: response });
            } else {
              res.json({success: false, message: 'failed mdb'})
            }
          }
          
            // let data = { ...req.body.supplier, created_by: obj._id}
            // console.log('data', data);
            //   const response = await CDCSSupplier.create(data);
            //   if (response) {
            //     res.json({ success: true, data: response });
            //   } else {
            //     res.json({success: false, message: 'failed mdb'})
            //   }
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