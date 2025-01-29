require("dotenv").config();
const mongoose = require('mongoose');



const dbConnection = async() => {

    try {

       await mongoose.connect(process.env.MONGO_URI)
       console.log("MongoDB connected Successfully");
       
       
    }catch(error) {
        console.log("error: ", error);
        process.exit(1);
    };
};


module.exports = {dbConnection};