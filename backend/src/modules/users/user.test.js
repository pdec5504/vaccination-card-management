const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("./user.model");
const Vaccination = require("../vaccinations/vaccination.model");
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
  throw new Error("Missing test database environment variables in .env file.");
}
const MONGO_URI_TEST = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbNameTest}?authSource=admin`;

beforeAll(async () => {
  try {
    process.env.NODE_ENV = "test";
    await mongoose.connect(MONGO_URI_TEST);
    console.log("[user.test.js] Connected to test database.");
  } catch (error) {
    console.error("[user.test.js] Connection failed:", error.message);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
    await Vaccination.deleteMany({});
  } catch (error) {
    console.error("Error during beforeEach cleanup:", error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  console.log("[user.test.js] Disconnected from test database.");
});

describe("API - Users Module (/api/users)", () => {
  //

  it("Should create a new user successfully (POST)", async () => {
    const newUserData = {
      name: "Ana Silva",
      age: 30,
      gender: "Female",
    };
    const response = await request(app).post("/api/users").send(newUserData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Ana Silva");
    expect(response.body.age).toBe(30);
    expect(response.body.gender).toBe("Female");

    const userInDB = await User.findOne({ name: "Ana Silva" });
    expect(userInDB).not.toBeNull();
  });

  it("Should not create a user without a name (POST)", async () => {
    const invalidUserData = { age: 25 };
    const response = await request(app)
      .post("/api/users")
      .send(invalidUserData);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Name is mandatory.");
  });

  it("Should return a list of users (GET)", async () => {
    await User.create({ id: uuidv4(), name: "Carlos Pereira" });
    await User.create({ id: uuidv4(), name: "Beatriz Costa" });

    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
  });

  it("Should return a specific user by ID (GET /:id)", async () => {
    const user = await User.create({ id: uuidv4(), name: "Ricardo Dias" });

    const response = await request(app).get(`/api/users/${user.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Ricardo Dias");
    expect(response.body.id).toBe(user.id);
  });

  it("Should return 404 if user ID does not exist (GET /:id)", async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).get(`/api/users/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found. ");
  });

  it("Should delete a user and their vaccinations (DELETE /:id)", async () => {
    const user = await User.create({
      id: uuidv4(),
      name: "Usuario Para Deletar",
    });
    await Vaccination.create({
      id: uuidv4(),
      userId: user.id,
      vaccineId: "some-vaccine-id",
      dose: "1st Dose",
    });

    let vaccinations = await Vaccination.find({ userId: user.id });
    expect(vaccinations.length).toBe(1);

    const response = await request(app).delete(`/api/users/${user.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User and vaccination card removed.");

    const userInDB = await User.findOne({ id: user.id });
    expect(userInDB).toBeNull();

    vaccinations = await Vaccination.find({ userId: user.id });
    expect(vaccinations.length).toBe(0);
  });

  it("Should return 404 when trying to delete a non-existent user (DELETE /:id)", async () => {
    const nonExistentId = uuidv4();
    const response = await request(app).delete(`/api/users/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found.");
  });
});
