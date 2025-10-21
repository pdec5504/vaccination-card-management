const mongoose = require("mongoose");
const { Schema } = mongoose;

const vaccineSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Vaccine name is mandatory."],
      trim: true,
    },
    totalDoses: {
      type: Number,
      default: 1,
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

const Vaccine = mongoose.model("Vaccine", vaccineSchema);
module.exports = Vaccine;
