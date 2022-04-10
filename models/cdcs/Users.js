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
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.CDCSUsers5 || mongoose.model("CDCSUsers5", CDCSUsersSchema);
