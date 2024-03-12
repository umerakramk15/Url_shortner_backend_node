const express = require("express");
const URL = require("../module/url");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const currentUser = await URL.find({ createBy: req.user._id });
  return res.render("home.ejs", {
    urls: currentUser,
  });
});

router.get("/signup", async (req, res) => {
  return res.render("sign.ejs");
});

router.get("/login", async (req, res) => {
  return res.render("login.ejs");
});

module.exports = router;
