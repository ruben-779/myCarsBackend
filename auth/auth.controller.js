const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../api/users/users.model");

module.exports = { register, login };

function register(req, res) {
  var newUser = new usersModel(req.body);
  //validate the user schema
  var error = newUser.validateSync();
  if (!error) {
    let passwordHash = bcrypt.hashSync(newUser.password, 4);
    usersModel
      .create({
        name: newUser.name,
        email: newUser.email,
        password: passwordHash,
        role: newUser.role,
      })
      .then((r) => res.send(r))
      .catch((err) => {
        if (err.keyValue.email) {
          res.status(400).send("repeated email");
        } else {
          res.status(500).send(err);
        }
      });
  } else {
    if (error.errors.email) {
      res.status(400).send("invalid email");
    } else if (error.errors.name) {
      res.status(400).send("invalid name");
    } else if (error.errors.password) {
      res.status(400).send("required password");
    }
  }
}

function login(req, res) {
  const { email, password } = req.body;
  //first find the email
  usersModel.findOne({ email }).then((r) => {
    if (!r) {
      res.status(404).send("email not found");
    } else if (password == null) {
      res.status(400).send("Email or password no valid");
    } else {
      //now compare the passwords
      if (!bcrypt.compareSync(password, r.password)) {
        res.status(400).send("Email or password no valid");
      } else {
        const token = jwt.sign(
          { email: r.email, role: r.role, id: r._id },
          "SECRET"
        );
        return res.json({
          user: r,
          token: token,
        });
      }
    }
  });
}
