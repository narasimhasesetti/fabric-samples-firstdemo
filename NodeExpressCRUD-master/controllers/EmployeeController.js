var mongoose = require("mongoose");
var Employee = require("../models/Employee");
var request = require('request');
//var bUtil = require("./blockchainutil.js");
var sha = require('sha256');
var bUtil = require("./blockchainutil.js");

global.empCount = 0;


var employeeController = {};

// Show list of employees
employeeController.list = function(req, res) {
  Employee.find({}).exec(function (err, employees) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/index", {employees: employees,blockChainData:global.blockChainData});
    }
  });
};

// Show employee by id
employeeController.show = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/show", {employee: employee,blockChainData:global.blockChainData});
    }
  });
};




// Create new employee
employeeController.create = function(req, res) {
  res.render("../views/employees/create",{blockChainData:global.blockChainData});
};

// Save new employee
employeeController.save =   function(req, res) {
console.log(req.body);
  var employee = new Employee(req.body);

  employee.save(function(err) {
    if(err) {
      console.log(err);
      res.render("../views/employees/create,");
    } else {
      console.log("Successfully created an employee.");

     ///Adding into BlockChain code
     createBlockUser(req, res);
     
     setTimeout(function(str1, str2) {
		  console.log(str1 + " " + str2);
	

     }, 1000, "Hello.", "How are you?");

     

      res.redirect("/employees/show/"+employee._id);
    }
  });
};

// Edit an employee
employeeController.edit = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/edit", {employee: employee});
    }
  });
};

// Update an employee
employeeController.update = function(req, res) {
  Employee.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, address: req.body.address,department: req.body.department,organization: req.body.organization, position: req.body.position, salary: req.body.salary }}, { new: true }, function (err, employee) {
    if (err) {
      console.log(err);
      res.render("../views/employees/edit", {employee: req.body});
    }
    res.redirect("/employees/show/"+employee._id);
  });
};

// Delete an employee
employeeController.delete = function(req, res) {
  Employee.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Employee deleted!");
      res.redirect("/employees");
    }
  });
};
// Show employee by email
employeeController.login = function(req, res) {
       res.render("../views/employees/login" );
};



// Show employee by id
employeeController.logincheck = function(req, res) {
  Employee.findOne({email: req.params.email}).exec(function (err, employee) {

    if (err) {
     console.log("Error:", err);
   }
    else {
      console.log("employee:", employee);
      res.render("../views/employees/login", {employee: employee});
    }
  });
};




module.exports = employeeController;

function createBlockUser  (req, res) {

var requestData = {
   username:req.body.name,
   orgName:'Org1'
} 

var data = {
    url: "http://172.16.40.170:4000/users",
    json: true,
    headers: {'Content-Type': 'application/json'},
    body: JSON.parse(JSON.stringify(requestData || null ))
}

request.post(data, function(error, httpResponse, body){
    //console.log(body);
     console.log(body.token);
     global.Token = body.token; 
	if(global.empCount == 0){
      	  bUtil.getMyBlock(req, res);
	  bUtil.getMyBlock(req, res);
	 }
global.empCount  = global.empCount + 1;
       console.log('blockGlobData'+JSON.stringify( global.blockChainData, null, 4));

//     console.log(body.token);





});
return 1;


};
