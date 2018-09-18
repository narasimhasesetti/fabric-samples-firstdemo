var express = require('express');
var router = express.Router();
var transaction= require("../controllers/TransactionController.js");


// Get all transactions
router.get('/', function(req, res) {
  transaction.list(req, res);
});

// Get single transaction by id
router.get('/show/:id', function(req, res) {
  transaction.show(req, res);
});

// Create transaction
router.get('/create', function(req, res) {
  transaction.create(req, res);
});

// Save transaction
router.post('/save', function(req, res) {
  transaction.save(req, res);
});

// Edit transaction
router.get('/edit/:id', function(req, res) {
  transaction.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req, res) {
  transaction.update(req, res);
});

// Edit update
router.post('/delete/:id', function(req, res, next) {
  transaction.delete(req, res);
});

module.exports = router;
