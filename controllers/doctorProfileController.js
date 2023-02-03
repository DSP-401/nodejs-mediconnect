const sql = require("../models/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getProfile = (req, res) => {
  if (!req.body.user_id) {
    return res.status(200).send({
      msg: "Something went wrong",
    });
  }
  sql.query(
    `SELECT * FROM doctor WHERE user_id = ${req.body.user_id}`,
    (err, result) => {
      if (result.length) {
        return res.status(200).send({
          data: result[0],
        });
      } else {
        return res.status(200).send({
          msg: "No Data found",
          data: [],
        });
      }
    }
  );
};

exports.profile = (req, res) => {

  const profile = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    dob: req.body.dob,
    phone: req.body.phone,
    speciality: req.body.speciality,
    expericance: req.body.expericance,
    fees: req.body.fees,
    degree_name: req.body.degree_name,
    user_id: req.body.user_id,
    degree_of_year: req.body.degree_of_year,
  };

  if (
    !profile.firstname ||
    !profile.lastname ||
    !profile.gender ||
    !profile.dob ||
    !profile.phone ||
    !profile.speciality ||
    !profile.expericance ||
    !profile.fees ||
    !profile.degree_name ||
    !profile.user_id ||
    !profile.degree_of_year
  ) {
    return res.status(200).send({
      msg: "required all filed",
    });
  }

  sql.query(
    `SELECT * FROM doctor WHERE user_id = ${profile.user_id}`,
    (err, result) => {
      if (!result.length) {
        sql.query(
          `INSERT INTO doctor (firstname, lastname, gender, dob, phone, speciality, expericance, fees, degree_name, user_id, degree_of_year, onBoarding ) 
                    VALUES ('${profile.firstname}', '${profile.lastname}' , '${profile.gender}', '${profile.dob}', '${profile.phone}', '${profile.speciality}', '${profile.expericance}', '${profile.fees}', '${profile.degree_name}', '${profile.user_id}', '${profile.degree_of_year}', 'yes')`,
          (erro, resultt) => {
            if (resultt.affectedRows === 1) {
              return res.status(200).send({
                msg: "Detail Successfully Saved",
              });
            } else {
              return res.status(500).send({
                msg: "Please try again",
              });
            }
          }
        );
      } else {
        if (result[0].user_id) {
          var sqlq = `UPDATE doctor SET ? WHERE user_id= ?`;
          profile.onBoarding = 'yes';
          sql.query(sqlq, [profile, result[0].user_id], (er, re) => {
            if (re.affectedRows == 1) {
              return res.status(200).send({
                msg: "Detail Successfully Saved",
              });
            } else {
              return res.status(500).send({
                msg: "Please try again",
              });
            }
          });
        }
      }
    }
  );
};
