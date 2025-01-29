const { Schema, model } = require('mongoose');


const itcSchema = new Schema({
  emp_id: {
    type: String,
    required: false,
  },
  itcNumber: {
    type: String,
    //required: true,
  },

  PM_firstName: {
    type: String,
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  projectSource: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  clientCode: {
    type: String,
  },
  itcStatus: {
    type: String,
  },
  requisCount: {
    type: Number,
    default: 0,
  },
  totalAmountPaid: {
    type: Number,
    default: 0,
  },
  diffFromTargetCost: {
    type: Number,
    default: 0,
  },
  rows: {
    type: Array,
  },
  attachedDocs: {
    type: String,
  },
});



module.exports = model("ITC", itcSchema);

