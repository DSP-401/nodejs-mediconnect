const db = require("../../models/db");
const { getTimeSlots, getDaysInMonth } = require("../calendary/utility");

// status --> 0 = available, 1 = booked, 2 = unavailable
const getAvailableTimeSlots = (req, res) => {
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

const setTimeSlots = (req, res) => {
  if (!req.body.doctor_id || !req.body.month) {
    res.status(400).send("Incomplete data");
  } else {
    db.query(
      `SELECT * FROM TIME_SLOTS WHERE doctor_id=${req.body.doctor_id} and month=${req.body.month} and day=${req.body.day} and year=${req.body.year} and slot_name="${req.body.slot}"`,
      (err, result) => {
        if (err) {
          res.send(err, 500);
          console.log(err);
        }
        if (result && result.length > 0) {
          res.status(400).send("Booking already exists");
        } else {
          db.query(
            `INSERT INTO TIME_SLOTS (doctor_id, patient_id, month, year, day, slot_name, status) VALUES (${req.body.doctor_id},${req.body.patient_id}, ${req.body.month}, ${req.body.year}, ${req.body.day}, "${req.body.slot}", ${req.body.status})`,
            (err, result) => {
              if (err) {
                res.status(500).send(err);
                console.log(err);
              }
              if (result) {
                res.status(200).send("Booking created successfully");
              }
            }
          );
        }
      }
    );
  }
};

const updateTimeSlots = (req, res) => {
  if (
    !req.body.doctor_id ||
    !req.body.month ||
    !req.body.day ||
    !req.body.slot
  ) {
    res.status(400).send("Incomplete data");
  } else {
    if (req.body.status === 0) {
      db.query(
        `DELETE FROM TIME_SLOTS WHERE doctor_id=${req.body.doctor_id} and month=${req.body.month} and day=${req.body.day} and year=${req.body.year} and slot_name="${req.body.slot}"`,
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          if (result) {
            res.status(200).send("Booking deleted successfully");
          }
        }
      );
    } else {
      db.query(
        `UPDATE TIME_SLOTS SET status=${req.body.status} WHERE doctor_id=${req.body.doctor_id} and month=${req.body.month} and day=${req.body.day} and year=${req.body.year} and slot_name="${req.body.slot}"`,
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          if (result) {
            res.status(200).send("Booking updated successfully");
          }
        }
      );
    }
  }
};

module.exports = {
  getAvailableTimeSlots,
  setTimeSlots,
  updateTimeSlots,
};
