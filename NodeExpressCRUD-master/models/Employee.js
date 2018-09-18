var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
  name: String,
  address: String,
  position: String,
  department: String,
  organization: String,
 email:String, 
 password:String,

 salary: Number,

  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
