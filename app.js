'use strict';
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require ('cors');
var fs = require("fs");
var _ = require('underscore');


var services = require ('./nodeServices/services');

module.exports.create = function (server, host, port, publicDir) {
  var app = express();
	
app.use(express.static(publicDir));
app.use(express.static('assets'));
app.use(express.static('bower_components'));

  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
     next();
  }
 });
	
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
	
// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function (req, res) {
 // res.send('hello Nirmal');
    res.sendFile(__dirname + '/index.html');
});


//Vimeo GetData Request APIs

app.get('/initAllVideos',services.initAllVideos);
app.get('/getAllVideos',services.getAllVideos);
app.get('/initVimeoAlbumVideos',services.initVimeoAlbumVideos);

app.get('/getVideosByAlbumID',services.getVideosByAlbumID);
//https://api.vimeo.com/me/albums?page=1&per_page=100&sort=date
app.get('/getAllAlbumsInfo',services.getAllAlbumsInfo);
	
	
	
	
	
app.get('/initArtworkCards',services.initArtworkCards);
		
app.get('/initThreeDProductsList',services.initThreeDProductsList);
			
app.get('/initPrototypeBoardList',services.initPrototypeBoardList);		
	
app.get('/initAttachmentCards',services.initAttachmentCards);		


app.get('/getAllAttachmentsCard',services.getAllAttachmentsCard);
	
app.get('/getgalleryArtworkModel',services.getgalleryArtworkModel);

app.get('/getThreeDProductModel',services.getThreeDProductModel);

app.get('/getAllPrototypeCards',services.getAllPrototypeCards);
	
	
	
//AWS TASKS
app.get('/getListOfBuckets',services.getListOfBuckets);
	
app.post('/uploadToStudioCloud',services.uploadToStudioCloud);

app.post('/createAlbumInBucket',services.createAlbumInBucket);
	
app.post('/getBucketsObjects',services.getBucketsObjects);
app.post('/deleteMultipleObjects',services.deleteMultipleObjects);
app.post('/deleteObjects',services.deleteObjects);
	
	

return app;

};