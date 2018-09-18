var mongoose = require('mongoose');

var AssetSchema = new mongoose.Schema({
  assetname: String,
  assettype: String,
  assetquantity: String,
  vin: String,
  owner: String,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', AssetSchema);
