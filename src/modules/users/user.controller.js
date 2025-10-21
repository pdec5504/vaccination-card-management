const User = require("./user.model");
const Vaccination = require("../vaccinations/vaccination.model");
const { v4: uuidv4 } = require("uuid");

// Register new user
const registerUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is mandatory." });
    }

    const newUser = new User({
      id: uuidv4(),
      name,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user.", error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}, "-_id -__v");
    res.status(200).json(allUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting users.", error: error.message });
  }
};

// Get user by Id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id: id }, "-_id -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found. " });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user.", error: error.message });
  }
};

// Remove a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findOneAndDelete({ id: id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    await Vaccination.deleteMany({ userId: id });
    res.status(200).json({ message: "User and vaccination card removed." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user.", error: error.message });
  }
};

module.exports = { registerUser, getUsers, getUserById, deleteUser };
