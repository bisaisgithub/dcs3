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
      const verified = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("verified.id:", verified);
      const obj = await CDCSUsers7.findOne({ _id: verified.id }, { type: 1 });
      if (obj.type === 'Admin' || obj.type === 'Receptionist') {
        if (req.method === 'GET') {
          const response = await Appointments.find(
            {
            // $or:[
            //   {
                status: {$in: ['Closed', 'Closed No Show', 'Closed w/ Balance']},
                // status: {$ne: 'Closed No Show'},
              // }]
            }
          )
          .populate("created_by", "name")
          .populate("patient_id", "name")
          .populate("doctor_id", "name")
          res.json({success: true, data: response})
        
        } 
        // else if(req.method === 'POST'){
        //     // console.log('req.body', req.body)
        //     if (req.body.data.filterType === 'getParent') {
        //       // console.log('filter')
        //       const response = await Appointments.find(
        //         {
        //           patient_id: req.body.data.patient_id,
        //           status: 'Next Appointment'
        //         }
        //       )
        //       // .populate("created_by", "name")
        //       .populate("patient_id", "name")
        //       .populate("doctor_id", "name")
        //       res.json({success: true, data: response})
        //     } else if(req.body.data.filterType === 'create'){
        //       let data = {...req.body.data, created_by: obj._id}
        //       const response = await Appointments.create(data);
        //       if (response) {
        //         res.json({ success: true, data: response });
        //       } else {
        //         res.json({success: false, message: 'failed mdb'})
        //       }
        //       res.json({success: true, data: 'create test'})
        //     }else {
              
        //       res.json({success: false, message: 'filterType_x'})
        //     }
        // }
        else {
          res.json({success: false, message: `mthd ${req.method}`})
        }
      } else {
        res.json({success: false, message: 'obj t nt a/r'})
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