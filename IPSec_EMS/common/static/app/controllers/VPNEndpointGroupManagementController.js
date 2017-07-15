
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('VPNEndpointGroupManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'VPN Endpoint Group';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpnendpointgroups';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createVPNEndpointGroupDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_vpnendpoint_group.html');
    }

    $scope.updateVPNEndpointGroup = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_vpnendpoint_group.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateVPNEndpointGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService, LoadService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

       var data = {
         name: $scope.scope_name,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       CreateService.create($scope, data, 'vpnendpointgroups');
    };
});

app.controller('UpdateVPNEndpointGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, LoadService, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var vpnendpointgroups_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncertificates');
    LoadDetailsService.showData($scope, 'vpnendpointgroups', vpnendpointgroups_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.vpncertificate_id = $scope.detailed_scope.vpncertificate_id;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

       var data = {
         name: $scope.scope_name,
         vpncertificate_id: $scope.vpncertificate_id,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'vpnendpointgroups', vpnendpointgroups_id);
    };
});