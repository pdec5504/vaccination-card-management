const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Vaccination = require("./vaccination.model"); //
const User = require("../users/user.model"); //
const Vaccine = require("../vaccines/vaccine.model"); //
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const dbNameTest = process.env.DB_NAME_TEST;
if (
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !dbNameTest
) {
  throw new Error("Missing test database environment variables in .env!");
}
const MONGO_URI_TEST = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbNameTest}?authSource=admin`;

let createdUser;
let createdVaccineBCG;
let createdVaccineCovid;

beforeAll(async () => {
  try {
    process.env.NODE_ENV = "test";
    await mongoose.connect(MONGO_URI_TEST);
    console.log("[vaccination.test.js] Connected to test database.");

    createdUser = await User.create({ id: uuidv4(), name: "Test User" });
    createdVaccineBCG = await Vaccine.create({
      id: uuidv4(),
      name: "BCG",
      totalDoses: 1,
    });
    createdVaccineCovid = await Vaccine.create({
      id: uuidv4(),
      name: "COVID-19",
      totalDoses: 2,
    });
  } catch (error) {
    console.error(
      "[vaccination.test.js] Connection or setup failed:",
      error.message
    );
    throw error;
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
    await Vaccine.deleteMany({});
    await Vaccination.deleteMany({});

    createdUser = await User.create({ id: uuidv4(), name: "Test User" });
    createdVaccineBCG = await Vaccine.create({
      id: uuidv4(),
      name: "BCG",
      totalDoses: 1,
    });
    createdVaccineCovid = await Vaccine.create({
      id: uuidv4(),
      name: "COVID-19",
      totalDoses: 2,
    });
  } catch (error) {
    console.error("Error during beforeEach setup/cleanup:", error);
    throw error;
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await Vaccine.deleteMany({});
  await Vaccination.deleteMany({});
  await mongoose.disconnect();
  console.log("[vaccination.test.js] Disconnected from test database.");
});

describe("API - Vaccinations Module (/api/vaccinations & /api/users/:id/card)", () => {
  //

  it("Should register a new vaccination successfully (POST)", async () => {
    const newVaccinationData = {
      userId: createdUser.id,
      vaccineId: createdVaccineBCG.id,
      dose: "Single Dose", //
    };
    const response = await request(app)
      .post("/api/vaccinations") //
      .send(newVaccinationData);

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe(createdUser.id);
    expect(response.body.vaccineId).toBe(createdVaccineBCG.id);
  });

  it("Should return 404 if user does not exist when registering vaccination (POST)", async () => {
    const nonExistentUserId = uuidv4();
    const vaccinationData = {
      userId: nonExistentUserId,
      vaccineId: createdVaccineBCG.id,
      dose: "Single Dose",
    };
    const response = await request(app)
      .post("/api/vaccinations") //
      .send(vaccinationData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "User not found. Failed to registering vaccination."
    ); //
  });

  it("Should return 404 if vaccine does not exist when registering vaccination (POST)", async () => {
    const nonExistentVaccineId = uuidv4();
    const vaccinationData = {
      userId: createdUser.id,
      vaccineId: nonExistentVaccineId,
      dose: "Single Dose",
    };
    const response = await request(app)
      .post("/api/vaccinations") //
      .send(vaccinationData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "Vaccine not found. Failed to registering vaccination."
    ); //
  });

  it("Should return 400 if dose is invalid when registering vaccination (POST)", async () => {
    const vaccinationData = {
      userId: createdUser.id,
      vaccineId: createdVaccineBCG.id,
      dose: "INVALID DOSE",
    };
    const response = await request(app)
      .post("/api/vaccinations") //
      .send(vaccinationData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation error"); //
  });

  it("Should return the user's vaccination card (GET /users/:id/card)", async () => {
    await Vaccination.create({
      id: uuidv4(),
      userId: createdUser.id,
      vaccineId: createdVaccineBCG.id,
      dose: "Single Dose",
    });
    await Vaccination.create({
      id: uuidv4(),
      userId: createdUser.id,
      vaccineId: createdVaccineCovid.id,
      dose: "1st Dose",
    });

    const response = await request(app).get(
      `/api/users/${createdUser.id}/card`
    ); //

    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(createdUser.id);
    expect(response.body.card).toBeInstanceOf(Array);
    expect(response.body.card.length).toBe(2);
    const cardVaccineNames = response.body.card.map((v) => v.vaccineName);
    expect(cardVaccineNames).toContain("BCG");
    expect(cardVaccineNames).toContain("COVID-19");
  });

  it("Should return 404 when getting card for non-existent user (GET /users/:id/card)", async () => {
    const nonExistentUserId = uuidv4();
    const response = await request(app).get(
      `/api/users/${nonExistentUserId}/card`
    ); //

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found."); //
  });

  it("Should delete a specific vaccination record (DELETE /vaccinations/:id)", async () => {
    const vaccination = await Vaccination.create({
      id: uuidv4(),
      userId: createdUser.id,
      vaccineId: createdVaccineBCG.id,
      dose: "Single Dose",
    });

    const response = await request(app).delete(
      `/api/vaccinations/${vaccination.id}`
    ); //

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Vaccination register succesfully deleted."
    ); //

    const deletedRecord = await Vaccination.findOne({ id: vaccination.id });
    expect(deletedRecord).toBeNull();
  });

  it("Should return 404 when trying to delete non-existent vaccination record (DELETE /vaccinations/:id)", async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).delete(
      `/api/vaccinations/${nonExistentId}`
    ); //

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Vaccination register not found."); //
  });

  it("Should return 404 when trying to get card after user deletion", async () => {
    await Vaccination.create({
      id: uuidv4(),
      userId: createdUser.id,
      vaccineId: createdVaccineBCG.id,
      dose: "Single Dose",
    });

    await request(app).delete(`/api/users/${createdUser.id}`); //

    const response = await request(app).get(
      `/api/users/${createdUser.id}/card`
    ); //

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found."); //
  });
});
