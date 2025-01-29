require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = function signJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
