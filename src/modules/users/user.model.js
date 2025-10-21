const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "User name is mandatory."],
      trim: true,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
