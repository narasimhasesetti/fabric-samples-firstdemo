var mongoose = require("mongoose");
var Transaction = require("../models/Transaction");
var Asset = require("../models/Asset");
var Owner= require("../models/Owner");

var request = require('request');
var sha = require('sha256');
var bUtil = require("./blockchainutil.js");

var transactionController= {};
// Show list of transactions
transactionController.list = function(req, res) {
  Transaction.find({}).exec(function (err, transactions) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/transactions/index", {transactions: transactions,blockChainData:global.blockChainData,ownersList:global.ownersList});
    }
  });
};

// Show transaction by id
transactionController.show = function(req, res) {
  Transaction.findOne({_id: req.params.id}).exec(function (err, transaction) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/transactions/show", {transaction: transaction,blockChainData:global.blockChainData});
    }
  });
};

// Create new transaction
transactionController.create = function(req, res) {


  Owner.find({}).exec(function (err, owners) {
    if (err) {
      console.log("Error:", err);
    }
    else {

     Asset.find({}).exec(function (err, assets) {
       if (err) {
        console.log("Error:", err);
      }
      else {
          res.render("../views/transactions/create", {assets: assets,owners: owners,blockChainData:global.blockChainData});
      }
    });

    }
  });

};

// Save new transaction
transactionController.save = function(req, res) {
  var transaction = new Transaction(req.body);

  transaction.save(function(err) {
    if(err) {
      console.log(err);
      res.render("../views/transactions/create");
    } else {
  
     createBlockTransaction(req, res,transaction._id);

/*
 Asset.findByIdAndUpdate(req.params.id, { $set: { assetname: req.body.assetname ,    assettype: req.body.assettype,  owner: req.body.owner, }}, { new: true }, function (err, asset) {
    if (err) {
      console.log(err);
      res.render("../views/assets/edit", {asset: req.body});
    }
  });

*/ 
 var forEach = require('async-foreach').forEach;  

   Asset.find({owner:req.body.fromcompany}).exec(function (err, assets) {
	forEach(assets, function(item, index, arr) {
		if(index <req.body.orderedquantity){
		     console.log("  each ", item._id);
		     Asset.findByIdAndUpdate(item._id, { $set: { owner: req.body.tocompany,}}, { new: true }, function (err, asset) {changeOwnerForAsset(item._id,req,res); });
		}	
	});

  });



	
    
     console.log("Successfully created an transaction.");
     res.redirect("/transactions/show/"+transaction._id);
    }
  });
};

// Edit an transaction
transactionController.edit = function(req, res) {
  Transaction.findOne({_id: req.params.id}).exec(function (err, transaction) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/transactions/edit", {transaction: transaction});
    }

  });
};

// Update an transaction
transactionController.update = function(req, res) {
  Transaction.findByIdAndUpdate(req.params.id, { $set: { fromcompany: req.body.fromcompany, tocompany: req.body.tocompany, fromlocation: req.body.fromlocation, tolocation: req.body.tolocation, asset: req.body.asset,assettype: req.body.assettype,orderedquantity: req.body.orderedquantity, returnquantity: req.body.returnquantity,ordereddate: req.body.ordereddate,returndate: req.body.returndate,}}, { new: true }, function (err, transaction) {
    if (err) {
      console.log(err);
      res.render("../views/transactions/edit", {transaction: req.body});
    }
    res.redirect("/transactions/show/"+transaction._id);
  });
};

// Delete an transaction
transactionController.delete = function(req, res) {
  Transaction.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Transactiondeleted!");
      res.redirect("/transactions");
    }
  });
};

module.exports = transactionController;




function  changeOwnerForAsset(assetId,req, res ){
//console.log(req);
var aid =  "a"+assetId;
var oldowner = "o"+req.body.fromcompany;
var newowner = "o"+req.body.tocompany;
var orderedquantity = req.body.orderedquantity;

console.log('aid '+aid );
var argv = [aid,newowner,orderedquantity];

console.log('argv'+argv);

var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "set_owner";
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
    console.log(body);
//     console.log(body.token);
});
}




function  changeQuantityForAsset(req, res ){
//console.log(req);
var aid =  "a"+req.body.asset;
var oldowner = "o"+req.body.fromcompany;
var newowner = "o"+req.body.tocompany;
var orderedquantity = req.body.orderedquantity;

console.log('aid '+aid );
var argv = [aid,newowner,orderedquantity];

console.log('argv'+argv);

var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "set_owner";
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
    console.log(body);
//     console.log(body.token);
});
}

function  createBlockTransaction(req, res,transId ){

//console.log(req);
var tid =  "T"+transId ;
var fromcompany = req.body.fromcompany;
var tocompany = req.body.tocompany;
var assetname = "m"+req.body.asset;
var transactiontype = req.body.transactiontype;
var orderquantity = req.body.orderedquantity;
var orderdate = req.body.ordereddate;

var argv = [tid,fromcompany,tocompany,assetname,transactiontype,orderquantity,orderdate];
 	
console.log('argv'+argv);

var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "init_order";
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
    console.log('create transaction response'+body);
bUtil.getMyBlock(req, res);
     console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));
 

//     console.log(body.token);
});

}

function  createNewDynamicAsset(req, res) {


  Asset.findOne({_id: req.body.asset}).exec(function (err, old_asset) {
  if (err) {
      console.log("Error:", err);
 }
  else {
           var new_carData = {};
           new_carData['assetname'] = old_asset.assetname
           new_carData['assettype'] = old_asset.assettype
           new_carData['assetquantity'] = req.body.orderedquantity;
           new_carData['owner'] = req.body.tocompany;
           var new_asset = new Asset(new_carData);
            new_asset.save(function(err) {
 		if(err)
 {
		    console.log(err);
		} else {
		     console.log("Successfully  created new asset in DB.");
		     createBlockAsset(req,res,new_carData,new_asset._id)
		}
            });
  }
  });
}




function  createBlockAsset(req,res,new_carData,assetid ){

var  assetname = new_carData.assetname;
var assettype = new_carData.assettype;
var assetquantity = new_carData.assetquantity;

var ownerno = "o"+new_carData.owner;
var owner = "united marbles";


var options = {
  min: 80000000,
  max: 90000000,
 integer: true
}

var aid =  "a"+assetid; //"m"+rn(options);
console.log('aid '+aid );
console.log('assetname '+assetname );
console.log('assettype '+assettype);
console.log('assetquantity'+assetquantity);


var argv = [aid,assetname,assettype,assetquantity,ownerno];
console.log('argv'+argv);
	
var requestData = {};
requestData["peers"] =  ["peer0.org1.example.com","peer1.org1.example.com"];
requestData["fcn"] = "init_marble";
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
    console.log(body);
    bUtil.getMyBlock(req, res);
    console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));


//     console.log(body.token);
});
 

}


