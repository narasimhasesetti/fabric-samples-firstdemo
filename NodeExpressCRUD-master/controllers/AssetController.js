var mongoose = require("mongoose");
var rn = require('random-number');
var Asset = require("../models/Asset");
var Owner= require("../models/Owner");
var sha = require('sha256');
var bUtil = require("./blockchainutil.js");



var request = require('request');
var assetController = {};
global.ownersList = {};
// Show list of Asset
assetController.list = function(req, res) {
//console.log(ownersList);

  Asset.find({}).exec(function (err, assets) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/assets/index", {assets: assets,blockChainData:global.blockChainData,ownersList:ownersList});
    }
  });
};

// Show asset by id
assetController.show = function(req, res) {
  Asset.findOne({_id: req.params.id}).exec(function (err, asset) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/assets/show", {asset: asset,blockChainData:global.blockChainData});
    }
  });
};

// Create new asset
assetController.create = function(req, res) {

Owner.find({}).exec(function (err, owners) {
    if (err) {
      console.log("Error:", err);
    }
    else {

  
for (var i = 0, len = owners.length; i < len; i++) {
   global.ownersList[owners[i]._id] = owners[i].companyname;
}
 console.log('ested', global.ownersList);
 console.log('One test ested', global.ownersList['5b756342dab8791692b7b107']);

      res.render("../views/assets/create", {owners: owners,ownersList:global.ownersList});

    }
  });

};

// Save new asset
assetController.save =   function(req, res) {
console.log(req.body);
var forEach = require('async-foreach').forEach;

var films = [];
for (var i = 0; i < req.body.assetquantity; i++) {
   films.push("asset");
}

forEach(films, function(item, index, arr) {

      console.log("each", item, index, arr);
 
	 req.body.vin =  "vin"+Date.now()+index;
	  var asset = new Asset(req.body);
	  asset.save(function(err){
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("Successfully created an asset."+asset._id);
	     setTimeout(function(){createBlockAsset(req,res,asset._id,asset.vin);}, 3000);
	    }
      	});
 });

   //setTimeout(function(req,res) {   bUtil.getMyBlock(req, res);   }, 35000);  



    res.redirect("/assets");
};



// Edit an asset
assetController.edit = function(req, res) {
  Asset.findOne({_id: req.params.id}).exec(function (err, asset) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/assets/edit", {asset: asset});
    }
  });
};

// Update an asset
assetController.update = function(req, res) {
  Asset.findByIdAndUpdate(req.params.id, { $set: { assetname: req.body.assetname ,    assettype: req.body.assettype,  owner: req.body.owner, }}, { new: true }, function (err, asset) {
    if (err) {
      console.log(err);
      res.render("../views/assets/edit", {asset: req.body});
    }
    res.redirect("/assets/show/"+asset._id);
  });
};

// Delete an asset
assetController.delete = function(req, res) {
  Asset.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Asset deleted!");
      res.redirect("/assets");
    }
  });
};

module.exports = assetController;

 


function  createBlockAsset(req, res,assetid,assetvin ){

var  assetname = req.body.assetname;
var assettype = req.body.assettype;
var assetquantity = "1"; //req.body.assetquantity;
var vin = assetvin;


var ownerno = "o"+req.body.owner;
var owner = "united marbles";


var options = {
  min: 80000000,
  max: 90000000,
 integer: true
}

var aid =  "a"+assetid; //"m"+rn(options);
//console.log('aid '+aid );
//console.log('assetname '+assetname );
//console.log('assettype '+assettype);
//console.log('assetquantity'+assetquantity);


var argv = [aid,assetname,assettype,assetquantity,ownerno,vin];
//console.log('argv'+argv);
	
var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "init_marble";
requestData["args"] = argv;

//console.log('parsedata'+JSON.stringify(requestData || null ));

//console.log('checking token '+global.Token);

var data = {
    url: 'http://172.16.40.170:4000/channels/mychannel/chaincodes/mycc',
    json: true,
    headers: {
           'Content-Type': 'application/json',
 	    'Authorization':'Bearer '+ global.Token
    },
    body: JSON.parse(JSON.stringify(requestData || null ))
}

request.post(data, function(error, httpResponse, body){
  //  console.log(body);
  //  console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));


//     console.log(body.token);
});
 
}
function testedfun(){
}
