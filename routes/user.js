const User = require('../model/User.js')
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth.js")
const bcrypt = require('bcrypt');

router.get('/getUser', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-Hashed_password -salt')
	res.json(user)
})

// login
router.post('/login', async(req, res) => {
  // get request body
  const {email, password} = req.body;
  // check if all inputs are filled 
  if(email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }
  
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: 'Invalid Email or Password.' });
  
  const { _id, name } = user

  const validPAssword = await bcrypt.compare(req.body.password, user.password);
  if (!validPAssword) return res.status(400).json({ msg: 'Invalid Email or Password.' });

  const token = user.generateAuthToken();
  res.send({ user: {_id, name, email}, token })
})

// register
router.post('/user', async (req, res) => {
	const {name, email, password} = req.body;
  // check if all inputs are filled
  if (name === "" || email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }
  
  // verifies if user already exit
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).json({ msg: 'User already registered' })

  // gets new users info
  user = new User({name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt)

  // saves the details to the database
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send({ user: { name, email }, token });
})

router.post('/updatePassword', async(req, res) => {
    const { _id, email, old_password, new_password, confirm_new_password } = req.body
    if ( new_password === "" ) {
        res.status(400).json({
            msg: "Input all Fields"
        })
    }
    
    let user = await User.findOne({ email }, (err, user) => {
        if (user != null) {
            var hash = user.password
            bcrypt.compare(old_password, hash, function(err, res) {
            //if (res) {
                // Password match
                if (new_password == confirm_new_password) {
                    bcrypt.hash(new_password, 10, function(err, hash) {
                    user.password = hash
                    user.save()
                    
                    })
                }
            //}          
            })
        }
        res.status(200).json({
            msg: user.name + " your password has been changed."
        })
    })
    if (!user) return res.status(400).json({ msg: 'User not found' })
    
})

module.exports = router
