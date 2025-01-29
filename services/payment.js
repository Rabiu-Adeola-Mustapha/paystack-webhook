require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

const startPayment = async (amount, email) => {
  if (!amount || !email) {
    throw new Error("Amount and email are required");
  }

  const amountInKobo = Math.round(amount * 100);

  try {
    const response = await axios.post(
      `${process.env.PAYSTACK_BASEURL}/transaction/initialize`,
      {
        amount: amountInKobo,
        email: email,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        channels: ["card"],
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to initialize payment: ${response.status} - ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error starting payment:", error.message);
    throw error;
  }
};




const completePayment = async (reference) => {
  // Validate reference
  if (!reference) {
    throw new Error("Transaction reference is required");
  }

  try {
    const response = await axios.get(
      `${process.env.PAYSTACK_BASEURL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to verify payment: ${response.status} - ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error completing payment:", error.message);
    throw error;
  }
};

module.exports = {
  startPayment,
  completePayment,
 
};
