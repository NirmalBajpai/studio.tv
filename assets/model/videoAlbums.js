'use strict';
 /*var asyn=require("async");*/
var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/* User schema */

var videoAlbumCollection = new Schema({

uri:{
 	type:String,
	trim:true
},

 name:{
    	type:String,
    	trim:true
    },
	
 description:{
    	type:String,
    	trim:true
    },
	
 link:{
    	type:String,
    	trim:true
    },
	
 duration:{
    	type:String,
    	trim:true
 },


 created_time:{
    type:Array,
    trim:true
 },

 modified_time:{
    type:String,
    trim:true
},
	
user:{
		
	},
	
 privacy:{
    },
	
pictures:{
 },

 metadata:{
	 
},

data:[

]

}); 

var videoAlbums = mongoose.model('videoalbums', videoAlbumCollection);

module.exports = videoAlbums;
