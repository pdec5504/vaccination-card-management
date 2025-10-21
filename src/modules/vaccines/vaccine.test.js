const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Vaccine = require("./vaccine.model");
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

beforeAll(async () => {
  try {
    process.env.NODE_ENV = "test";
    await mongoose.connect(MONGO_URI_TEST);
    console.log("[vaccine.test.js] Connected to test database.");
  } catch (error) {
    console.error("[vaccine.test.js] Connection failed:", error.message);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await Vaccine.deleteMany({});
  } catch (error) {
    console.error("Error during beforeEach cleanup:", error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("[vaccine.test.js] Disconnected from test database.");
});

describe("API - Vaccines Module (/api/vaccines)", () => {
  //

  it("Should create a new vaccine successfully (POST)", async () => {
    const newVaccineData = {
      name: "COVID-19", //
      totalDoses: 3, //
    };
    const response = await request(app)
      .post("/api/vaccines") //
      .send(newVaccineData);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("COVID-19");
    expect(response.body.totalDoses).toBe(3);
    const vaccineInDB = await Vaccine.findOne({ name: "COVID-19" });
    expect(vaccineInDB).not.toBeNull();
    expect(vaccineInDB.totalDoses).toBe(3);
  });

  it("Should not create a vaccine without a name (POST)", async () => {
    const invalidVaccineData = {
      totalDoses: 2,
    };
    const response = await request(app)
      .post("/api/vaccines") //
      .send(invalidVaccineData);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Name is mandatory."); //
  });

  it("Should return a list (array) of vaccines (GET)", async () => {
    await Vaccine.create({ id: uuidv4(), name: "Hepatite B", totalDoses: 1 });
    const response = await request(app).get("/api/vaccines"); //
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe("Hepatite B");
  });

  it("Should return a specific vaccine by ID (GET /:id)", async () => {
    const testId = uuidv4();
    await Vaccine.create({ id: testId, name: "Gripe", totalDoses: 1 });
    const response = await request(app).get(`/api/vaccines/${testId}`); //
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Gripe");
    expect(response.body.id).toBe(testId);
  });

  it("Should return 404 if the vaccine ID does not exist (GET /:id)", async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).get(`/api/vaccines/${nonExistentId}`); //
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Vaccine not found."); //
  });
});
