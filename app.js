require("dotenv").config();
const express = require("express");
const cors = require('cors');
const mongoSanitize = require("express-mongo-sanitize");
const cookie = require("cookie-parser");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { isAuthenticated } = require("./middlewares/autho");
const authRouter = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute");
const paymentRoutes = require("./routes/paymentRoute");




const app = express();

// Apply CORS as the first middleware
app.use(
  cors({
    origin: [
            "https://paystack-webhook-font.netlify.app",
            "http://localhost:3000", 
            "https://paystack-webhook-ochre.vercel.app",
            "https://paystack-webhook-ochre.vercel.app/api/paystack/v1/payment/initialize"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle Preflight Requests (for complex requests)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});

// enables json
app.use(express.json());
//app.use(bodyParser.json());

app.use(cookie());
  // Use Helmet!
// Prevents Mongodb injection
// Stores and protect token in cookie
app.use(mongoSanitize());
app.use(helmet());


app.use(bodyParser.urlencoded({ extended: true }));



app.get('/health', (req, res) => {
  res.json({
    "message" : "Welcome to Paystack Webhook API"
  })
})


//   Auth Route
app.use('/api/paystack/v1', authRouter);
// User Route
app.use('/api/paystack/v1/user', isAuthenticated , userRoutes);
// Payment Route
app.use('/api/paystack/v1/payment', paymentRoutes);



// "http://localhost:8989/api/paystack/v1/.........."
// "http://localhost:8989/api/paystack/v1/payment/initialize..........";
// "http://localhost:8989/api/paystack/v1/payment/webhook..........";
// "http://localhost:8989/api/paystack/v1/reg"





//app.use(error);


module.exports = app;