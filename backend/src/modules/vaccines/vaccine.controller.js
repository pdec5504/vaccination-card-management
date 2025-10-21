const Vaccine = require("./vaccine.model");
const { v4: uuidv4 } = require("uuid");

// Register new vaccine
const registerVaccine = async (req, res) => {
  try {
    const { name, totalDoses } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is mandatory." });
    }

    const newId = uuidv4();
    const newVaccine = new Vaccine({
      id: newId,
      name,
      totalDoses,
    });

    await newVaccine.save();

    res.status(201).json(newVaccine);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicated error" });
    }
    res
      .status(500)
      .json({ message: "Error registering vaccine.", erro: error.message });
  }
};

// Get all vaccines
const getVaccines = async (req, res) => {
  try {
    const allVaccines = await Vaccine.find({}, "-_id -__v");
    res.status(200).json(allVaccines);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting vaccines.", error: error.message });
  }
};

// Get vaccine by id
const getVaccineById = async (req, res) => {
  try {
    const { id } = req.params;
    const vaccine = await Vaccine.findOne({ id: id }, "-_id -__v");

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found." });
    }
    res.status(200).json(vaccine);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting vaccine.", error: error.message });
  }
};

module.exports = { registerVaccine, getVaccines, getVaccineById };
