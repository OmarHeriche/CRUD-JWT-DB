const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userScheema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "enter the name"],
    minlength: 3,
    maxlenght: 20,
  },
  email: {
    type: String,
    required: [true, "enter the email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "pleas provide a valide email",
    ],
  },
  password: {
    type: String,
    required: [true, "enter the password"],
    minlength: 6,
  },
});

userScheema.pre("save", function (next) {
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});
userScheema.methods.createToken = function () {
  return jwt.sign(
    { name: this.name, userId: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFE_TIME,
    }
  );
};
userScheema.methods.cmparePassword = async function(currentPassword){
  const isMatch=  bcrypt.compareSync(currentPassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userScheema);
