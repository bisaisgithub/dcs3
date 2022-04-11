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
      required: [true, "Please add a name"],
      maxlength: [40, "Title cannot be more than 40 characters"],
    },
    password: {
      type: String,
      required: [true, "Please add a name"],
    },
    type: String,
    dob: Date,
    allergen: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'CDCSUsers6'
    },
  },
  { timestamps: true }
);

let CDCSUsers6;

try {
  CDCSUsers6 = mongoose.model("CDCSUsers6");
}catch(err){
  CDCSUsers6 = mongoose.model('CDCSUsers6', CDCSUsersSchema);
}

module.exports =
  // mongoose.models.CDCSUsers6 || mongoose.model("CDCSUsers6", CDCSUsersSchema);
  CDCSUsers6;
