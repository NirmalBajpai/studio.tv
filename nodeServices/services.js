'use strict';
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require ('cors');
var fs = require("fs");
var _ = require('underscore');
var async = require('async');
var AWS = require('aws-sdk');
 var multer = require('multer');
 var dest = multer.memoryStorage();
 var upload = multer({
     dest: 'uploads/'
 });

var _config = require('../config/config');
var loopCards = require('../assets/model/flixelVimeoCards');
var threeDCards = require('../assets/model/threeDProductsCard');
var artworkCards = require('../assets/model/artworkCards');
var prototypeCards = require('../assets/model/prototypeCards');
var videoDataCard = require('../assets/model/videoDataCards');
var videoalbm = require('../assets/model/videoAlbums');

mongoose.connect('mongodb://localhost/studiotrellodatabase');
mongoose.Promise = global.Promise;
	
//Trello Module Initialization
	var Trello = require("node-trello");
	var _ = require("underscore");
	var apiKey = "08757b5bac71e025b2f677edd8f4f5af";
	var token = "142bded1ebf1ab1fef0e726bdbfc804a95fc1d87e0cae61411085da7bc983c7c";
	var t = new Trello(apiKey, token);

//Vimeo Initializations

var Vimeo = require('vimeo').Vimeo;
var lib = new Vimeo('dad83e657c4cba361375610a6dad1065e8a3580a', 'DIfsQSZXdEiq3ISlBlXIGaaeV/eMXr5mGrhU0WWNhe9a6Zt/+CXj9+RKqE29wBhCfSO883qGPpX1Zq1o2HnQ4GKSpQuC/vq2b+r/GqR4svcmdFKXk3Nur+srEmb2qdhm', 'ba30be58764601d492043e72d41d46a1');


//config AWS
     AWS.config.update({accessKeyId:_config.aws_access_key_id, 
						secretAccessKey:_config.aws_secret_access_key});
	var s3 = new AWS.S3();


/*Response: */
/*Description:*/
/*Request:  */

					/*  %%%%%%% All Get Data Methods API %%%%%% */

/*Response: Cards Sketchfab Model Id and Description  */
/*Description: Use Store Board Bata and 3 Lists */
/*Request:Get CardId from Url String  */
module.exports.getThreeDProductModel = function(req,res,next){
    var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
	//console.log(queryURL.query);
	//res.send("Hello");
	
	threeDCards.find({
		shopifyId:urlparams

	}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			console.log(results[0]);
			if(results[0]){
			
				var result = [];
			    result[0] = results[0].sketchfabModelId;
				result[1] = results[0].desc;
				
				res.send(				
			  result
			);
			
			}else
			res.send("No model Exists");
		}
	});
}


/*Response:Array of Model typeForm Id Dimension and Availabilty of Gallery Cards */
/*Description:Use Gallery Board Three Lists Drawing, Paintings and Sclupture */
/*Request: CardID */
module.exports.getgalleryArtworkModel = function(req,res,next){
    var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
	//console.log(queryURL.query);
	//res.send("Hello");                 	
	artworkCards.find({
		shopifyId:urlparams
	}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			console.log(results[0]);
			if(results[0]){
				var result = [];
			    result[0] = results[0].sketchfabModelId;
				result[1] = results[0].availablityStatus;
				result[2] = results[0].dimensions;
				result[3] = results[0].typeFormId;
				res.send(				
			  result
			);
			}else
			res.send("No model Exists");
		}
	});
}


/*Response: name , Desc, Attachments Of Card*/
/*Description: Use Store Board and Collection List*/
/*Request: Url Only */
module.exports.getAllAttachmentsCard = function(req,res,next){
	threeDCards.find({idList:"58a8051addc1fa8d519533a0"},{name:1,tourId:1,desc:1}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			res.send(
				results
			);		
		}
	});	
}

/*Response: Model Id of all Cards Of Prototype Board*/
/*Description: Prototype Board Use PrototypeCards Collection */
/*Request: Only Url */
module.exports.getAllPrototypeCards = function(req,res,next){
		prototypeCards.find({
			sketchfabModelId:{$exists:true}
	}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			if(results.length>0){
		var resultsModel = [];
		console.log(results[0]);
			for(var i=0; i<results.length;i++)
				{
					console.log("I Ki Value",i);
					resultsModel.push(results[i].sketchfabModelId);
				}
			res.send(				
				results
			);			
			}else
			res.send("No model Exists");
			}
		}
	);
}


					/* %%%%%% All Data Initialization methods API %%%%% */


/*Response: Confirmation Of Initialization*/
/*Description:Call createUrlForGalleryPluginData()\ artworkCardsdata Collection */
/*Request: Url With List Id of Gallery Board */
module.exports.initArtworkCards = function(req,res,next){
	var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
	var listData = [];
	artworkCards.find({
				idList:urlparams
	}).remove().exec(function(err,results){
		if (err) {
			res.send({
				responseCode:405,responseMessage:'Internal Server Error'
			});
		}
		else{
	var urlStrHead = "1/lists/";
	var urlStrTail = "/cards";
	var listUrl = "";
		listUrl = urlparams;
	var finalUrl = urlStrHead.concat(listUrl,urlStrTail);
			
	t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}	listData = data;
	for(var i =0; i < listData.length;i++){
					var idfs = listData[i];
					var idf = idfs.id;
					var artworkCardsdata = new artworkCards(listData[i]);
		//console.log(artworkCardsdata);
                     artworkCardsdata.save(function(err,artworkCardsdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
						var threeDc = artworkCardsdata.id;
		//console.log(threeDc);
				        createUrlForGalleryPluginData(threeDc);
		               });
	      	}
			res.send("Nirmal");
    });
		};
});
	
}


/*Response: Confermation Message On Success*/
/*Description: Init Store Board Lists\ Use Products Collection \ createUrlForCardsPluginData()\ */
/*Request: List Id in Url Parameter */
module.exports.initThreeDProductsList = function(req,res,next){
	var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
    var listData = [];
	threeDCards.find({
			idList:urlparams
	}).remove().exec(function(err,results){
		if (err) {
			res.send({
				responseCode:405,responseMessage:'Internal Server Error'
			});
		}
		else{
	var urlStrHead = "1/lists/";
	var urlStrTail = "/cards";
	var listUrl = "";
	listUrl = urlparams;
	var finalUrl = urlStrHead.concat(listUrl,urlStrTail);
	t.get(finalUrl,function(error,data){
		if(error) {
			console.log(error);
			return;
		}
	listData = data;
	console.log(listData);			
	for(var i =0; i < listData.length;i++){
					var idfs = listData[i];
					var idf = idfs.id;
		            console.log(idfs);
					var threeDCardsdata = new threeDCards(listData[i]);
                     threeDCardsdata.save(function(err,threeDCardsdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
						var threeDc = threeDCardsdata.id;
						console.log(threeDc);
				        createUrlForCardsPluginData(threeDc,'threeDCards');
		               });
	      	}
			res.send("Nirmal");
    });	
		};
});
}


/*Response: Confermation Message On Success*/
/*Description:Init Prototype Lists of Prototype Board Use createUrlPrototypeCardsPluginData()\ And createUrlPrototypeCardListName()\ */
/*Request: List Id in Url*/
module.exports.initPrototypeBoardList = function(req,res,next){
	var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);
    var listData = [];
	prototypeCards.find({
				idList:urlparams
	}).remove().exec(function(err,results){
		if (err) {
			res.send({
				responseCode:405,responseMessage:'Internal Server Error'
			});
		}
		else{			
	var urlStrHead = "1/lists/";
	var urlStrTail = "/cards";
	var listUrl = "";
		listUrl = urlparams;
	var finalUrl = urlStrHead.concat(listUrl,urlStrTail);
	t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}	listData = data;
	console.log(listData);			
	for(var i =0; i < listData.length;i++){
					var idfs = listData[i];
					var idf = idfs.id;
		            console.log(idfs);
					var prototypeCardsdata = new prototypeCards(listData[i]);
		console.log(prototypeCardsdata);
                     prototypeCardsdata.save(function(err,prototypeCardsdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
						var threeDc = prototypeCardsdata.id;
						console.log(threeDc);
				        createUrlPrototypeCardsPluginData(threeDc);
						createUrlPrototypeCardsListName(threeDc);
		               });
	      	}
			res.send("Nirmal");
    });	
		};
});	
}


/*Response: Conf Message On Success*/
/*Description:Call createUrlAttachmentCards() And Use PrototypeCardDataCollection */
/*Request:Collection List id */
module.exports.initAttachmentCards = function(req,res,next){
	var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);	
    var listData = [];
	console.log("called");	
	prototypeCards.find({
				idList:urlparams
	}).remove().exec(function(err,results){
		if (err) {
			res.send({
				responseCode:405,responseMessage:'Internal Server Error'
			});
		}
		else{
	var urlStrHead = "1/lists/";
	var urlStrTail = "/cards";
	var listUrl = "";
		listUrl = urlparams;
	var finalUrl = urlStrHead.concat(listUrl,urlStrTail);
	t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}	listData = data;
	console.log(listData);			
	for(var i =0; i < listData.length;i++){
					var idfs = listData[i];
					var idf = idfs.id;
		            console.log(idfs);
					var prototypeCardsdata = new prototypeCards(listData[i]);
		console.log(prototypeCardsdata);
                     prototypeCardsdata.save(function(err,prototypeCardsdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
						var threeDc = prototypeCardsdata.id;
						console.log(threeDc);
						 createUrlAttachmentCards(threeDc)
		               });
	      	}
			res.send("Nirmal");
    });	
		};
});
}



//Functions For Second API Call

/*Store Board ( Three D Products)*/
function createUrlForCardsPluginData(cardIdurl,dbCards){
	
  var mainurlStr = "/1/cards/";
  var pluginUrl = "/pluginData"; 
  var finalUrl = mainurlStr.concat(cardIdurl,pluginUrl);
console.log(finalUrl);
t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}
   console.log(data);
	if (data != null) {
		var object = data[0];
		console.log(object);
		if (object && cardIdurl) {
            var value =JSON.parse(object["value"]);
            //console.log(value);
            var fields = value['fields'];
            //console.log(fields);
            var shopId = fields["kP3mrs3R-Gng3mL"];
			var modelId = fields["kP3mrs3R-GwSvjt"];
			var loopId = fields["kP3mrs3R-TlBBNc"];
			var videoId = fields["kP3mrs3R-kDZv2J"];
			var tourId = fields["kP3mrs3R-rpVwnl"];
            var typeForm = fields["kP3mrs3R-rpVwnl"];

			console.log("shopId",shopId);
			console.log("modelId",modelId);
			console.log("loop",loopId);
			console.log("video",videoId);
			console.log("tour",tourId);	
			console.log("typeForm",typeForm);
			
if(dbCards == "threeDCards"){
	threeDCards.findOneAndUpdate({id: cardIdurl}, {$set:{shopifyId:shopId,sketchfabModelId:modelId, videoId:videoId,tourId:tourId,loopId:loopId}}, {new: true}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
	});		}
if(dbCards == "artworkCards"){
	artworkCards.findOneAndUpdate({id: cardIdurl}, {$set:{shopifyId:shopId,sketchfabModelId:modelId, videoId:videoId,tourId:tourId,loopId:loopId}}, {new: true}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
	});	 }
						
if(dbCards == "prototypeCards"){
	prototypeCards.findOneAndUpdate({id: cardIdurl}, {$set:{sketchfabModelId:modelId,typeFormId:typeForm}}, {new: true}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
	});		}		
		};
	};
});
}


function createUrlPrototypeCardsPluginData(cardIdurl){
  var mainurlStr = "/1/cards/";
  var pluginUrl = "/pluginData"; 
  var finalUrl = mainurlStr.concat(cardIdurl,pluginUrl);
console.log(finalUrl);
t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}
   console.log(data);
	if (data != null) {
		var object = data[0];
		if (object && cardIdurl) {
            var value =JSON.parse(object["value"]);            
            var fields = value['fields'];
			var modelId = fields["kP3mrs3R-GwSvjt"];
            var typeForm = fields["kP3mrs3R-TlBBNc"];
		console.log("modelId",modelId);
		console.log("typeForm",typeForm);	
 prototypeCards.findOneAndUpdate({id: cardIdurl}, {$set:{sketchfabModelId:modelId,typeFormId:typeForm}}, {new: true}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
});	
		};
	};
});
}


function createUrlPrototypeCardsListName(cardIdurl){
//	https://api.trello.com/1/cards/58a4244406b7e020a03ab491/list?fields=all&key=08757b5bac71e025b2f677edd8f4f5af&token=c28f5f9dad9753487f65676b63dcd86601a736cc71dc396ad7ae2a20de4e4c20
  var mainurlStr = "/1/cards/";
  var list = "/list"; 
  var finalUrl = mainurlStr.concat(cardIdurl,list);	
  t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}
	if (data != null) {
	var listNameis = data['name'];
		prototypeCards.findOneAndUpdate({id: cardIdurl}, {$set:{nameList:listNameis}}, {new: true}, function(error, doc){
    	if(error){
        	console.log("Something wrong when updating data!");
    	};
    	console.log(doc);
		console.log("Hello Updated");
		});		
		};
  	});	
}


function createUrlAttachmentCards(cardIdurl){
  var mainurlStr = "/1/cards/";
  var pluginUrl = "/attachments"; 
  var finalUrl = mainurlStr.concat(cardIdurl,pluginUrl);
console.log(finalUrl);
t.get(finalUrl,function(error,data){
if(error) {
			console.log(error);
			return;
		}
	if (data != null) {
		for(var i = 0; i< data.length ; i++){
		var object = data[i];
		console.log(object['id']);
		if (object && cardIdurl){
	prototypeCards.findOneAndUpdate({id: cardIdurl}, {$push:{attachments:object}}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
	console.log("Hello Updated"); 
      });	
    };
   }
 };
});
}

function createUrlForGalleryPluginData(cardIdurl){
  var mainurlStr = "/1/cards/";
  var pluginUrl = "/pluginData"; 
  var finalUrl = mainurlStr.concat(cardIdurl,pluginUrl);
	t.get(finalUrl,function(error,data){
		if(error) {
			console.log(error);
			return;
		}
		if (data != null) {
		var object = data[0];
		if (object && cardIdurl) {
            var value =JSON.parse(object["value"]);
            var fields = value['fields'];
            var shopId = fields["kP3mrs3R-Gng3mL"];
			var modelId = fields["kP3mrs3R-GwSvjt"];
            var typeForm = fields["kP3mrs3R-rpVwnl"];
            var size = fields["kP3mrs3R-kDZv2J"];
			var original = fields["jLa1QVZL-NiKBpT"];
			var availability = "" ;
	 	if (original == "TolYf1"){availability = "On Consignment"}
		if (original == "05ERPu"){availability = "Available"}
		if (original == "8x0Cxz"){availability = "Sold"}

console.log("shopId",shopId);
console.log("modelId",modelId);
console.log("Original",original);
console.log("availability",availability);
console.log("size",size);	
console.log("typeForm",typeForm);	
	artworkCards.findOneAndUpdate({id: cardIdurl}, {$set:{shopifyId:shopId,sketchfabModelId:modelId, dimensions:size,typeFormId:typeForm,availablityStatus:availability}}, {new: true}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
	console.log("Hello Updated");
});			
		};
	};
});	
}






module.exports.initVimeoAlbumVideos = function(req,res,next){
	var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);
	var uriPre = "/users/2829553/albums/";
	var albumUri = uriPre.concat(urlparams);
	console.log(urlparams);	
    var listData = [];
	console.log("called");	
	videoalbm.find({
				uri:albumUri
	}).remove().exec(function(err,results){
		if (err) {
			res.send({
				responseCode:405,responseMessage:'Internal Server Error'
			});
		}
		else{
			var urlPath = "me/albums/"
			var path = urlPath.concat(urlparams);
			
			lib.request({
        // This is the path for the videos contained within the staff picks channels
	 path : path,
        query : {
            per_page : 100,

        }
    }, function (error, body, status_code, headers) {
        if (error)  {
            console.log('error');
            console.log(error);
        } else {
          //  console.log('body');
           console.log(body);

		
			var videoalbmdata = new videoalbm(body);
                videoalbmdata.save(function(err,videoalbmdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
						updateVideoDataInAlbum(path,videoalbmdata.uri);

		//				var threeDc = videoDataCard.id;
		//                console.log(threeDc);
		//		        createUrlForGalleryPluginData(threeDc);
		               });
			
			res.send("Nirmal");
        }

  //      console.log('status code');
  //      console.log(status_code);
  //      console.log('headers');
  //      console.log(headers);
    });
					
	};
		
});
	
}


function updateVideoDataInAlbum(albumId,uri){
	var urlpath = albumId.concat("/videos");
	console.log(urlpath);
	lib.request({
        // This is the path for the videos contained within the staff picks channels
	 path : urlpath,
        query : {
            per_page : 100,
        }
    }, function (error, body, status_code, headers) {
        if (error)  {
            console.log('error');
            console.log(error);
        } else {
          //  console.log('body');
   //        console.log(body);

           var videoData = [];
           videoData = body.data;
           var dataArray = [];
	for(var i =0; i < videoData.length;i++){
		
					var videodata = new videoDataCard(videoData[i]);
		               dataArray.push(videoData);
//                     videodata.save(function(err,videodata,numAffected){
//			            if(err)
//				        console.log("Not Inserted",err);
//			            else
//				        console.log("Inserted");
//		               });
	      	}
					
		console.log(uri);
		videoalbm.findOneAndUpdate({uri: uri}, {$set:{data:videoData}}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
	});	
  }
  //      console.log('status code');
  //      console.log(status_code);
  //      console.log('headers');
  //      console.log(headers);
    });
	
}

//Vimeo APIs And Methods
//https://api.vimeo.com/videos?page=1&per_page=100&sort=date

module.exports.initAllVideos = function(req,res,next){

 lib.request({
        // This is the path for the videos contained within the staff picks channels
	 path : 'me/albums/4509205',
        query : {
            per_page : 100,

        }
    }, function (error, body, status_code, headers) {
        if (error)  {
            console.log('error');
            console.log(error);
        } else {
          //  console.log('body');
           console.log(body);

           var videoData = [];
           videoData = body.data;

	for(var i =0; i < videoData.length;i++){
		
					var videoalbmdata = new videoalbm(videoData[i]);
                     videoalbmdata.save(function(err,videoalbmdata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
		//				var threeDc = videoDataCard.id;
		//                console.log(threeDc);
		//		        createUrlForGalleryPluginData(threeDc);
		               });
	      	}
			
			updateRequest();
			
			res.send("Nirmal");
        }

  //      console.log('status code');
  //      console.log(status_code);
  //      console.log('headers');
  //      console.log(headers);
    });
}

function updateRequest()
{
	
	
lib.request({
        // This is the path for the videos contained within the staff picks channels
	 path : '/albums/4509205/videos',
        query : {
            per_page : 100,

        }
    }, function (error, body, status_code, headers) {
        if (error)  {
            console.log('error');
            console.log(error);
        } else {
          //  console.log('body');
           console.log(body);

           var videoData = [];
           videoData = body.data;
           var dataArray = [];
	for(var i =0; i < videoData.length;i++){
		
//					var idfs = videoData[i];
//					var idf = idfs.id;
//				    console.log(videoData[i]);

					var videodata = new videoDataCard(videoData[i]);
		              dataArray.push(videoData);
		
		
//		        console.log(videoDataCardObj);
                     videodata.save(function(err,videodata,numAffected){
			            if(err)
				        console.log("Not Inserted",err);
			            else
				        console.log("Inserted");
		//				var threeDc = videoDataCard.id;
		//                console.log(threeDc);
		//		        createUrlForGalleryPluginData(threeDc);
		               });
	      	}
			
			var Lname = "DIY Projects"
		
		
		videoalbm.findOneAndUpdate({name: Lname}, {$set:{data:videoData}}, function(error, doc){
    if(error){
        console.log("Something wrong when updating data!");
    };
    console.log(doc);
	console.log("Hello Updated");
	});	
		
//			res.send("Nirmal");
        }

  //      console.log('status code');
  //      console.log(status_code);
  //      console.log('headers');
  //      console.log(headers);
    });
}



/*Request: CardID */
module.exports.getAllVideos = function(req,res,next){
    var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
	//console.log(queryURL.query);
	//res.send("Hello");                 	
	videoDataCard.find({
	}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			if(results[0]){
				res.send(				
			  results
			);
			}else
			res.send("No model Exists");
		}
	});
}



module.exports.getVideosByAlbumID = function(req,res,next){
    var url = require('url');
    var queryURL = url.parse(req.url, true);
    var urlparams;
	urlparams = queryURL.search.substr(1);	
	console.log(urlparams);
	
	var baseUri ="/users/2829553/albums/";
	var uriFinal = baseUri.concat(urlparams);
	console.log(uriFinal);
	//res.send("Hello");                 	
	videoalbm.find({
		uri:uriFinal
	}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			console.log(results[0]);
			if(results){
				//var result = [];
			  //  result[0] = results[0].sketchfabModelId;
			//	result[1] = results[0].availablityStatus;
			//	result[2] = results[0].dimensions;
			//	result[3] = results[0].typeFormId;
				res.send(				
			  results
			);
			}else
			res.send("No Album Exists");
		}
	});
}
//  /users/2829553/albums/4509179

module.exports.getAllAlbumsInfo = function(req,res,next){
	
		videoalbm.find({},{
data:0
		}).exec(function(err,results){
		if(err){
			res.send({
				responseCode:400
			});
		}
		else{
			console.log(results[0]);
			if(results){
			//var result = [];
			//  result[0] = results[0].sketchfabModelId;
			//	result[1] = results[0].availablityStatus;
			//	result[2] = results[0].dimensions;
			//	result[3] = results[0].typeFormId;
				res.send(				
			  results
			);
			}else
			res.send("No Album Exists");
		}
	});
	
}



//AWS Services Modules

module.exports.uploadToStudioCloud = function(req,res,next){

	         var data="";
	
	  if(!(req.body.photo===undefined || req.body.photo=="")){             
                     var img_base64 = req.body.photo;
                     binaryData = new Buffer(img_base64, 'base64');
                     require("fs").writeFile("test.jpeg", binaryData, "binary", function (err) {
                         console.log(err);
                     });
		  
		  
		    var s3 = new AWS.S3();
            var s3_param = {
               Bucket: 'studiodatabucket',
               Key: req.file.originalname,
               Expires: 60,
               ContentType: req.file.mimetype,
               ACL: 'public-read',
               Body: fileBuffer
            };
            s3.putObject(s3_param, function(err, data){
               if(err){
                  console.log(err);
               } else {
                var return_data = {
                   signed_request: data,
                   url: 'https://studiodatabucket.s3.amazonaws.com/'+req.file.originalname
                   
                }; 
                console.log('return data - ////////// --------------');
                console.log(return_data);
                 return res.render('upload', {data : return_data, title : 'Upload Image : success', message : { type: 'success', messages : [ 'Uploaded Image']}});
                
               }
            });
      }
}

module.exports.getListOfBuckets = function(req,res,next){
	
	s3.listBuckets(function(err, data) {
  if (err)
	  console.log(err, err.stack); // an error occurred
  else 
	  console.log(data);           // successful response
});
	console.log("Hello List of Buckets");
	res.send(date);	
	
}


module.exports.createAlbumInBucket = function(req,res,next){
	
	function createAlbum(albumName) {
  albumName = albumName.trim();
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.');
  }
  if (albumName.indexOf('/') !== -1) {
    return alert('Album names cannot contain slashes.');
  }
  var albumKey = encodeURIComponent(albumName) + '/';
		
  s3.headObject({Key: albumKey}, function(err, data) {
    if (!err) {
      return alert('Album already exists.');
    }
    if (err.code !== 'NotFound') {
      return alert('There was an error creating your album: ' + err.message);
    }
    s3.putObject({Key: albumKey}, function(err, data) {
      if (err) {
        return alert('There was an error creating your album: ' + err.message);
      }
      alert('Successfully created album.');
      viewAlbum(albumName);
    });
  });
}
}




module.exports.getBucketsObjects = function(req,res,next){

  var params = {
  Bucket: 'STRING_VALUE', /* required */
  Delimiter: 'STRING_VALUE',
  EncodingType: url,
  Marker: 'STRING_VALUE',
  MaxKeys: 0,
  Prefix: 'STRING_VALUE',
  RequestPayer: requester
};
	
s3.listObjects(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});	

}

module.exports.deleteObjects = function(req,res,next){
	
	var params = {
  Bucket: 'STRING_VALUE', /* required */
  Key: 'STRING_VALUE', /* required */
  MFA: 'STRING_VALUE',
  RequestPayer: requester,
  VersionId: 'STRING_VALUE'
};
s3.deleteObject(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
	
}

module.exports.deleteMultipleObjects = function(req,res,next){
	var params = {
  Bucket: 'STRING_VALUE', /* required */
  Delete: { /* required */
    Objects: [ /* required */
      {
        Key: 'STRING_VALUE', /* required */
        VersionId: 'STRING_VALUE'
      },
      /* more items */
    ],
    Quiet: true || false
  },
  MFA: 'STRING_VALUE',
  RequestPayer: requester
};
s3.deleteObjects(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response

});
}