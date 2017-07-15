
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('VPNEndpointRemotesiteManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'VPN Endpoint Remotesite';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpnendpointremotesites';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createVPNEndpointRemotesiteDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_vpnendpoint_remotesite.html');
    }

    $scope.updateVPNEndpointRemotesite = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_vpnendpoint_remotesite.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateVPNEndpointRemotesiteController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService, LoadService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;
      $scope.peer_cidrs = $scope.peer_cidrs.split(",");

       var data = {
         name: $scope.scope_name,
         peer_address: $scope.peer_address,
         peer_cidrs: $scope.peer_cidrs,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       CreateService.create($scope, data, 'vpnendpointremotesites');
    };
});

app.controller('UpdateVPNEndpointRemotesiteController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, LoadService, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var vpnendpointremotesites_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');
    LoadDetailsService.showData($scope, 'vpnendpointremotesites', vpnendpointremotesites_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.peer_address = $scope.detailed_scope.peer_address;
      $scope.peer_cidrs = $scope.detailed_scope.peer_cidrs;
      $scope.vpncertificate_id = $scope.detailed_scope.vpncertificate_id;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

       var data = {
         name: $scope.scope_name,
         peer_address: $scope.peer_address,
         peer_cidrs: $scope.peer_cidrs,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'vpnendpointremotesites', vpnendpointremotesites_id);
    };
});