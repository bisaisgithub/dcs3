const mongoose = require("mongoose");

const CDCSEmailCodeSchema = new mongoose.Schema(
  {
    email: String,
    code: String,
    generated_times: Number
  },
  { timestamps: true }
);

let CDCSEmailCode;

try {
  CDCSEmailCode = mongoose.model("CDCSEmailCode2");
}catch(err){
  CDCSEmailCode = mongoose.model('CDCSEmailCode2', CDCSEmailCodeSchema);
}

module.exports =
  // mongoose.models.CDCSEmailCode || mongoose.model("CDCSEmailCode", CDCSEmailCodeSchema);
  CDCSEmailCode;