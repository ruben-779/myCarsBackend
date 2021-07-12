const router = require("express").Router();
const { register, login } = require("./auth.controller");

// define routerAuth
router.post("/login", login);
router.post("/register", register);

module.exports = router;
