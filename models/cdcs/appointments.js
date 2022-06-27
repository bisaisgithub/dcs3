const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    patient_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    date: Date,
    type: String,
    status: String,
    proc_fields: [{}],
    parent_appointments: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointments'
    },
    child_appointments: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointments'
    }],
    inventories: [{name: String, code: String, qty: Number}],
    app_pay_fields: [{}],
    notes:[{}],
    patient_request: {},
    patient_exam: [{}]
  },
  { timestamps: true }
);

let Appointments;

try {
  Appointments = mongoose.model("Appointments2");
}catch(err){
  Appointments = mongoose.model('Appointments2', AppointmentSchema);
}

module.exports =
  // mongoose.models.Appointments || mongoose.model("Appointments", AppointmentSchema);
  Appointments;
