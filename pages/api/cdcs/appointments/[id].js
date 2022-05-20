import Appointments from '../../../../models/cdcs/appointments';

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
      if (obj.type === 'Admin' || obj.type === 'Receptionist') {
        // console.log('id: ', req.query)
        const response = await Appointments.findOne({_id: req.query.id})
        .select('-doctor_id')
        .populate("patient_id", "name")
        // const response = await Appointments.find();
        res.json({ sucess: true, data: response});
      }else {
          res.json({success: false, message: 'obj t nt a/r'})
        }
    }
    
  } catch (error) {
    console.log('catch error appointment details', error);
    res.json({success: false, message: 'check admin error'})
  }
  
}