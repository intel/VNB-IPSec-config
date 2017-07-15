var app = angular.module('ems'); 

app.controller('VPNEndpointLocalsiteDetailsController', function($scope, $rootScope, $http, 
                $mdDialog, $mdMedia, $localStorage, ScopeService, $stateParams, 
                ErrMgmtService, LoadDetailsService) {

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.resourceUrl = $localStorage.resourceUrl2;

    //Event to reload data after scope operation
    $rootScope.$on('refresh', function(event) {
        LoadDetailsService.showData($scope, 'vpnendpointlocalsites', $stateParams.id);
    });

    LoadDetailsService.showData($scope, 'vpnendpointlocalsites', $stateParams.id);
    
});
