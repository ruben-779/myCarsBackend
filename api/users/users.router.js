const router = require("express").Router();
const jwt = require("jsonwebtoken");

const {
  getAll,
  getById,
  editSelf,
  remove,
  deleteSelf,
  verify,
} = require("./users.controller");

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

// Users router
router.get("/", validAuth, getAll);

router.get("/:id", validAuth, getById);

router.patch("/:id", validAuth, editSelf);

router.delete("/:id", validAuth, remove);

router.delete("/deleteself/:id", validAuth, deleteSelf);

router.get("/verify/:id/:safeword", verify);

module.exports = router;
