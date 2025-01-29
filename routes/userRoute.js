const userRoutes = require('express').Router();

const {
     getAllEmployees,
     getSingleEmployee,
     updateEmployee  } = require('../controller/userController');





userRoutes.get('', getAllEmployees);
userRoutes.get('/user/:empId', getSingleEmployee);
userRoutes.patch('/user/:empId', updateEmployee);








module.exports = userRoutes;
