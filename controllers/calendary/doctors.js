const db = require("../../models/db");
const { getTimeSlots, getDaysInMonth } = require("../calendary/utility");

// status --> 0 = available, 1 = booked, 2 = unavailable
getAvailableTimeSlots = (req, res) => {
  if (!req.query.doctor_id || !req.query.month) {
    res.status(400).send("Doctor ID is required");
  } else {
    db.query(
      `SELECT * FROM TIME_SLOTS WHERE doctor_id=${req.query.doctor_id} and month=${req.query.month} and year=${req.query.year}`,
      (err, result) => {
        if (err) {
          res.send(err, 500);
          console.log(err);
        }
        if (result) {
          let days = getDaysInMonth(req.query.year, req.query.month);
          let day = 1;
          let timeSlots = getTimeSlots();
          let tempData = [];
          if (result.length === 0) {
            while (day <= days) {
              timeSlots.forEach((timeSlot) => {
                tempData.push({
                  timeSlot,
                  status: 0,
                  day,
                  month: req.query.month,
                  year: req.query.year,
                });
              });
              day++;
            }
            res.status(200).send(tempData);
          } else {
            while (day <= days) {
              timeSlots.forEach((timeSlot) => {
                let found = false;
                result.forEach((item) => {
                  if (item.day === day && item.slot_name === timeSlot) {
                    found = true;
                    tempData.push({
                      timeSlot,
                      status: item.status,
                      day,
                      month: req.query.month,
                      year: req.query.year,
                    });
                  }
                });
                if (!found) {
                  tempData.push({
                    timeSlot,
                    status: 0,
                    day,
                    month: req.query.month,
                    year: req.query.year,
                  });
                }
              });
              day++;
            }
            res.status(200).send(tempData);
          }
        }
      }
    );
  }
};

module.exports = {
  getAvailableTimeSlots,
};
