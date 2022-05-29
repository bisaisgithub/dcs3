import Appointments from '../../../../models/cdcs/appointments';
import CDCSModifications from "../../../../models/cdcs/CDCSModifications";
import { getCookie, removeCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import CDCSUsers7 from "../../../../models/cdcs/Users";
import dbConnect from '../../../../utils/dbConnect';

export default async (req, res) => {
  try {
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
          // console.log('id: ', req.query)
          const response = await Appointments.findOne({_id: 
            req.query.id
            // '6256b7af49b7867a85bc47d7'
          })
          // .select('-doctor_id')
          .populate("patient_id", "name")
          .populate("doctor_id", "name");
          // console.log('get appointment response', response);
          // const response = await Appointments.find();
          if (response) {
            // console.log('not empty')
            const response2 = await Appointments.find({parent_appointments: 
              req.query.id
              // '6256b7af49b7867a85bc47d7'
            })
            .populate("patient_id", "name")
            .populate("doctor_id", "name");
            // console.log('response2', response2)
            res.json({ success: true, data: response, childAppointments: response2});
          } else {
            // console.log('empty')
            res.json({ success: true, data: response, childAppointments: []});
          }
          
        } else if (req.method === 'POST') {
          // console.log('req.body.new: ', req.body)

          const appointmentUpdate = await Appointments.updateOne(
            {_id: req.query.id}, req.body.new
          );
          const userModification = await CDCSModifications.create({
            new: req.body.new, old: req.body.old, type: 'AppointmentModification', modified_by: obj._id
          });
          
          // console.log('user:', user);
          // const username = await CDCSUsers7.findOne({_id: })
          res.json({ success: true, data: 'appointmentUpdate' });
        }else {
          
        }
        
      }else {
          res.json({success: false, message: 'obj t nt a/r'})
        }
    }
    
  } catch (error) {
    console.log('catch error appointment details', error);
    res.json({success: false, message: 'catch appointment [id] error'})
  }
  
}