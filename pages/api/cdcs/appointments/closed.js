import dbConnect from "../../../../utils/dbConnect";
import Appointments from "../../../../models/cdcs/appointments";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
var ObjectId = require('mongodb').ObjectId;

export default async (req, res) => {
  
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
          console.log('query',req.query)
          const items_per_page = req.query.itemsPerPage || 10;
          const page = req.query.page || 1;
          const skip = (page-1) * items_per_page;
          const query = 
          {
              status: {$nin: [
                'On Schedule', 'In Waiting Area', 'In Procedure Room',
                'In Request',
              ]},
              // type: {$in: 'Portal'},
          }
          const count = await Appointments.countDocuments(query);
          // console.log('count', count)
          const response = await Appointments.find(query)
          .skip(skip)
          .limit(items_per_page)
          .populate("created_by", "name")
          .populate("patient_id", "name")
          .populate("doctor_id", "name")
          res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
        
        }else if (req.method === 'POST') {
          // console.log('closed req.body', req.body)
          let query = {
            $or: [ 
              {
                status: {$nin: [
                  'On Schedule', 'In Waiting Area', 'In Procedure Room',
                  'In Request',
                ]}
              }
            ], 
          }
          if (req.body.data.search.patient !== '') {
            const users = await CDCSUsers7.find(
              {name: new RegExp(`.*${req.body.data.search.patient}.*`,'i'), },
              {
                _id: 1,
              }
            )
            if (users) {
              // console.log('users true')
              query = {...query,
                patient_id: {$in: users }
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
          }if (req.body.data.search.dateStart !== '') {
            query = {...query,
              $and: [
                {
                  // date : {$gte: req.body.data.search.date.ISODate}
                  date: { $gte: new Date(req.body.data.search.dateStart) }
                  // { $gte : {$subtract : [x.ISODate,(1 * 24 * 60 * 60 * 1000)]} } // Here i need to subtract one day
                }, 
                {
                  date: { $lt: new Date(req.body.data.search.dateEnd).setDate(new Date(req.body.data.search.dateEnd).getDate() + 1) }
                }
                // {
                //   date: { $lt : {$subtract : [x.ISODate,(-1 * 24 * 60 * 60 * 1000)]}} // Here i need to add one day
                // }
                  ]
            }
          }
            const items_per_page = req.query.itemsPerPage || 10;
            const page = req.query.page || 1;
            const skip = (page-1) * items_per_page;
            const count = await Appointments.countDocuments(query);
            // console.log('page', page);
            // console.log('skip', skip);
            const response = await Appointments.find(query)
            .skip(skip)
            .limit(items_per_page)
            .populate("created_by", "name")
            .populate("patient_id", "name")
            .populate("doctor_id", "name")
            .sort({date: 1})
            res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
        }else {
          res.json({success: false, message: `mthd ${req.method}`})
        }
      } else {
        res.json({success: false, message: 'obj t nt a/r'})
      }
    }
  } catch (error) {
    console.log('catch error appointment index: ', error)
  }
}