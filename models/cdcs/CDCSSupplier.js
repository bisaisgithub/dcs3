const mongoose = require("mongoose");


const CDCSSupplierSchema = new mongoose.Schema(
  {
    name: String,
    contact: String,
    address: String,
    status: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
  },
  { timestamps: true }
);

let CDCSSupplier;

try {
  CDCSSupplier = mongoose.model("CDCSSupplier");
}catch(err){
  CDCSSupplier = mongoose.model('CDCSSupplier', CDCSSupplierSchema);
}

module.exports =
  // mongoose.models.CDCSSupplier || mongoose.model("CDCSSupplier", CDCSSupplierSchema);
  CDCSSupplier;