const express = require("express");
const workerController = require("../../controllers/workerController");
const router = require("../../routes/index");

// Mock the express.Router() function
jest.mock("express", () => ({
  Router: jest.fn(() => ({
    post: jest.fn(),
  })),
}));

// Mock the workerController
jest.mock("../../controllers/workerController", () => ({
  generateProfile: jest.fn(),
}));

describe("Worker Router", () => {
  it("should set up POST route for /generateProfile", () => {
    // Check if the router.post method was called with the correct arguments
    expect(router.post).toHaveBeenCalledWith(
      "/",
      workerController.generateProfile
    );
  });

  it("should export the router", () => {
    expect(router).toBeDefined();
  });
});
