const Vaccination = require("./vaccination.model");
const User = require("../users/user.model");
const Vaccine = require("../vaccines/vaccine.model");
const { v4: uuidv4 } = require("uuid");
const { application } = require("express");

// Register new vaccination
const registerVaccination = async (req, res) => {
  try {
    const { userId, vaccineId, dose } = req.body;

    if (!userId || !vaccineId || !dose) {
      return res
        .status(400)
        .json({ message: "userId, vaccineId and dose are mandatory." });
    }

    // Validation
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Failed to registering vaccination.",
      });
    }

    const vaccine = await Vaccine.findOne({ id: vaccineId });
    if (!vaccine) {
      return res.status(404).json({
        message: "Vaccine not found. Failed to registering vaccination.",
      });
    }

    const newVaccination = new Vaccination({
      id: uuidv4(),
      userId,
      vaccineId,
      dose,
      applicationDate: new Date(),
    });

    await newVaccination.save();
    res.status(201).json(newVaccination);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.message });
    }
    res.status(500).json({
      message: "Error registering vaccination.",
      error: error.message,
    });
  }
};

// Get user's vaccination card
const getUserCard = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const vaccinations = await Vaccination.find({ userId: userId });

    const viewCard = [];
    for (const vaccination of vaccinations) {
      const vaccineInfo = await Vaccine.findOne({ id: vaccination.vaccineId });
      viewCard.push({
        vaccinationId: vaccination.id,
        vaccineName: vaccineInfo ? vaccineInfo.name : "Unknown vaccine",
        dose: vaccination.dose,
        applicationDate: vaccination.applicationDate,
      });
    }

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
      },
      card: viewCard,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user card.", error: error.message });
  }
};

// Delete vaccination register
const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVaccination = await Vaccination.findOneAndDelete({ id: id });

    if (!deletedVaccination) {
      return res
        .status(404)
        .json({ message: "Vaccination register not found." });
    }

    res
      .status(200)
      .json({ message: "Vaccination register succesfully deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting register.", error: error.message });
  }
};

module.exports = { registerVaccination, getUserCard, deleteVaccination };
