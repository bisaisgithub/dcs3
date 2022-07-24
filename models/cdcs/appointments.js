const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema(
  {
    // created_by: {
    //   type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    // },
    // updated_by: {
    //   type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    // },
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
    notes:[{}],
    exams: [{}],
    histories: [{
      createdUpdated_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
      },
      fieldsUpdated: []
    }],
    app_pay_fields: [{}],
    inventories: [{}],
    parent_appointments: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSAppoinments'
    }
  },
  { timestamps: true }
);

let Appointments;

try {
  Appointments = mongoose.model("CDCSAppoinments");
}catch(err){
  Appointments = mongoose.model('CDCSAppoinments', AppointmentSchema);
}

module.exports =
  // mongoose.models.Appointments || mongoose.model("Appointments", AppointmentSchema);
  Appointments;
