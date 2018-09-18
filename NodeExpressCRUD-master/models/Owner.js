var mongoose = require('mongoose');

var OwnerSchema = new mongoose.Schema({
  
  address: String,
  companyname: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Owner', OwnerSchema );
