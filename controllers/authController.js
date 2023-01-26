const sql = require("../models/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var config = require('../config/auth.config');
exports.signup = (req,res)=>{

  sql.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${sql.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            // has hashed pw => add to database
            sql.query(
              `INSERT INTO users (role, email, password) VALUES ('${req.body.role}', ${sql.escape(req.body.email)}, ${sql.escape(hash)})`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: "The user has been registerd with us!",
                });
              }
            );
          }
        });
      }
    }
  );
}


exports.login = (req,res)=>{
    sql.query(
        `SELECT * FROM users WHERE email = ${sql.escape(req.body.email)};`,
        (err, result) => {
          // user does not exists
          if (err) {
            throw err;
            return res.status(400).send({
              msg: err
            });
          }
          if (!result.length) {
            return res.status(401).send({
              msg: 'Email or password is incorrect!'
            });
          }
          // check password
          bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
              // wrong password
              if (bErr) {
                throw bErr;
                return res.status(401).send({
                  msg: 'Email or password is incorrect!'
                });
              }
              if (bResult) {
                // const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
                // sql.query(
                //   `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                // );
                var token = jwt.sign({ id: result[0].id }, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });
                return res.status(200).send({
                  msg: 'Logged in!',
                  token,
                  user: result[0]
                });
              }
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
          );
        }
      );

}