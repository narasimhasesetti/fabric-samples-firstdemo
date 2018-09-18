var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  fromcompany: String,
  tocompany: String,
  asset: String,
  transactiontype:String,
  orderedquantity:Number,
  ordereddate    :Date,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction',TransactionSchema );
