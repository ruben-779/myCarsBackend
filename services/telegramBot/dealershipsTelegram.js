const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const dealership = require("../../api/dealerships/dealerships.model");

let dealerships = "";
let cars = "";
let text = "";
const options = {
  headers: {
    Authorization: process.env.TOKEN_SERVER,
  },
};

// replace the value below with the Telegram token you receive from @BotFather
const token = "1823865606:AAEo94yqmyxUTV2KuF1oTvKsU3t4aL4RrDU";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
//Declaramos la funcion
exports.telegramBot = bot.onText(/^\/dealerships/, function (msg) {
  axios
    .get("http://localhost:3000/dealerships", options)
    .then((d) => {
      d.data.forEach((d) => {
        d.cars.forEach((c) => {
          cars += c.brand + " " + c.model + " " + c.colour + "; ";
        });
        dealerships += "\n-" + d.name + "\n  " + cars + "\n ";
        cars = "";
      });

      console.log(cars);

      console.log(dealerships);
      // Imprimimos en consola el mensaje recibido.
      // console.log(msg);
      // msg.chat.id se encarga de recoger el id del chat donde se está realizando la petición.
      var chatId = msg.chat.id;
      // msg.from.username se encarga de recoger el @alias del usuario.
      var username = msg.from.username;
      // Enviamos un mensaje indicando el id del chat, y concatenamos el nombre del usuario con nuestro saludo
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
