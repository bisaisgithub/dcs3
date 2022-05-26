const mongoose = require("mongoose");


const AMCSUsersSchema = new mongoose.Schema(
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
      required: [true, "Please add a password"],
    },
    type: String,
    dob: Date,
    // allergen: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId, ref: 'AMCSUsers'
    },
    mobile: String,
    gender: String,
    status: String,
    guardian: String,
  },
  { timestamps: true }
);

let AMCSUsers;

try {
  AMCSUsers = mongoose.model("AMCSUsers");
}catch(err){
  AMCSUsers = mongoose.model('AMCSUsers', AMCSUsersSchema);
}

module.exports =
  // mongoose.models.AMCSUsers || mongoose.model("AMCSUsers", AMCSUsersSchema);
  AMCSUsers;
