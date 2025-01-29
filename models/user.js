const {mongoose, Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');




const userSchema = new Schema({
  firstName: {
    type: String,
   // required: true,
  },
  lastName: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    //required: true,
  },
  gender: {
    type: String,
   
  },
  
 
  avatarURL: {
    type: String,
  },

  resetToken: {
    type: String,
  },

  resetTokenExpires: {
    type: Date,
  },
});

   
// Encrypting password
userSchema.pre("save", function (next) {
    this.password = bcrypt.hash(this.password, 10);
  
    next();
  });

// compare user password in DB
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };



module.exports = model("Users", userSchema);