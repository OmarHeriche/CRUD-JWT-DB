const express = require("express");
const refreshToken = require("../middleware/refreshToken");
const refreshRouter = express.Router();

refreshRouter.route("/").get(refreshToken);

module.exports = refreshRouter;
