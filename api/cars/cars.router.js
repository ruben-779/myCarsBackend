const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { getAll, getById, edit, remove, create } = require("./cars.controller");

function validAuth(req, res, next) {
  // confirm that the user has authorization
  if (!req.headers.authorization) {
    return res.status(403).send("you don't have authorization");
  }
  const token = req.headers.authorization;
  //decrypt the token and verify
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

// Cars router
router.get("/", validAuth, getAll);

router.get("/:id", validAuth, getById);

router.patch("/:id", validAuth, edit);

router.delete("/:id", validAuth, remove);

router.post("/", validAuth, create);

module.exports = router;
