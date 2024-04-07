const express = require("express");
const router = express.Router();
const accountControllers = require("../app/controllers/AccountController");
// accountControllers.index;

router.get("/login", accountControllers.login);
router.get("/register", accountControllers.register);
// router.get("/", accountControllers.index);

module.exports = router;
