const dealershipsModel = require("./dealerships.model");
const mongoose = require("mongoose");

module.exports = { getAll, getById, remove, edit, create, newCarDealership };

function newCarDealership(dealershipId, carId) {
  return dealershipsModel.findByIdAndUpdate(dealershipId, {
    $push: { cars: carId },
  });
}

function getAll(req, res) {
  dealershipsModel
    .find()
    .populate("cars")
    .then((r) => res.json(r))
    .catch((err) => res.status(500).send("An error has ocurred"));
}

function getById(req, res) {
  let dealershipId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (dealershipId) {
    dealershipsModel
      .findById(req.params.id)
      .populate("cars")
      .then((r) => {
        res.json(r);
      });
  }
}
function remove(req, res) {
  if (req.currentUser.role === "admin") {
    let dealershipId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (dealershipId) {
      dealershipsModel
        .findByIdAndDelete(req.params.id)
        .then((r) => {
          res.send("succesfully remove");
        })
        .catch((err) => res.status(404).send(err));
    } else {
      res.status(404).send("dealership not found");
    }
  } else {
    res.status(403).send("you don't have authorization");
  }
}

function create(req, res) {
  if (req.currentUser.role === "admin") {
    let newDealership = new dealershipsModel(req.body);
    let error = newDealership.validateSync();
    if (!error) {
      dealershipsModel
        .create({
          name: newDealership.name,
          address: {
            street: newDealership.address.street,
            city: newDealership.address.city,
            zipcode: newDealership.address.zipcode,
          },
          cars: newDealership.cars,
        })
        .then((r) => res.send("succesfully create"))
        .catch((err) => res.send("An error has ocurred"));
    } else {
      res.status(400).send(error.errors);
    }
  } else {
    res.status(403).send("you don't have authorization");
  }
}
function edit(req, res) {
  if (req.currentUser.role === "admin") {
    let dealershipId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (dealershipId) {
      dealershipsModel
        .findByIdAndUpdate(req.params.id, req.body)
        .then((r) => {
          res.json(r);
        })
        .catch((err) => res.status(404).send("dealership not found"));
    }
  } else {
    res.status(403).send("You don't have authorization");
  }
}
