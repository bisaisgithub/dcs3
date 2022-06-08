const mongoose = require("mongoose");

const AMCSEmailCodeSchema = new mongoose.Schema(
  {
    email: String,
    code: String,
    generated_times: Number
  },
  { timestamps: true }
);

let AMCSEmailCode;

try {
  AMCSEmailCode = mongoose.model("AMCSEmailCode");
}catch(err){
  AMCSEmailCode = mongoose.model('AMCSEmailCode', AMCSEmailCodeSchema);
}

module.exports =
  // mongoose.models.AMCSEmailCode || mongoose.model("AMCSEmailCode", AMCSEmailCodeSchema);
  AMCSEmailCode;