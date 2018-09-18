var express = require('express');
var router = express.Router();
var owner = require("../controllers/OwnerController.js");

// Get all owners
router.get('/', function(req, res) {
  owner.list(req, res);
});
// Get single owner by id
router.get('/show/:id', function(req, res) {
  owner.show(req, res);
});

// Create owner
router.get('/create', function(req, res) {
  owner.create(req, res);
});

// Save owner
router.post('/save', function(req, res) {
  owner.save(req, res);
});

// Edit owner
router.get('/edit/:id', function(req, res) {
  owner.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req, res) {
  owner.update(req, res);
});

// Edit update
router.post('/delete/:id', function(req, res, next) {
  owner.delete(req, res);
});

module.exports = router;
