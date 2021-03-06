const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose")
const express = require("express");
const app = express();
const mysql = require("mysql")

require("dotenv").config()

// routes
//const user = require("./routes/user.js")
const user = require("./routes/userRoutes.js")
//const form = require("./routes/form.js")
const kyc = require("./routes/company.js")

// middleware
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))

// router middleware
app.use(express.json());
app.use('/api', user);
//app.use('/api', form);
app.use('/api', kyc);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
