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
    age: {
      type: Number,
      required: false,
      min: [0, "Age cannot be negative."],
    },
    gender: {
      type: String,
      required: false,
      enum: {
        values: ["Male", "Female", "Other", "Not informed"],
        message: "{VALUE} is not a valid gender.",
      },
      default: "Not informed",
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
