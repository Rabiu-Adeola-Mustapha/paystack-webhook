require("dotenv").config();
const Employees = require("../models/user");
const bcrypt = require("bcrypt");
const signJWT = require("../utils/jwtToken");
const cookies = require("cookie-parser");
const { sendMail } = require("../utils/mail");

const registerEmployee = async (req, res) => {
  const {
    email,
    password,

  } = req.body;

  console.log(req.body);

  if (!req.body) {
    return res.status(400).json({
      status: "false",
      msg: "Please enter all fields correctly",
    });
  }

  const employee = await emailExist(email);

  if (employee) {
    return res.status(400).json({
      status: "false",
      msg: "Email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newEmployee = await Employees.create({
    email,
    password: hashPassword,
  });

  await newEmployee.save();

  res.status(200).json({
    status: true,
    msg: "Employee registered successfully",
  });
};

// Login employee => /api/v1
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("email : ", email);

    // console.log(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: " Please enter all fields correctly" });
    }

    const employee = await Employees.findOne({ email }).select("+password");

    if (!employee) {
      return res.status(400).json({
        status: false,
        msg: "Incorrect email or password",
      });
    }
    // check if password is correct
    const isCorrect = await bcrypt.compare(password, employee.password);
    // Employees.comparePassword(password);

    if (!isCorrect) {
      return res.status(400).json({
        status: false,
        msg: "Incorrect email or password",
      });
    }

    const payload = {
      email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      id: employee._id,
    };
    console.log(payload);

    const token = signJWT(payload);

    const options = {
      expiresIn: 3600,
      //httpOnly : true,
    };

    res
      .cookie("token", token, options)
      .status(200)
      .json({
        status: true,
        data: {
          token,
          jobTitle: payload.jobTitle,
        },
      });

    // sending token in cookie
    // sendToken(employee, 200, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      msg: "Something went wrong. Please try again",
    });
  }
};

// forgot password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("email: ", email);

    const employee = await Employees.findOne({ email });

    console.log("user: ", employee);

    if (!employee) {
      res.status(401).json({
        status: "false",
        msg: "Email sent to the employee, should employee exist",
      });
      return; // Return early to prevent further code execution
    }

    // Dynamic import of nanoid
    const { nanoid } = await import("nanoid");

    // Use nanoid to generate a secure reset token
    const resetToken = nanoid(64); // 64-character token

    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

    employee.resetToken = resetToken;
    employee.resetTokenExpires = resetTokenExpires;

    // Save the employee with the new resetToken and resetTokenExpires
    await employee.save();

    console.log("reset-Token: ", resetToken);
    console.log("resetTokenExpires: ", resetTokenExpires);

    const resetUrl = `${process.env.FRONTENDURL}/reset-password?token=${resetToken}`;

    // Send mail
    const mailOptions = {
      to: email,
      subject: "Reset Password Request✔",
      text: `Reset Password Request`,
      html: `<p>Click here to reset your password: </p><p><a href="${resetUrl}"> Reset Password </a></p>`,
    };

    await sendMail(mailOptions);

    res.status(200).json({
      status: "true",
      message: "Password reset link sent",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      status: "Success",
      error: "Failed to send password reset email",
    });
  }
};

//  Reset Passsword
const resetPassword = async (req, res) => {
  // const token = req.body.query;
  const { newPassword, token } = req.body;

  console.log("newPassword: ", newPassword);
  console.log("token : ", token);

  // Trim any extra whitespace
  resetToken = token.trim();

  // Define the expected length based on nanoid usage
  const expectedLength = 64; // Since nanoid(64) is used

  // Validate the token's length
  if (typeof resetToken !== "string" || resetToken.length !== expectedLength) {
    return res.status(200).json({
      status: "Failed",
      message: "Invalid reset token format",
    });
  }

  const employee = await Employees.findOne({
    resetToken: resetToken,
    resetTokenExpires: { $gte: new Date() },
  });

  if (!employee) {
    return res.status(200).json({
      status: "Failed",
      message: "Invalid Link",
    });
  }
  console.log("new Pass", newPassword);
  console.log("token", resetToken);
  // change password to new password and dont forget to hash
  const newHashPassword = await bcrypt.hash(newPassword, 10);

  employee.password = newHashPassword;
  employee.resetToken = null;
  employee.resetTokenExpires = null;

  await employee.save();

  return res.status(200).json({
    status: "Success",
    message: "Passoword Updated Successfully",
  });
};

// Helper Check Email  exist
const emailExist = async (email) => {
  const employee = await Employees.findOne({ email });

  if (employee) {
    return true;
  } else {
    return false;
  }
};



module.exports = {
  registerEmployee,
  loginEmployee,
  forgetPassword,
  resetPassword,
};
