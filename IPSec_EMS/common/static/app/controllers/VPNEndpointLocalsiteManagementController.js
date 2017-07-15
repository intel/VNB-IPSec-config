
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('VPNEndpointLocalsiteManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'VPN Endpoint Localsite';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpnendpointlocalsites';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createVPNEndpointLocalsiteDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_vpnendpoint_localsite.html');
    }

    $scope.updateVPNEndpointLocalsite = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_vpnendpoint_localsite.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateVPNEndpointLocalsiteController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService, LoadService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

      $scope.cidrs = $scope.cidrs.split(",");

       var data = {
         name: $scope.scope_name,
         cidrs: $scope.cidrs,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       CreateService.create($scope, data, 'vpnendpointlocalsites');
    };
});

app.controller('UpdateVPNEndpointLocalsiteController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, LoadService, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var vpnendpointlocalsites_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');
    LoadDetailsService.showData($scope, 'vpnendpointlocalsites', vpnendpointlocalsites_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.cidrs = $scope.detailed_scope.cidrs;
      $scope.vpncertificate_id = $scope.detailed_scope.vpncertificate_id;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

      $scope.cidrs = $scope.cidrs.split(",");

       var data = {
         name: $scope.scope_name,
         cidrs: $scope.cidrs,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'vpnendpointlocalsites', vpnendpointlocalsites_id);
    };
});