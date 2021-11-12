const mongoose = require("mongoose");

exports.connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/digitalogy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log("Connection is open!!");
    })
    .catch((err) => {
      console.log("Oh no error", err);
    });
};
