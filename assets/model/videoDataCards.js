'use strict';
 /*var asyn=require("async");*/
var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/* User schema */

var videoDataCardSchema = new Schema({

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

 width:{
    	type:Array,
    	trim:true
 },

 language:{
    type:String,
    trim:true
},
	
	
 height:{
    	type:String,
    	trim:true
},
	
 embed:{
},

 created_time:{
    type:Array,
    trim:true
 },

 modified_time:{
    type:String,
    trim:true
},

 release_time:{
        type:String,
        trim:true
    },
	
 content_rating:[

 ],
	
 license:{
        type:String,
        trim:true
    },
 privacy:{
    },
	
pictures:{
 },


 tags:[
 {

 }

],

 stats:{

 },

 metadata:{
	 
},

 user:{
	 
},
	

 files:[

 
 ],
	
 app:{
   
 },
	
status:{
    type:String,
    trim:true
    },
	
resource_key:{
    type:Array,
    trim:true
    },
	
	
 embed_presets:{

 }

}); 

var videoDataCard = mongoose.model('videodatacard', videoDataCardSchema);

module.exports = videoDataCard;
