const express = require("express");
const router = express.Router();
const controller = require("./user.controller");

router.route("/").post(controller.registerUser).get(controller.getUsers);

router
  .route("/:id")
  .get(controller.getUserById)
  .delete(controller.deleteUser)
  .put(controller.updateUser);

module.exports = router;
