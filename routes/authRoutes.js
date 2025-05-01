const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const { Op } = require("sequelize");

router.get("/login", (req, res) => {
  res.render("auth/login", {
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

router.get("/signup", (req, res) => {
  res.render("auth/signup", {
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

//pass the flash messages to the signup page

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logout);

router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password");
});

router.post("/forgot-password", authController.forgetPassword);

router.get("/reset/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      req.flash("error_msg", "Password reset token is invalid or has expired.");
      return res.redirect("/auth/forgot-password");
    }

    res.render("auth/reset-password", { token: req.params.token });
  } catch (error) {
    console.error("Error rendering reset password page:", error);
    res.redirect("/auth/login");
  }
});

router.post("/reset/:token", authController.resetPassword);

router.get("/test", (req, res) => {
    res.render("test");
  // Set a sample success message
  req.flash("success_msg", "This is a test success message!");
  req.flash("error_msg", "This is a test error message!");

  // Redirect to /test-page after setting flash messages
  res.redirect("test");
});

// Route to display the test page with flash messages
router.get("/test", (req, res) => {
  res.render("test"); // This will render the 'flashTest.ejs' view
});

module.exports = router;
