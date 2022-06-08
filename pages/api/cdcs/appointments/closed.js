import dbConnect from "../../../../utils/dbConnect";
import Appointments from "../../../../models/cdcs/appointments";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

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
          const items_per_page = req.query.itemsPerPage || 10;
          const page = req.query.page || 1;
          const skip = (page-1) * items_per_page;
          const query = 
          {
              status: {$in: ['Closed', 'Closed No Show', 'Closed w/ Balance']},
              // type: {$in: 'Portal'},
          }
          const count = await Appointments.countDocuments(query);
          // console.log('count', count)
          const response = await Appointments.find(query)
          .populate("created_by", "name")
          .populate("patient_id", "name")
          .populate("doctor_id", "name")
          res.json({success: true, data: response, pagination:{count, pageCount: count/items_per_page}})
        
        } 
        else {
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