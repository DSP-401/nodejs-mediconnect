const express = require("express");
const router = express.Router();
const {
  getAvailableTimeSlots,
  setTimeSlots,
  updateTimeSlots,
} = require("../controllers/calendary/doctors");
const { getBookingSlots } = require("../controllers/calendary/patients");

router.get("/test", (req, res) => {
  res.send("Calendary test.");
});

// status --> 0 = available, 1 = booked, 2 = unavailable
router.get("/doctor/available-time-slots", getAvailableTimeSlots);
router.post("/doctor/create", setTimeSlots);
router.put("/doctor/update", updateTimeSlots);

router.get("/patient/bookings", getBookingSlots);

module.exports = router;
