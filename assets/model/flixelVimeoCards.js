'use strict';
 /*var asyn=require("async");*/
var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

/* User schema */

var loopCardSchema = new Schema({

id:{
 	type:String
},

 name:{
    	type:String,
    	trim:true
    },
 desc:{
    	type:String,
    	trim:true
    },
 idBoard:{
    	type:String,
    	trim:true
    },
idList:{
    	type:String,
    	trim:true
    },

idLabels:{
    	type:Array,
    	trim:true
    },

    closed:{
    type:String,
    trim:true
},

 url:{
    	type:String,
    	trim:true
    },

  idChecklists:{
    type:Array,
    trim:true
  },

labels:[
{
    id:{
        type:String,
        trim:true
    },
    idBoard:{
        type:String,
        trim:true
    },
    name:{
        type:String,
        trim:true
    },
    color:{
        type:String,
        trim:true
    },
    uses:{
        type:String,
        trim:true
    }
}

],

shortUrl:{
    type:String,
    trim:true
},


shopifyId:{
    type:String,
    trim:true
},

sketchfabModelId:{
    type:String,
    trim:true
},

videoId:{
	type:String,
	trim:true
},

loopId:{
	type:String,
	trim:true
},

tourId:{
	type:String,
	trim:true
},
	
attachments:[
{
    id:{
    type:String,
    trim:true
    },
    bytes:{
    type:String,
    trim:true
    },
    date:{
    type:String,
    trim:true
    },
    edgeColor:{
    type:String,
    trim:true
    },
    idMember:{
    type:String,
    trim:true
    },
    isUpload:{
    type:String,
    trim:true
    },
    mimeType:{
    type:String,
    trim:true
    },
    name:{
    type:String,
    trim:true
    },
    previews:{
    type:Array,
    trim:true
    },
    url:{
    type:String
    }
}
],

}); 


var loopCards = mongoose.model('loops', loopCardSchema);

module.exports = loopCards;
