import dbConnect from "../../../../utils/dbConnect";
import Appointments from "../../../../models/cdcs/appointments";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import bcrypt from "bcrypt";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  
  try {
    const token = getCookie("cdcsjwt", { req, res });
    if (!token) {
        // removeCookies("cdcsjwt", { req, res });
        // return { redirect: { destination: "/cdcs/login" } };
        res.json({success: false, message: 'tkn_e'})
    } else {
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      if (req.method === 'GET') {
        const response = await Appointments.find()
        .populate("created_by", "name")
        .populate("patient_id", "name")
        .populate("doctor_id", "name")
        res.json({success: true, data: response})
      } else if(req.method === 'POST'){
        if (obj.type === 'Admin' || obj.type === 'Appointment Setter') {
          let app = {...req.body.app, created_by: obj._id}
          const response = await Appointments.create(app);
          if (response) {
            res.json({ success: true, data: response });
          } else {
            res.json({success: false, message: 'failed mdb'})
          }
        } else {
          res.json({success: false, message: 'obj_t'})
        }
      }else {
        res.json({success: false, message: `mthd ${req.method}`})
      }
      
    }
    // switch (req.method) {
    //   case 'POST':
    //     console.log('req.body', req.body)
        
    //     break;
    
    //   default:
    //     console.log('method not allowed')
    //     break;
    // }
  } catch (error) {
    console.log('catch error appointment index: ', error)
  }
}