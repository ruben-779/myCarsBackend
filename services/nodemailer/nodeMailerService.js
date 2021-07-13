let nodemailer = require("nodemailer");
let axios = require("axios");

let admins = "";

const options = {
  headers: {
    Authorization: process.env.TOKEN_SERVER,
  },
};

// email sender function
exports.sendEmail = function (subject, name, id, safeWord) {
  axios
    .get("http://localhost:3000/users", options)
    .then((r) => {
      r.data.forEach((r) => {
        if (r.role === "admin") {
          admins += r.email + "; ";
        }
      });
      console.log(admins);

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
        to: admins,
        subject: subject,
        text: "",
        html:
          "<h1>Hola</h1> <br>pulsa en el siguiente enlace para validar al usuario " +
          name +
          "<br> <a href=http://localhost:3000/users/verify/" +
          id +
          "/" +
          safeWord +
          ">Validar usuario</a>",
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
