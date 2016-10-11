var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

/*MongoDB-URL*/
var url = 'mongodb://localhost:27017/mythings';

/* Kotisivu */
router.get('/', function(req, res, next) {
  res.render('index');
});

/*Nouda laitteet tietokannasta*/
router.get('/get-data', function(req, res, next){
	var resultArray = [];

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		var cursor = db.collection('device-data').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {items: resultArray});
		});
	});
});

/*Lisää laite tietokantaan*/
router.post('/insert', function(req, res, next){
	var item = {
		name: req.body.name,
		description: req.body.description,
		latitude: req.body.latitude,
		longitude: req.body.longitude
	};

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('device-data').insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('Item inserted');
			db.close();
		});
	});

	res.redirect('/');
});

/*Päivitä laitteen tiedot*/
router.post('/update', function(req, res, next){
	var item = {
		name: req.body.name,
		description: req.body.description,
		latitude: req.body.latitude,
		longitude: req.body.longitude
	};
	var id = req.body.id;

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('device-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result){
			assert.equal(null, err);
			console.log('Item updated');
			db.close();
		});
	});

	res.redirect('/');
});

/*Poista laite*/
router.post('/delete', function(req, res, next){
	var id = req.body.id;

	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.collection('device-data').deleteOne({"_id": objectId(id)}, function(err, result){
			assert.equal(null, err);
			console.log('Item deleted');
			db.close();
		});
	});
	res.redirect('/');
});


module.exports = router;
