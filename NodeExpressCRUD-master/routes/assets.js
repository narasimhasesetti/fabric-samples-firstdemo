var express = require('express');
var router = express.Router();
var asset = require("../controllers/AssetController.js");


// Get all assets
router.get('/', function(req, res) {
  asset.list(req, res);
});

// Get single asset by id
router.get('/show/:id', function(req, res) {
  asset.show(req, res);
});

// Create asset
router.get('/create', function(req, res) {
  asset.create(req, res);
});

// Save asset
router.post('/save', function(req, res) {
  asset.save(req, res);
});

// Edit asset
router.get('/edit/:id', function(req, res) {
  asset.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req, res) {
  asset.update(req, res);
});

// Edit update
router.post('/delete/:id', function(req, res, next) {
  asset.delete(req, res);
});

module.exports = router;
