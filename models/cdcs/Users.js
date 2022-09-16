const mongoose = require("mongoose");


const CDCSUsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Please add a name"],
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    type: String,
    dob: Date,
    allergen: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers7'
    },
    mobile: String,
    gender: String,
    status: String,
  },
  { timestamps: true }
);

let CDCSUsers7;

try {
  CDCSUsers7 = mongoose.model("CDCSUsers7");
}catch(err){
  CDCSUsers7 = mongoose.model('CDCSUsers7', CDCSUsersSchema);
}

module.exports =
  CDCSUsers7;
