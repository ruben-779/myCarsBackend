let nodemailer = require("nodemailer");
let axios = require("axios");

let admins = "";

const options = {
  headers: {
    Authorization: process.env.TOKEN_SERVER,
  },
};

// email sender function
exports.sendEmailVerify = function (subject, name, id, safeWord) {
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
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
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
