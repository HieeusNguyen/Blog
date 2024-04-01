const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");
const userMiddleware = require("../middlewares/UserMiddlewares")

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout",userMiddleware.verifyToken, authController.logout);

module.exports = router;
