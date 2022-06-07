const mongoose = require("mongoose");


const AMCSModificationsSchema = new mongoose.Schema(
  {
    type: String,
    modified_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'AMCSUsers'
    },
    old: {},
    new: {},
  },
  { timestamps: true }
);

let AMCSModifications;

try {
  AMCSModifications = mongoose.model("AMCSModifications");
}catch(err){
  AMCSModifications = mongoose.model('AMCSModifications', AMCSModificationsSchema);
}

module.exports =
  // mongoose.models.AMCSModifications || mongoose.model("AMCSModifications", AMCSModificationsSchema);
  AMCSModifications;
