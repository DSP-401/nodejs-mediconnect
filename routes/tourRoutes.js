const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authJwt } = require("../middleware");

const aws = require("aws-sdk");
const multer = require("multer");

const storage = multer.memoryStorage();
const sql = require("../models/db.js");

const maxSize = 1 * 1024 * 1024; // for 10MB
// Initialize Multer with the storage engine
const upload = multer({ storage: storage ,limits: { fileSize: maxSize }, });



const authController = require('./../controllers/authController');
const doctorProfileController = require('./../controllers/doctorProfileController');
const addPatientOnBoardController = require('./../controllers/addPatientOnBoardController');
const uploadPatientFileController = require('./../controllers/uploadPatientFileController');

router.post('/signup', authController.signup );
router.post('/login', authController.login );

router.post('/addDoctorProfile',[authJwt.verifyToken], doctorProfileController.profile );
router.get('/getDoctorProfile',[authJwt.verifyToken], doctorProfileController.getProfile );

router.post('/addPatientOnBoard', [authJwt.verifyToken], addPatientOnBoardController.patientOnBoard );
router.get('/getPatient', [authJwt.verifyToken], addPatientOnBoardController.getPatient );
router.get('/getPatientForAnotherDoctor', [authJwt.verifyToken], addPatientOnBoardController.getPatientForAnotherDoctor );
router.get('/getPatientReports', [authJwt.verifyToken], uploadPatientFileController.getPatientReport );
router.post('/uploadPatientReport', [authJwt.verifyToken], upload.single("file"),(req,res)=>{

  const file = req.file;
  if (file.mimetype !== "application/pdf") {
      return res.status(200).send({
          msg: "Please use PDF file",
      });
  }

  sql.query(
    `SELECT * FROM aws_cred WHERE id = 1`,
    (err, result) => {
      if (result.length) {
          aws.config.update({
            secretAccessKey: result[0].secret_key,
            accessKeyId: result[0].access_key,
            region: result[0].region,
          });


          return new Promise((resolve, reject) => {
            const filePath = `${Date.now().toString()}.pdf`;
            const s3 = new aws.S3();
            const params = {
              Bucket: result[0].bucket,
              Key: filePath,
              Body: file.buffer,
            };
    
            s3.upload(params, (err, data) => {
              if (err) {
                // reject("Error uploading file to S3");
              } else {
                  console.log('611111', data);
                if (data.key) {
                    
                    if (!req.body.doctor_id) {
                        return res.status(200).send({
                            msg: "doctor filed missing",
                        });
                    }
                    if (!req.body.patient_id) {
                        return res.status(200).send({
                            msg: "patient filed missing",
                        });
                    }
    
                    let date_ob = new Date();
                    // adjust 0 before single digit date
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    // current month
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    // current year
                    let year = date_ob.getFullYear();
                    sql.query(
                        `INSERT INTO patient_report (doctor_id, patient_id, file, date, upload_by ) 
                        VALUES ('${req.body.doctor_id}', '${req.body.patient_id}', '${filePath}', '${year + "-" + month + "-" + date}', 'doctor')`,
                        (err, result) => {
                          console.log('83333', result)
                          if (result.insertId) {
                            return res.status(200).send({
                                msg: "Report Upload Successfully",
                            });
                          } else {
                            return res.status(200).send({
                                msg: "Something Went Wrong",
                            });
                          }
                        }
                      );
                }
              }
            });
         
      });

      } else {
        return res.status(200).send({
          msg: "Please Try Again!!!",
          data: [],
        });
      }
    }
  );
  
  

   
    
   
} );

module.exports = router;