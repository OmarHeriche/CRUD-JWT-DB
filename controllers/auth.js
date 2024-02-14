const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  NotFoundError,
  UnAuthonticatedError,
} = require("../errors");

const register = async (req, res) => {
  console.log("before the user is created");//! here the user is created
  const user = await User.create({ ...req.body }); //todo treat the internal server error comming from here later
  console.log("after the user is created");//! here the user is created
  const token = user.createToken();
  console.log("token= ", token);//! here the token is created
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new BadRequestError("please provide an email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthonticatedError("invalid email");
  }
  const truePassword = user.cmparePassword(password);
  if (!truePassword) {
    throw new UnAuthonticatedError("invalid password");
  }
  const token = user.createToken();
  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token,
  });
};

module.exports = { register, login };
