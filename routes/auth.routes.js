const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const authController = require("../controllers/auth.controller");

router.post("/register-institute", authController.registerInstitute);
// LOGIN (Admin / Teacher / Student)
router.post("/login", authController.login);

// Profile routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
