let nodemailer = require("nodemailer");
let axios = require("axios");

let usersEmail = "";

const options = {
  headers: {
    Authorization: process.env.TOKEN_SERVER,
  },
};

// email sender function
exports.sendEmailCar = function (subject, model, brand, colour) {
  axios
    .get("http://localhost:3000/users", options)
    .then((r) => {
      r.data.forEach((r) => {
        if (r.role === "visitante") {
          usersEmail += r.email + "; ";
        }
      });
      // defined transporter
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "carappbs@gmail.com",
          pass: "prueba1234",
        },
      });
      // Defined email
      let mailOptions = {
        from: "Remitente",
        to: usersEmail,
        subject: subject,
        text: "",
        html:
          "<h1>Querido client@</h1> <br> <p>Hemos añadido un nuevo vehiculo a nuestra flota!! Estas son sus caracteristicas:</p><br>-Marca: " +
          brand +
          "<br>-Modelo: " +
          model +
          "<br>-Color: " +
          colour,
        // in a future can add price, photo... etc
      };
      // send email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent");
        }
      });
    })
    .catch((err) => console.log(err));
};
