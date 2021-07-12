const carsModel = require("./cars.model");
const mongoose = require("mongoose");
const { deleteCarsUser } = require("../users/users.controller");

module.exports = { getAll, getById, remove, create, edit };

function getAll(req, res) {
  carsModel
    .find()
    .populate("dealership")
    .then((r) => res.json(r))
    .catch((err) => res.status(500).json(err));
}

function getById(req, res) {
  let carId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (carId) {
    carsModel
      .findById(req.params.id)
      .populate("dealership")
      .then((r) => res.json(r))
      .catch((err) => res.status(404).send("Car not found"));
  } else {
    res.status(404).send("Car not found");
  }
}

function remove(req, res) {
  if (req.currentUser.role === "admin") {
    let carId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (carId) {
      carsModel
        .findByIdAndDelete(req.params.id)
        .then((r) => {
          deleteCarsUser(req.params.id)
            .then(() => res.send("succesfully remove"))
            .catch((err) => res.send("An error has ocurred"));
        })
        .catch((err) => res.status(404).send(err));
    } else {
      res.status(404).send("Car not found");
    }
  } else {
    res.status(403).send("you don't have authorization");
  }
}

function create(req, res) {
  if (req.currentUser.role === "admin") {
    var newCar = new carsModel(req.body);
    var error = newCar.validateSync();
    if (!error) {
      carsModel
        .create({
          brand: newCar.brand,
          model: newCar.model,
          colour: newCar.colour,
          dealership: newCar.dealership,
        })
        .then((r) => res.send("succesfully create"))
        .catch((err) => res.send("An error has ocurred"));
    } else {
      if (error.errors.model) {
        res.status(400).send("invalid model");
      } else if (error.errors.brand) {
        res.status(400).send("invalid brand");
      } else if (error.errors.colour) {
        res.status(400).send("invalid colour");
      } else if (error.errors.dealership) {
        res.status(400).send("invalid dealership");
      } else {
        res.status(500).send("An error has ocurred");
      }
    }
  } else {
    res.status(403).send("you don't have authorization");
  }
}
function edit(req, res) {
  if (req.currentUser.role === "admin") {
    let carId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (carId) {
      carsModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then((r) => {
          res.json(r);
        })
        .catch((err) => res.status(404).send("Car not found"));
    }
  } else {
    res.status(403).send("You don't have authorization");
  }
}
