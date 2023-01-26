const sql = require("../models/db.js");

exports.patientOnBoard = (req, res) => {
  const patient_details = {
    name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    phone: req.body.phone,
    doctor_id: req.body.user_id,
    insurance_company_name: req.body.insurance_company_name,
    insurance_code: req.body.insurance_code,
    insurance_joining_date: req.body.insurance_joining_date,
  };

  if (
    !patient_details.name ||
    !patient_details.gender ||
    !patient_details.dob ||
    !patient_details.phone ||
    !patient_details.doctor_id ||
    !patient_details.insurance_company_name ||
    !patient_details.insurance_code ||
    !patient_details.insurance_joining_date
  ) {
    return res.status(200).send({
      msg: "required all filed",
    });
  }

  sql.query(
    `SELECT * FROM patient WHERE phone = ${patient_details.phone}`,
    (e, r) => {
      if (!r.length) {
        sql.query(
          `INSERT INTO patient (name, gender, dob, phone,insurance_company_name, insurance_code, insurance_joining_date, doctor_id ) 
                              VALUES ('${patient_details.name}', '${patient_details.gender}', '${patient_details.dob}', '${patient_details.phone}', '${patient_details.insurance_company_name}', '${patient_details.insurance_code}', '${patient_details.insurance_joining_date}', '${patient_details.doctor_id}')`,
          (erro, resultt) => {
            if (resultt.affectedRows === 1) {
              if (resultt.insertId) {
                sql.query(
                  `INSERT INTO doctor_patient (doctor_id , patient_id) VALUES
                             ('${patient_details.doctor_id}', '${resultt.insertId}' )`,
                  (err, res) => {}
                );
              }

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
        return res.status(200).send({
          msg: "Phone number already in the system",
        });
      }
    }
  );
};

exports.getPatient = (req, res) => {
  const data = {
    doctor_id: req.body.user_id,
  };

  if (!data.doctor_id) {
    return res.status(200).send({
      msg: "user id needed",
    });
  }

  sql.query(
    `SELECT patient.* FROM doctor_patient JOIN patient on patient.id = doctor_patient.patient_id WHERE doctor_patient.doctor_id= ${data.doctor_id}`,
    (error, result) => {
      if (result.length > 0) {
        return res.status(200).send({
          data: result,
        });
      } else {
        return res.status(200).send({
          data: [],
        });
      }
    }
  );
};

exports.getPatientForAnotherDoctor = (req, ress) => {
  const data = {
    doctor_id: req.body.user_id,
    patient_phone: req.body.patient_phone,
  };

  if (!data.doctor_id || !data.patient_phone) {
    return ress.status(200).send({
      msg: "user id needed",
    });
  }

  sql.query(
    `SELECT * FROM patient WHERE phone = ${data.patient_phone}`,
    (error, result) => {
      if (result.length) {
        sql.query(
          `SELECT * FROM doctor_patient WHERE doctor_id = ${data.doctor_id} and patient_id = ${result[0].id}`,
          (err, re) => {
            if (re.length === 0) {
              sql.query(
                `INSERT INTO doctor_patient (doctor_id , patient_id) VALUES
                        ('${data.doctor_id}', '${result[0].id}' )`,
                (err, res) => {}
              );
            }
            return ress.status(200).send({
              data: result,
            });
          }
        );
      } else {
        return ress.status(200).send({
          data: [],
        });
      }
    }
  );
};

exports.getPatientReport = async (req, res) => {

    let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    let x = r.Contents.map(item => item.Key);
    res.send(x)
}