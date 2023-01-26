const sql = require("../models/db.js");

exports.getPatientReport = (req, res) => {

    const data = {
        patient_id: req.body.patient_id
    }
    console.log('dddddddd', req.body);

    sql.query(
        `SELECT * FROM patient_report  WHERE patient_id= ${data.patient_id}`,
        (error, result) => {
          if (result.length > 0) {
              
              result.forEach(element => {
                  console.log('166666', element);
                
              });
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
