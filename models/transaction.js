const {mongoose, Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');




const transactionSchema = new Schema({
  event: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    required: true,
  },
  customer_code: {
    type: String,
    required: true,
  },
});




module.exports = model("Transactions", transactionSchema);
