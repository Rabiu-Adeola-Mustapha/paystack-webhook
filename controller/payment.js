const { startPayment } = require("../services/payment");
const Transaction = require("../models/transaction");
const axios = require("axios");
const crypto = require("crypto");



const payWithPaystack = async (req, res) => {

   const { email, amount} = req.body;

   console.log( email, amount);
  try {
    if (!amount || !email) {
      throw new Error("Amount and email are required for Paystack payment.");
    }

    const response = await startPayment(amount, email);
    console.log("Paystack Response:", response.data);

     res.status(200).json({
       status: "success",
       message: "Payment initiated successfully",
       data: response.data,
     });
  
    
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw new Error("Payment initialization failed.");
  }
};




const confirmWebhook = async(req, res) => {
  const paymentDetails = req.body;
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(paymentDetails))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = paymentDetails.event;
    const reference = paymentDetails.data.reference;
    const amount = paymentDetails.data.amount / 100;
    const status = paymentDetails.data.status;
    const first_name = paymentDetails.data.customer.first_name;
    const last_name = paymentDetails.data.customer.last_name;
    const customer_email = paymentDetails.data.customer.email;
    const customer_code = paymentDetails.data.customer.customer_code;

    // Insert data into your database here
    await Transaction.insert({ event, reference, amount, status, first_name, last_name, customer_email, customer_code });

    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};




module.exports = {
  payWithPaystack,
  confirmWebhook,
};
