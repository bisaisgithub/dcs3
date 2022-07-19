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
      if (obj.type) {
        if(req.method === 'GET' && (obj.type === 'Admin' || obj.type === 'Dental Assistant')){
          const items_per_page = req.query.itemsPerPage || 10;
          const page = req.query.page || 1;
          const skip = (page-1) * items_per_page;
          const count = await CDCSSupplier.countDocuments();
          const response = await CDCSSupplier.find()
          .skip(skip)
          .limit(items_per_page)
          // console.log('response', response)
          if (response) {
            res.json({ success: true, data: response, pagination:{count, pageCount: count/items_per_page} });
          }else{
            res.json({ success: false, message: 'failed mdb find'});
          }
        }else if(req.method === 'POST' && obj.type === 'Admin' || obj.type === 'Dental Assistant'){
          console.log('req.body.filterType', req.body.filterType)
          if (req.body.filterType === 'createSupplier') {
            let data = { ...req.body.supplier, created_by: obj._id}
              const response = await CDCSSupplier.create(data);
              if (response) {
                res.json({ success: true, data: response });
              } else {
                res.json({success: false, message: 'failed mdb'})
              }
          }else if (req.body.filterType === 'searchSupplier') {
            let query = {}
            // console.log('req.body', req.body)
            if (req.body.searchSupplier.name !== '') {
              query = {...query, 
                name: new RegExp(`.*${req.body.searchSupplier.name}.*`,'i')
              }
            }
            if (req.body.searchSupplier.contact !== '') {
              query = {...query, 
                contact: new RegExp(`.*${req.body.searchSupplier.contact}.*`,'i')
              }
            }
            if (req.body.searchSupplier.email !== '') {
              query = {...query, 
                email: new RegExp(`.*${req.body.searchSupplier.email}.*`,'i')
              }
            }
            if (req.body.searchSupplier.address !== '') {
              query = {...query, 
                address: new RegExp(`.*${req.body.searchSupplier.address}.*`,'i')
              }
            }
            if (req.body.searchSupplier.status !== '') {
              query = {...query,
                status: req.body.searchSupplier.status
                    // {$regex: `.*${req.body.data.search.status}.*`, $options: 'i'} ,
              }
            }   
            // console.log('query', query)
            const items_per_page = req.query.itemsPerPage || 10;
            const page = req.query.page || 1;
            const skip = (page-1) * items_per_page;
            const count = await CDCSSupplier.countDocuments(query);
            const response = await CDCSSupplier.find(
              query
              )
              .skip(skip)
              .limit(items_per_page)
            // .populate("supplier_id", "name")
            res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})

          }else{
            res.json({success: false, message: 'failed filterT'})
          }
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