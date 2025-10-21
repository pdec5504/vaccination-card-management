const express = require("express");
const router = express.Router();
const controller = require("./vaccine.controller");

// /api/vaccines
router.route("/").post(controller.registerVaccine).get(controller.getVaccines);

// /api/vaccines/id
router.route("/:id").get(controller.getVaccineById);

module.exports = router;
