const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

let dealerships = "";
let cars = "";
const options = {
  headers: {
    Authorization: process.env.TOKEN_SERVER,
  },
};

const token = process.env.TOKEN_TELEGRAM;

const bot = new TelegramBot(token, { polling: true });

exports.telegramBot = bot.onText(/^\/dealerships/, function (msg) {
  axios
    .get(process.env.API_URL + "dealerships", options)
    .then((d) => {
      d.data.forEach((d) => {
        d.cars.forEach((c) => {
          cars += c.brand + " " + c.model + " " + c.colour + "; ";
        });
        dealerships += "\n-" + d.name + ":\n  " + cars + "\n ";
        cars = "";
      });

      console.log(cars);

      console.log(dealerships);

      var chatId = msg.chat.id;
      var username = msg.from.username;
      bot.sendMessage(
        chatId,
        "Hola, " +
          username +
          " estos son nuestos concesionarios y sus coches: " +
          dealerships +
          " "
      );
      dealerships = "";
    })
    .catch((err) => console.log(err));
});
