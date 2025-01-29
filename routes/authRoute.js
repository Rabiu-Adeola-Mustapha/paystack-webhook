const authRouter = require('express').Router();

const {
  registerEmployee,
  loginEmployee,
  forgetPassword,
  resetPassword,
} = require("../controller/authController");




authRouter.post('/reg', registerEmployee);
authRouter.post('/login', loginEmployee);
authRouter.post("/forgot-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);







module.exports = authRouter;