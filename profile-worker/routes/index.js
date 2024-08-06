const express = require("express");
const workerController = require("../controllers/workerController");

const router = express.Router();

router.post("/", workerController.generateProfile);

module.exports = router;
