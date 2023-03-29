getDoctors = (req, res) => {
  sql.query(`SELECT * FROM doctor`, (err, result) => {
    if (result.length > 0) {
      return res.status(200).send({
        msg: "Doctor List",
        data: result,
      });
    } else {
      return res.status(200).send({
        msg: "No Doctor Found",
        data: [],
      });
    }
  });
};

module.exports = {
  getDoctors,
};
