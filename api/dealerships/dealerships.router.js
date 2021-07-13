const router = require("express").Router();
const jwt = require("jsonwebtoken");

const {
  getAll,
  getById,
  edit,
  remove,
  create,
} = require("./dealerships.controller");

function validAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send("you don't have authorization");
  }
  const token = req.headers.authorization;
  jwt.verify(token, process.env.TOKEN_PASSWORD, (err, data) => {
    if (err) {
      return res.status(403).send("Invalid token");
    } else {
      console.log(data);
      req.currentUser = data;
      next();
    }
  });
}
router.get("/", validAuth, getAll);

router.get("/:id", validAuth, getById);

router.patch("/:id", validAuth, edit);

router.delete("/:id", validAuth, remove);

router.post("/", validAuth, create);

module.exports = router;
