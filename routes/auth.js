const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {authToken} = require("../middleware/authToken");

// secret route
router.get("/secret", authToken, (req, res) => {
  res.json({user: req.user});
});

/* register route. */
router.get("/register", (req, res, next) => {
  console.log("Register Page!!");
});

router.post("/register", async (req, res) => {
  // res.json(req.body);
  const {email, username, firstName, lastName, country, password} = req.body;
  const user = new User({
    username,
    email,
    firstName,
    lastName,
    country,
  });

  const registeredUser = await User.register(user, password);
  res.json(registeredUser);
  // req.login(registeredUser, (err) => {
  //   if (err) {
  //     return res.json({
  //       success: false,
  //       status: 400,
  //       message: {err},
  //     });
  //   } else {
  //     return res.json({
  //       success: true,
  //       statusCode: 200,
  //       message: "You registered Successfully!",
  //       user: user,
  //     });
  //   }
  // });
});

// login routes//

router.get("/login", (req, res) => {
  console.log("Login Page!!");
});

router.post("/login", async (req, res) => {
  const {username} = req.body;
  const user = new User({
    username,
  });
  // console.log(user.toJSON());
  if (!req.body.username)
    return res.json({
      success: false,
      status: 400,
      message: "username missing",
    });

  if (!req.body.password)
    return res.json({
      success: false,
      status: 400,
      message: "password  missing",
    });
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.json({success: false, message: err});

    if (!user)
      return res.json({
        success: false,
        message: "username or password incorrect",
      });
    req.login(user, (err) => {
      if (err) return res.json({success: false, message: {err}});
      const token = generateAccessToken(user.toJSON());
      // console.log(user);
      res.json({user, token: token});
      // res.json({user});
    });
  })(req, res);
  // const token = generateAccessToken(user.toJSON());
  // res.json({user, token: token});
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
};

module.exports = router;
