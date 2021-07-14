const usersModel = require("./users.model");
const mongoose = require("mongoose");

module.exports = {
  getAll,
  getById,
  editSelf,
  deleteSelf,
  remove,
  deleteCarsUser,
  verify,
};

//function to delete in users a car that has been deleted
function deleteCarsUser(id) {
  //pull the car that has the car id removed
  return usersModel.updateMany(
    { favouriteCars: id },
    { $pull: { favouriteCars: id } }
  );
}
//find all users
function getAll(req, res) {
  usersModel
    .find()
    .populate("favouriteCars")
    .then((r) => {
      res.json(r);
    })
    .catch((err) => res.status(500).send("An error has ocucurred"));
}

//Find by id
function getById(req, res) {
  //check that the id is valid
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel
      .findById(req.params.id)
      .populate("favouriteCars")
      .then((r) => {
        if (r) {
          res.json(r);
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((err) => res.status(500).json("An error has occurred"));
  } else {
    res.status(404).send("User not found");
  }
}
//delete user
function remove(req, res) {
  //Check if current user is admin
  if (req.currentUser.role === "admin") {
    let userId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (userId) {
      usersModel
        .findByIdAndDelete(req.params.id)
        .then((r) => {
          if (r) {
            res.json("Succesfully remove");
          } else {
            res.status(404).send("User not found");
          }
        })
        .catch((err) => res.status(500).json("An error has ocurred"));
    } else {
      res.status(404).send("User not found");
    }
  } else {
    res.status(403).send("you are not admin");
  }
}
// delete self user
function deleteSelf(req, res) {
  //check that the id is valid
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel
      .findById(req.params.id)
      .then((r) => {
        // check that the emails are the same
        if (r.email === req.currentUser.email) {
          usersModel
            .findByIdAndDelete(req.params.id)
            .then((response) => res.send("successfully removed"));
        } else {
          res.status(403).send("you don't have authorization");
        }
      })
      .catch((err) => res.status(404).json("User not found"));
  } else {
    res.status(404).send("User not found");
  }
}

//editself user
function editSelf(req, res) {
  //check that the id is valid
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel
      .findById(req.params.id)
      .then((r) => {
        // check that the emails are the same
        if (r.email === req.currentUser.email) {
          usersModel
            .findByIdAndUpdate(req.params.id, {
              email: req.body.email,
              name: req.body.name,
              $push: { favouriteCars: req.body.favouriteCars },
            })
            .then((r) => res.send(r));
        } else {
          res.status(403).send("You don't have authorization");
        }
      })
      .catch((err) => res.status(404).json("User not found"));
  } else {
    res.status(404).send("User not found");
  }
}

//verify users
function verify(req, res) {
  //check that the id is valid
  let userId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (userId) {
    usersModel.findById(req.params.id).then((u) => {
      // check that the safeWord are the same
      if (u.safeWord === req.params.safeword) {
        //auto verify if everything is correct
        usersModel
          .findByIdAndUpdate(req.params.id, { verify: true })
          .then((r) => {
            if (r) {
              res.send("Succesfully verify");
            } else {
              res.status(404).send("User not found");
            }
          })
          .catch((err) => res.status(500).send("An error has ocurred"));
      } else {
        res.status(403).send("You don't have authorization");
      }
    });
  } else {
    res.status(400).send("Invalid ID");
  }
}
