
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('IPSECPolicyManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'IPSEC Policies';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'ipsecpolicies';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createIPSECPolicyDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_ipsecpolicy.html');
    }

    $scope.updateIPSECPolicy = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_ipsecpolicy.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateIPSECPolicyController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.transform_protocol_options = ConstService.transform_protocol_options;
    $scope.ike_version_options = ConstService.ike_version_options;
    $scope.dh_group_options = ConstService.dh_group_options;
    $scope.esn_mode_options = ConstService.esn_mode_options;
    $scope.encapsulation_mode_options = ConstService.encapsulation_mode_options;
    $scope.lifetime_units_options = ConstService.lifetime_units_options;  

    $scope.updateObjects = function(ike_ver)
    {
        if (ike_ver == 'v1') {
            $scope.encryption_algorithm_options = ConstService.encryption_algorithm_options_v1;
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v1;
        }
        else if (ike_ver == 'v2') {
            $scope.encryption_algorithm_options =  ConstService.encryption_algorithm_options_v2; 
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v2;
        }
    }

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

       var data = {
         name: $scope.scope_name,
         transform_protocol: $scope.transform_protocol,
         encryption_algorithm: $scope.encryption_algorithm,
         integrity_algorithm: $scope.integrity_algorithm,
         dh_group: $scope.dh_group,
         esn_mode: $scope.esn_mode,
         encapsulation_mode: $scope.encapsulation_mode,
         lifetime_value: $scope.lifetime_value,
         lifetime_units: $scope.lifetime_units,
         description: $scope.description
       };

       CreateService.create($scope, data, 'ipsecpolicies');
    };
});

app.controller('UpdateIPSECPolicyController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var ipsecpolicies_id = ScopeService.getProperty();

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.transform_protocol_options = ConstService.transform_protocol_options;
    $scope.ike_version_options = ConstService.ike_version_options;
    $scope.dh_group_options = ConstService.dh_group_options;
    $scope.esn_mode_options = ConstService.esn_mode_options;
    $scope.encapsulation_mode_options = ConstService.encapsulation_mode_options;
    $scope.lifetime_units_options = ConstService.lifetime_units_options; 

    $scope.updateObjects = function(ike_ver)
    {
        if (ike_ver == 'v1') {
            $scope.encryption_algorithm_options = ConstService.encryption_algorithm_options_v1;
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v1;
        }
        else if (ike_ver == 'v2') {
            $scope.encryption_algorithm_options =  ConstService.encryption_algorithm_options_v2; 
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v2;
        }
    }

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadDetailsService.showData($scope, 'ipsecpolicies', ipsecpolicies_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.transform_protocol = $scope.detailed_scope.transform_protocol;
      $scope.encryption_algorithm = $scope.detailed_scope.encryption_algorithm;
      $scope.integrity_algorithm = $scope.detailed_scope.integrity_algorithm;
      $scope.dh_group = $scope.detailed_scope.dh_group;
      $scope.esn_mode = $scope.detailed_scope.esn_mode;
      $scope.encapsulation_mode = $scope.detailed_scope.encapsulation_mode;
      $scope.lifetime_value = $scope.detailed_scope.lifetime_value;
      $scope.lifetime_units = $scope.detailed_scope.lifetime_units;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

       var data = {
         name: $scope.scope_name,
         transform_protocol: $scope.transform_protocol,
         encryption_algorithm: $scope.encryption_algorithm,
         integrity_algorithm: $scope.integrity_algorithm,
         dh_group: $scope.dh_group,
         esn_mode: $scope.esn_mode,
         encapsulation_mode: $scope.encapsulation_mode,
         lifetime_value: $scope.lifetime_value,
         lifetime_units: $scope.lifetime_units,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'ipsecpolicies', ipsecpolicies_id);
    };
});