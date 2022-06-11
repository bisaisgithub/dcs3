const mongoose = require("mongoose");


const CDCSInventorySchema = new mongoose.Schema(
  {
    supplier: String,
    invoice: String,
    date: Date,
    type: String,
    items: [],
    deduct_id: []
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