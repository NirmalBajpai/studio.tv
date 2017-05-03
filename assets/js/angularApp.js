 var angularApp = angular.module('MyApp', ['ngRoute'])

angularApp.config(function ($stateProvider, $urlRouterProvider, $httpsProvider) {
	

    $httpsProvider.interceptors.push('httpModifier');
    $stateProvider
	
	 .state('bucketList', {
            url: '/bucketList',
            controller: 'bucketListCtrl',
            templateUrl: 'templates/bucketlist.html'
        })
	
	
	$urlRouterProvider.otherwise('/bucketList');

});