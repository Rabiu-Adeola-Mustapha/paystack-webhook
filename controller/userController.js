const Users = require("../models/user");
const bcrypt = require("bcrypt");
const { sendMail } = require("../utils/mail");

//getting all employess => /api/v1/users
const getAllEmployees = async (req, res) => {
  try {
    console.log(req.body);
    const employees = await Users.find();

    return res.status(200).json({
      status: "true",
      data: employees,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const getSingleEmployee = async (req, res) => {
  const id = req.params.empId;
  //const email = req.params.email;

  const employee = await Users.findOne({ _id: id });

  if (!employee) {
    return res.status(404).json({
      status: false,
      msg: "Employee not found",
    });
  }

  return res.status(200).json({
    status: true,
    data: employee,
  });
};

const updateEmployee = async (req, res) => {
  const empId = req.params.empId;

  try {
    // Check if employee exists
    let emp = await Users.findById(empId);

    if (!emp) {
      return res.status(404).json({
        status: false,
        msg: "Employee not found",
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    req.body.password = hash;

    // Update the employee using findByIdAndUpdate  But not hashing the password
    const updatedEmployee = await Users.findByIdAndUpdate(empId, req.body, {
      new: true,
    });

    res.status(200).json({
      status: true,
      data: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

const updatePMResource = async (req, res) => {
  let pmEmail = req.body.pmEmail;
  let resourcePhone = req.body.resourcePhone;

  console.log("PM Email : ", pmEmail);
  console.log("Resource Phone : ", resourcePhone);

  try {
    let pmExist = await Users.findOne({ email: pmEmail });
    console.log(pmExist.email);

    if (!pmExist) {
      res.status(400).json({
        status: "false",
        message: "Invalid PM Email",
      });
    }

    let resource = await Resource.findOne({ phoneNumber: resourcePhone });

    if (!resource) {
      res.status(400).json({
        status: "false",
        message: "Invalid Resource Phone Number",
      });
    }

    let resourceMail = resource.email;
    console.log(resourceMail);

    console.log(resource);
    console.log(pmExist.resourcePersonnel);

    // Check if the resource is already added
    if (
      pmExist.resourcePersonnel &&
      pmExist.resourcePersonnel.includes(resource._id)
    ) {
      return res.status(400).json({
        status: "false",
        message: "Resource already added to the Employee",
      });
    }

    // Add the resource reference to the Employee's resource array
    pmExist.resourcePersonnel.push(resource._id);
    await pmExist.save();

    // console.log("Got to Resource mail")
    if (resourceMail) {
      // Send mail
      const mailOptions = {
        to: resource.email,
        subject: " PM Assigned ✔",
        text: `Your PM is ${pmExist.firstName} ${pmExist.lastName}`,
        html: `<p>You have successfully been assigned as resouces personnel to a PM, Engineer ${pmExist.firstName} ${pmExist.lastName}</p>`,
      };

      await sendMail(mailOptions);
    }

    console.log("Got to PM mail");

    let mailOption = {
      to: pmExist.email,
      subject: " Resource Allocation ✔",
      text: `You have been assigned some new resource(s) personnel on tascom, do endeavour to check your resource pool`,
      html: `You have been assigned some new resource(s) personnel on tascom, do endeavour to check your resource pool</p>`,
    };

    await sendMail(mailOption);

    console.log("Passed PM mail");

    res.status(200).json({
      status: "true",
      message: "Resource added successfully",
      employee: pmExist,
    });

    // add a reference of the resource to the Employee attributes resource array
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "An error occurred while adding the resource",
      error: error.message,
    });
  }
};

const getMyResource = async (req, res) => {
  console.log(req.employee);
  const { jobTile, id, email } = req.employee;

  try {
    const employee = await Users.findOne({ email }).populate({
      path: "resourcePersonnel",
      select: "firstName lastName phoneNumber accountNumber bankName",
    });

    //console.log(employee.resourcePersonnel) ;

    if (!employee) {
      return res.status(404).json({
        status: false,
        message: "Employee not found",
      });
    }

    const resourceList = employee.resourcePersonnel.map((res) => ({
      id: res._id,
      firstName: res.firstName,
      lastName: res.lastName,
      phoneNumber: res.phoneNumber,
      accountNumber: res.accountNumber,
      bankName: res.bankName,
    }));

    console.log(resourceList);

    res.status(200).json({
      status: "true",
      data: resourceList,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      messsage: `Something went rong`,
      error: error.message,
    });
  }
};

const checkEmployee = (id) => {
  const employee = Users.findOne({ _id: id });

  return employee;
};

module.exports = {
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  updatePMResource,
  getMyResource,
};
