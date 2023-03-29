const express = require("express");
const router = express.Router();
const { getDoctors } = require("../controllers/calendary/doctors");

router.get("/test", (req, res) => {
  res.send("Calendary test.");
});

// status --> 0 = available, 1 = booked, 2 = unavailable
router.get("/doctor/available-time-slots", getAvailableTimeSlots);

module.exports = router;
