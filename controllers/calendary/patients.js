const db = require("../../models/db");
const {
  getTimeSlots,
  getDaysInMonth,
  sendMessage,
} = require("../calendary/utility");

const getBookingSlots = (req, res) => {
  if (
    !req.query.patient_id ||
    !req.query.month ||
    !req.query.year ||
    !req.query.day
  ) {
    res.status(400).send("Incomplete data");
  } else {
    db.query(
      `SELECT * FROM TIME_SLOTS WHERE patient_id = ? AND day = ? AND month = ? AND year = ?`,
      [
        req.query.patient_id,
        req.query.day,
        parseInt(req.query.month) + 1,
        req.query.year,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          sendMessage(res, err, 500);
        }
        if (result) {
          // res.status(200).send(result);
          sendMessage(res, result, 200);
        }
      }
    );
  }
};

module.exports = {
  getBookingSlots,
};
