var mongoose = require("mongoose");
var Owner= require("../models/Owner");
var request = require('request');
var sha = require('sha256');
var bUtil = require("./blockchainutil.js");


var ownerController = {};
// Show list of Owners
ownerController.list = function(req, res) {
  Owner.find({}).exec(function (err, owners) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/owners/index", {owners: owners,blockChainData:global.blockChainData});
    }
  });
};

// Show owner by id
ownerController.show = function(req, res) {
  Owner.findOne({_id: req.params.id}).exec(function (err, owner) {
    if (err) {
      console.log("Error:", err);
    }
    else {
     console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));

      res.render("../views/owners/show", {owner: owner,blockChainData:global.blockChainData});
    }
  });
};

// Create new owner 
ownerController.create = function(req, res) {
  res.render("../views/owners/create",{blockChainData:global.blockChainData});
};

// Save new owner 
ownerController.save =   function(req, res) {
console.log(req.body);
  var owner = new Owner (req.body);

  owner.save(function(err) {
    if(err) {
      console.log(err);
      res.render("../views/owners/create");
    } else {
      console.log("Successfully created an owner .");

     ///Adding into BlockChain code
     createOwner(req, res,owner._id);


      res.redirect("/owners/show/"+owner._id);
    }
  });
};

// Edit an owner
ownerController.edit = function(req, res) {
  Owner.findOne({_id: req.params.id}).exec(function (err, owner ) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/owners/edit", {owner : owner });
    }
  });
};

// Update an owner
ownerController.update = function(req, res) {
  Owner.findByIdAndUpdate(req.params.id, { $set: { address: req.body.address, companyname: req.body.companyname}}, { new: true }, function (err, owner) {
    if (err) {
      console.log(err);
      res.render("../views/owners/edit", {owner : req.body});
    }
    res.redirect("/owners/show/"+owner ._id);
  });
};

// Delete an owner
ownerController.delete = function(req, res) {
  Owner.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("owner deleted!");
      res.redirect("/owners");
    }
  });
};

module.exports = ownerController;


function  createOwner(req, res,ownerid ){

var address = req.body.address;
var companyname = req.body.companyname;

var oid =  "o"+ownerid; //"m"+rn(options);
console.log('oid '+oid);

var argv =  [oid,address,companyname];  //[oid ,address ,companyname];
console.log('argv'+argv);

	
var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "init_owner";
requestData["args"] = argv;

console.log('parsedata'+JSON.stringify(requestData || null ));

console.log('checking token '+global.Token);

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
    console.log('response data'+body);
    console.log("owner sucessfully created");
    bUtil.getMyBlock(req, res);
     console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));

//     console.log(body.token);
});

}

