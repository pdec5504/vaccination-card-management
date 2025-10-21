const express = require("express");
const router = express.Router();
const controller = require("./vaccination.controller");

router.route("/").post(controller.registerVaccination);

router.route("/:id").delete(controller.deleteVaccination);

module.exports = router;
