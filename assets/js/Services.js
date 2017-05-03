angularApp.service('Services', function () {
})




angularApp.service('bucketListService',function($https){
	
	this.bucketDetails = function(){
	

        $https.get('getListOfBuckets')
            .then(function (objS) {
               console.log("Data in Params--->" + JSON.stringify(objS));
			return objS;
            }, function (objE) {
				console.log("Error In Service");
            });

      
		
		
	}
 
})


