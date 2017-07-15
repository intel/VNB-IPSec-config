
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('VPNBindGroupToGroupManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'VPN Bind Group to Group';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpnbindgrouptogroup';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);  
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createVPNBindGroupToGroupDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_vpnbind_group_to_group.html');
    }

    $scope.updateVPNBindGroupToGroup = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_vpnbind_group_to_group.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateVPNBindGroupToGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService, LoadService ) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.admin_state_up_options = ConstService.admin_state_up;
    $scope.dpd_action_options = ConstService.dpd_action;
    $scope.auth_mode_options = ConstService.auth_mode;
    $scope.initiator_options = ConstService.initiator;  

    $scope.resourceUrl = $localStorage.resourceUrl2;

    $scope.loadData = function () {
        $http.get($localStorage.resourceUrl2 + "/vpnendpointgroups/", http_headers)
            .then(function(response) {
                $scope.available_vpnendpointgroup_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        }
      );

      $http.get($localStorage.resourceUrl2 + "/ikepolicies/", http_headers)
            .then(function(response) {
                $scope.available_ikepolicy_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        });

        $http.get($localStorage.resourceUrl2 + "/ipsecpolicies/", http_headers)
            .then(function(response) {
                $scope.available_ipsecpolicy_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        });
    };

    $scope.loadData();

    $scope.submit = function() {

       var data = {
         name: $scope.scope_name,
         vpnendpointgroup_id: $scope.vpnendpointgroup_id,
         peer_vpnendpointgroup_id: $scope.peer_vpnendpointgroup_id,
         admin_state_up: $scope.admin_state_up,
         dpd_action: $scope.dpd_action,
         dpd_interval: $scope.dpd_interval,
         dpd_timeout: $scope.dpd_timeout,
         auth_mode: $scope.auth_mode,
         psk: $scope.psk,
         initiator: $scope.initiator,
         ikepolicy_id: $scope.ikepolicy_id,
         ipsecpolicy_id: $scope.ipsecpolicy_id,
         description: $scope.description
       };

       CreateService.create($scope, data, 'vpnbindgrouptogroup');
    };
});

app.controller('UpdateVPNBindGroupToGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, LoadService,
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var vpnbindgrouptogroup_id = ScopeService.getProperty();

    $scope.admin_state_up_options = ConstService.admin_state_up;
    $scope.dpd_action_options = ConstService.dpd_action;
    $scope.auth_mode_options = ConstService.auth_mode;
    $scope.initiator_options = ConstService.initiator; 

    $scope.resourceUrl = $localStorage.resourceUrl2;

    $scope.loadData = function () {
        $http.get($localStorage.resourceUrl2 + "/vpnendpointgroups/", http_headers)
            .then(function(response) {
                $scope.available_vpnendpointgroup_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        }
      );

      $http.get($localStorage.resourceUrl2 + "/ikepolicies/", http_headers)
            .then(function(response) {
                $scope.available_ikepolicy_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        });

        $http.get($localStorage.resourceUrl2 + "/ipsecpolicies/", http_headers)
            .then(function(response) {
                $scope.available_ipsecpolicy_scopes = response.data;
        },
        function(response){
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
          }
        });
    };

    $scope.loadData();

    LoadDetailsService.showData($scope, 'vpnbindgrouptogroup', vpnbindgrouptogroup_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.vpnendpointgroup_id = $scope.detailed_scope.vpnendpointgroup_id;
      $scope.peer_vpnendpointgroup_id = $scope.detailed_scope.peer_vpnendpointgroup_id;
      $scope.admin_state_up = $scope.detailed_scope.admin_state_up;
      $scope.dpd_action = $scope.detailed_scope.dpd_action;
      $scope.dpd_interval = $scope.detailed_scope.dpd_interval;
      $scope.dpd_timeout = $scope.detailed_scope.dpd_timeout;
      $scope.auth_mode = $scope.detailed_scope.auth_mode;
      $scope.psk = $scope.detailed_scope.psk;
      $scope.initiator = $scope.detailed_scope.initiator;
      $scope.ikepolicy_id = $scope.detailed_scope.ikepolicy_id;
      $scope.ipsecpolicy_id = $scope.detailed_scope.ipsecpolicy_id;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {

       var data = {
         name: $scope.scope_name,
         vpnendpointgroup_id: $scope.vpnendpointgroup_id,
         peer_vpnendpointgroup_id: $scope.peer_vpnendpointgroup_id,
         admin_state_up: $scope.admin_state_up,
         dpd_action: $scope.dpd_action,
         dpd_interval: $scope.dpd_interval,
         dpd_timeout: $scope.dpd_timeout,
         auth_mode: $scope.auth_mode,
         psk: $scope.psk,
         initiator: $scope.initiator,
         ikepolicy_id: $scope.ikepolicy_id,
         ipsecpolicy_id: $scope.ipsecpolicy_id,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'vpnbindgrouptogroup', vpnbindgrouptogroup_id);
    };
});