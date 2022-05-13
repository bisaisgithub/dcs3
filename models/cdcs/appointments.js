const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    date: Date,
    type: String,
    status: String,
    proc_fields: Object,
    parent_appointments: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointments'
    },
    child_appointments: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Appointments'
    }],
    inventories: [{name: String, code: String, qty: Number}],
    app_pay_fields: [{}],
  },
  { timestamps: true }
);

let Appointments;

try {
  Appointments = mongoose.model("Appointments");
}catch(err){
  Appointments = mongoose.model('Appointments', AppointmentSchema);
}

module.exports =
  // mongoose.models.Appointments || mongoose.model("Appointments", AppointmentSchema);
  Appointments;
