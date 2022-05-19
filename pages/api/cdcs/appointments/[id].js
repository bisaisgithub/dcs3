import Appointments from '../../../../models/cdcs/appointments';

export default async (req, res) => {
  try {
    // console.log('id: ', req.query)
    const response = await Appointments.findOne({_id: req.query.id})
    .select('-doctor_id')
    .populate("patient_id", "name")
    // const response = await Appointments.find();
    res.json({ sucess: true, data: response});
  } catch (error) {
    console.log('catch error appointment details', error);
    res.json({success: false, message: 'check admin error'})
  }
  
}