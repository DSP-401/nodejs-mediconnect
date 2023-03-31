const db = require("../../models/db");
const {
  getTimeSlots,
  getDaysInMonth,
  sendMessage,
} = require("../calendary/utility");

// status --> 0 = available, 1 = booked, 2 = unavailable
const getAvailableTimeSlots = (req, res) => {
  if (!req.query.doctor_id || !req.query.month) {
    res.status(400).send("Doctor ID is required");
  } else {
    db.query(
      `SELECT * FROM TIME_SLOTS WHERE doctor_id=${
        req.query.doctor_id
      } and month=${parseInt(req.query.month) + 1} and day=${
        req.query.day
      } and year=${req.query.year}`,
      (err, result) => {
        if (err) {
          // res.send(err, 500);
          console.log(err);
          sendMessage(res, err, 500);
        }
        if (result) {
          // let days = getDaysInMonth(req.query.year, req.query.month+1);
          let day = 1;
          let timeSlots = getTimeSlots();
          let tempData = [];
          if (result.length === 0) {
            // while (day <= days) {
            timeSlots.forEach((timeSlot) => {
              tempData.push({
                timeSlot,
                status: 0,
                day,
                month: parseInt(req.query.month),
                year: req.query.year,
              });
            });
            // day++;
            // }
            sendMessage(res, tempData, 200);
          } else {
            // while (day <= days) {
            timeSlots.forEach((timeSlot) => {
              let found = false;
              result.forEach((item) => {
                if (item.day === day && item.slot_name === timeSlot) {
                  found = true;
                  tempData.push({
                    timeSlot,
                    status: item.status,
                    day,
                    month: parseInt(req.query.month),
                    year: req.query.year,
                  });
                }
              });
              if (!found) {
                tempData.push({
                  timeSlot,
                  status: 0,
                  day,
                  month: parseInt(req.query.month),
                  year: req.query.year,
                });
              }
            });
            //   day++;
            // }
            sendMessage(res, tempData, 200);
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
          // res.send(err, 500);
          console.log(err);
          sendMessage(res, err, 500);
        }
        if (result && result.length > 0) {
          // res.status(400).send("Booking already exists");
          sendMessage(res, "Booking already exists", 400);
        } else {
          db.query(
            `INSERT INTO TIME_SLOTS (doctor_id, patient_id, month, year, day, slot_name, status) VALUES (${
              req.body.doctor_id
            },${req.body.patient_id}, ${parseInt(req.body.month) + 1}, ${
              req.body.year
            }, ${req.body.day}, "${req.body.slot}", ${req.body.status})`,
            (err, result) => {
              if (err) {
                res.status(500).send(err);
                console.log(err);
              }
              if (result) {
                // res.status(200).send("Booking created successfully");
                sendMessage(res, "Booking created successfully", 200);
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
        `DELETE FROM TIME_SLOTS WHERE doctor_id=${
          req.body.doctor_id
        } and month=${parseInt(req.body.month) + 1} and day=${
          req.body.day
        } and year=${req.body.year} and slot_name="${req.body.slot}"`,
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
            sendMessage(res, err, 500);
          }
          if (result) {
            // res.status(200).send("Booking deleted successfully");
            sendMessage(res, "Booking deleted successfully", 200);
          }
        }
      );
    } else {
      db.query(
        `UPDATE TIME_SLOTS SET status=${req.body.status} WHERE doctor_id=${
          req.body.doctor_id
        } and month=${parseInt(req.body.month) + 1} and day=${
          req.body.day
        } and year=${req.body.year} and slot_name="${req.body.slot}"`,
        (err, result) => {
          if (err) {
            console.log(err);
            // res.status(500).send(err);
            sendMessage(res, err, 500);
          }
          if (result) {
            // res.status(200).send("Booking updated successfully");
            sendMessage(res, "Booking updated successfully", 200);
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
