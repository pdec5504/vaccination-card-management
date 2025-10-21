const mongoose = require("mongoose");
const { Schema } = mongoose;

const vaccinationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    vaccineId: {
      type: String,
      required: true,
      index: true,
    },
    dose: {
      type: String,
      required: true,
      enum: [
        "1st Dose",
        "2nd Dose",
        "3rd Dose",
        "Single Dose",
        "Reinforcement Dose",
      ],
    },
    applicationDate: {
      type: Date,
      default: Date.now,
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

const Vaccination = mongoose.model("Vaccination", vaccinationSchema);
module.exports = Vaccination;
