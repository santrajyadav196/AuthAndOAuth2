const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  if (token == null)
    return res.json({
      success: false,
      statusCode: 401,
      message: "Unauthorized",
    });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.json({success: false, statusCode: 403, message: "Forbidden"});
    User.findOne({_id: user._id})
      .then((response) => {
        // return console.log({response});
        if (!response)
          return res.json({success: false, message: "User not Found"});
        req.user = response;
        next();
      })
      .catch((error) => {
        return res.json({success: false, message: error});
      });
    // req.user = user;
    // next();
  });
};
