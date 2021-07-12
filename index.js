const express = require("express");
const app = express();

//fix cors
const cors = require("cors");
app.use(cors());

//recognize that it will receive a json
app.use(express.json());

//to connect to mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/appCars");
