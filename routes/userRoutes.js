//const User = require("./users.js")
//const user = new User()
const express = require("express");
const router = express.Router()
const auth = require("../middleware/auth.js")
const db = require("../core/db")
const bcrypt = require("bcrypt")
const userMiddleware = require('../middleware/users.js');
const jwt = require("jsonwebtoken")

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
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
            const token = jwt.sign({
                name: result[0].name,
                email: result[0].email,
                userId: result[0].id
              },
              process.env.JWT_SECRET
            );
            return res.header('x-auth-token', token).status(200).send({
              msg: 'Logged in!',
              token,
              user: { name: result[0].name, email: result[0].email }
            });
          }
          return res.status(401).send({
            msg: 'Email or password is incorrect!'
          });
        }
      );
    }
  );
});


router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This Email is already in use!'
        });
      } else {
        // email is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users (name, email, password) VALUES (${db.escape(req.body.name)}, ${db.escape(
                req.body.email)}, ${db.escape(hash)})`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                 });
                }
                return res.status(200).send({
                  msg: 'Registered!',
                  user: { name: req.body.name, email: req.body.email }
                });
              }
            );
          }
        });
      }
    }
  );
});

router.get('/getUser', auth, async (req, res, next) => {
  res.json(req.user)
});

module.exports = router;
