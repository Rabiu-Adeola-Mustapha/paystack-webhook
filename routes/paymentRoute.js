const paymentRoutes = require("express").Router();

const {
  confirmWebhook,
  payWithPaystack,
} = require("../controller/payment");

paymentRoutes.post("/initialize", payWithPaystack);
paymentRoutes.post("/webhook", confirmWebhook);




module.exports = paymentRoutes;
