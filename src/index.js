//SERVIDOR  
require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const mongoose = require('mongoose');
const connectToDatabase = require('./database');
const cors = require("cors");

connectToDatabase();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("O VASCAO TA GIGANTE 700 MILHA RAPA");
});

require('./app/controllers/authController')(app);
require('./app/controllers/tokenController')(app);

app.listen(3333, () => console.log("server started at http://localhost:3333"));
