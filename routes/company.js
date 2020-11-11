const express = require("express");
const router = express.Router()
const db = require("../core/db")

router.post('/kyc-bvn', (req, res) => {
    const { id, firstname, middlename, lastname, birthday, bvn, bvnphone } = req.body
    if (firstname === "" || lastname === "" || middlename === "" || birthday === "" || bvn === "" || bvnphone === "") {
        return res.status(400).json({
            msg: "Input all fields"
        })
    }
    
    db.query(
    `SELECT * FROM company WHERE id = ${db.escape(id)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }
      console.log(result)
      })
})

module.exports = router;
