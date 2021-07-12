const usersModel = require("./users.model");
const mongoose = require("mongoose");

module.exports = {
  getAll,
  getById,
  editSelf,
  deleteSelf,
  remove,
};

function getAll(req, res) {
  usersModel
    .find()
    .populate("favouriteCars")
    .then((r) => {
      res.json(r);
    })
    .catch((err) => console.log(err));
}

function getById(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (userId) {
    userModel
      .findById(req.params.id)
      .populate("favouriteCars")
      .then((r) => res.json(r))
      .catch((err) => res.status(500).json("An error has occurred"));
  } else {
    res.status(404).send("User not found");
  }
}

function remove(req, res) {
  if (req.currentUser.role === "admin") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (userId) {
      usersModel
        .findByIdAndDelete(req.params.id)
        .then((r) => res.json(r))
        .catch((err) => res.status(500).json("An error has ocurred"));
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(403).send("you are not admin");
  }
}

function deleteSelf(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel
      .findById(req.params.id)
      .then((r) => {
        if (r.email === req.currentUser.email) {
          userModel
            .findByIdAndDelete(req.params.id)
            .then((r) => res.send("successfully removed"));
        } else {
          res.status(403).send("you don't have authorization");
        }
      })
      .catch((err) => res.status(404).json("User not found"));
  } else {
    res.status(404).send("User not found");
  }
}

function editSelf(req, res) {
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel
      .findById(req.params.id)
      .then((r) => {
        if (r.email === req.currentUser.email) {
          userModel
            .findByIdAndUpdate(req.params.id, req.body)
            .then((r) => res.send(r));
        } else {
          res.status(400).send("You don't have authorization");
        }
      })
      .catch((err) => res.status(404).json("User not found"));
  } else {
    res.status(404).send("User not found");
  }
}
