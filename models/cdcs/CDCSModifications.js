const mongoose = require("mongoose");


const CDCSModificationsSchema = new mongoose.Schema(
  {
    type: String,
    modified_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    old: {},
    new: {},
  },
  { timestamps: true }
);

let CDCSModifications;

try {
  CDCSModifications = mongoose.model("CDCSModifications");
}catch(err){
  CDCSModifications = mongoose.model('CDCSModifications', CDCSModificationsSchema);
}

module.exports =
  // mongoose.models.CDCSModifications || mongoose.model("CDCSModifications", CDCSModificationsSchema);
  CDCSModifications;
