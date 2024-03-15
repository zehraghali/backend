const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Event = require("../models/eventModel");

const events = [
  {
    title: "Sample title",
    description: "Sample description",
    date: new Date("2024-03-07T16:02:31.405Z"),
    location: false,
  },
  {
    title: "Another sample title",
    description: "Another sample description",
    date: new Date("2024-03-08T16:02:31.405Z"),
    location: true,
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/users/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("Given there are initially some events saved", () => {
  beforeEach(async () => {
    await Event.deleteMany({});
    await api
      .post("/api/events")
      .set("Authorization", "bearer " + token)
      .send(events[0])
      .expect(201);
    await api
      .post("/api/events")
      .set("Authorization", "bearer " + token)
      .send(events[1])
      .expect(201);
  });

  it("should return all events as JSON when GET /api/events is called", async () => {
    await api
      .get("/api/events")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one event when POST /api/events is called", async () => {
    const newEvent = {
      title: "New event title",
      description: "New event description",
      date: new Date(),
      location: true,
    };
    await api
      .post("/api/events")
      .set("Authorization", "bearer " + token)
      .send(newEvent)
      .expect(201);
  });
  
  it("should return one event by ID when GET /api/events/:id is called", async () =>  {
    const event = await Event.findOne();
    await api
      .get("/api/events/" + event._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one event by ID when PUT /api/events/:id is called", async () => {
    const event = await Event.findOne();
    const updatedEvent = {
      title: "Updated event title",
      description: "Updated event description",
      date: new Date(),
      location: false,
    };
    await api
      .put("/api/events/" + event._id)
      .set("Authorization", "bearer " + token)
      .send(updatedEvent)
      .expect(200);
    const updatedEventCheck = await Event.findById(event._id);
    expect(updatedEventCheck.toJSON()).toEqual(expect.objectContaining(updatedEvent));
  });

  it("should delete one event by ID when DELETE /api/events/:id is called", async () => {
    const event = await Event.findOne();
    await api
      .delete("/api/events/" + event._id)
      .set("Authorization", "bearer " + token)
      .expect(200);
    const eventCheck = await Event.findById(event._id);
    expect(eventCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
