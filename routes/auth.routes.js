const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
router.post("/register-institute", authController.registerInstitute);
// LOGIN (Admin / Teacher / Student)
router.post("/login", authController.login);

module.exports = router;
