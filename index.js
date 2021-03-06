const express = require("express");
const app = express();
require("dotenv").config();
const { telegramBot } = require("./services/telegramBot/dealershipsTelegram");

//fix cors
const cors = require("cors");
app.use(cors());
telegramBot;
//recognize that it will receive a json
app.use(express.json());

//to connect to mongodb
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  // deprecation warning
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//router
const routerUsers = require("./api/users/users.router");
const routerCars = require("./api/cars/cars.router");
const routerDealerships = require("./api/dealerships/dealerships.router");
const routerAuth = require("./auth/auth.router");

app.use("/users", routerUsers);
app.use("/cars", routerCars);
app.use("/dealerships", routerDealerships);
app.use("/", routerAuth);

//listen port
app.listen(3000, () => console.log("ready at port 3000"));
