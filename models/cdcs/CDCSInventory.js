const mongoose = require("mongoose");


const CDCSInventorySchema = new mongoose.Schema(
  {
    status: String,
    date_ordered: Date,
    date_received: Date,
    invoice_no: String,
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSSupplier'
    },
    items: [{}],
  },
  { timestamps: true }
);

let CDCSInventory;

try {
  CDCSInventory = mongoose.model("CDCSInventory");
}catch(err){
  CDCSInventory = mongoose.model('CDCSInventory', CDCSInventorySchema);
}

module.exports =
  // mongoose.models.CDCSInventory || mongoose.model("CDCSInventory", CDCSInventorySchema);
  CDCSInventory;