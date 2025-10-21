const express = require("express");
const app = express();

app.use(express.json());

const vaccineRoutes = require("./modules/vaccines/vaccine.routes");
const usersRoutes = require("./modules/users/user.routes");
const vaccinationRoutes = require("./modules/vaccinations/vaccination.routes");

const vaccinationController = require("./modules/vaccinations/vaccination.controller");

app.get("/health", (req, res) => {
  res.status(200).json({ status: "API is working" });
});

app.use("/api/vaccines", vaccineRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/vaccinations", vaccinationRoutes);

app.get("/api/users/:id/card", vaccinationController.getUserCard);

module.exports = app;
