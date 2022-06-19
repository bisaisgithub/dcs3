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
        if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Receptionist')){
          console.log('get closed')
          const items_per_page = req.query.itemsPerPage || 10;
          const page = req.query.page || 1;
          const skip = (page-1) * items_per_page;
          const query = 
          {
              status: {$nin: [
                'In Request', 'In Supplier', 'In Shipping'
                // 'Received'
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
          res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
        }else if(req.method === 'POST' && obj.type === 'Admin'){
          console.log('get closed filter')
          // console.log('req.body', req.body.data.inventory)
          if(req.body.data.filterType === 'addInventory'){
            if (req.body.data.inventory.supplier_id._id !=='' ) {
              let data = {...req.body.data.inventory, supplier_id: req.body.data.inventory.supplier_id._id}
              const response = await CDCSInventory.create(data)
              // console.log('response', response);
              if (response) {
                    res.json({ success: true, data: response });
                  } else {
                    res.json({success: false, message: 'failed mdb'})
                  }
            } else {
              let data = {...req.body.data.inventory, supplier_id: undefined}
              const response = await CDCSInventory.create(data)
              if (response) {
                res.json({ success: true, data: response });
              } else {
                res.json({success: false, message: 'failed mdb'})
              }
            }
          }else if(req.body.data.filterType === 'search'){
            let query = {
              $or: [ 
                {status: {$nin: [
                  'In Request', 'In Supplier', 'In Shipping'
                ]}},
              ], 
            }
            if (req.body.data.search.name !== '') {
              const suppliers = await CDCSSupplier.find(
                {name: new RegExp(`.*${req.body.data.search.name}.*`,'i'), },
                {
                  _id: 1,
                }
              )
              // console.log('suppliers', suppliers)
              if (suppliers) {
                query = {...query,
                  supplier_id: {$in: suppliers }
                }
              }else{
                console.log('users false line 78')
              }
            }
            if (req.body.data.search.status !== '') {
              query = {...query,
                status: req.body.data.search.status
                    // {$regex: `.*${req.body.data.search.status}.*`, $options: 'i'} ,
              }
            }
            if (req.body.data.search.date_ordered !== '') {
              query = {...query,
                $and: [
                  {
                    date_ordered: { $gte: new Date(req.body.data.search.date_ordered) }
                  }, 
                  {
                    date_ordered: { $lt: new Date(req.body.data.search.date_ordered).setDate(new Date(req.body.data.search.date_ordered).getDate() + 1) }
                  }
                    ]
              }
            }
            // console.log('dater_received', req.body.data.search.date_received)
            if (req.body.data.search.date_received !== '') {
              query = {...query,
                $and: [
                  {
                    date_received: { $gte: new Date(req.body.data.search.date_received) }
                  }, 
                  {
                    date_received: { $lt: new Date(req.body.data.search.date_received).setDate(new Date(req.body.data.search.date_received).getDate() + 1) }
                  }
                    ]
              }
            }
            if (req.body.data.search.date_received === null) {
              query = {...query,
                $and: [
                  {
                    date_received: null
                  }, 
                  // {
                  //   date_received: { $lt: new Date(req.body.data.search.date_received).setDate(new Date(req.body.data.search.date_received).getDate() + 1) }
                  // }
                    ]
              }
            }
            if (req.body.data.search.invoice_no !== '') {
              const suppliers = await CDCSSupplier.find(
                query = {...query, invoice_no: new RegExp(`.*${req.body.data.search.invoice_no}.*`,'i')}
              )
            }
            const items_per_page = req.query.itemsPerPage || 10;
            const page = req.query.page || 1;
            const skip = (page-1) * items_per_page;
            const count = await CDCSInventory.countDocuments(query);
            // console.log('page', page);
            // console.log('skip', skip);
            const response = await CDCSInventory.find(
              query
              )
            .skip(skip)
            .limit(items_per_page)
            .populate("supplier_id", "name")
            res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
          }else{
            res.json({success: false, message: 'failed filterT'})
          }
          
        }else {
          res.json({success: false, message: `mthd ${req.method} _x and nt a`})
        }
    }
  } catch (error) {
    console.log('catch error appointment index: ', error)
    res.json({success: false, message: `ctch err`})
  }
}