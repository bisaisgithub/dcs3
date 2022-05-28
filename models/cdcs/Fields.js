const mongoose = require("mongoose");

const CDCSFieldsSchema = new mongoose.Schema(
  {
    fields: {},
    modified_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
  },
  { timestamps: true }
);

let CDCSFields2;

try {
  CDCSFields2 = mongoose.model("CDCSFields2");
}catch(err){
  CDCSFields2 = mongoose.model('CDCSFields2', CDCSFieldsSchema);
}

module.exports = CDCSFields2;