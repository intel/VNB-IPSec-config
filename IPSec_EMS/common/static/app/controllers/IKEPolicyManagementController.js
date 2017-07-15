
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('IKEPolicyManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'IKE Policies';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'ikepolicies';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createIKEPolicyDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_ikepolicy.html');
    }

    $scope.updateIKEPolicy = function(ev, id) {
      ScopeService.setProperty(id);
      DialogPopUpService.popup(ev, $scope, 'update_ikepolicy.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateIKEPolicyController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, CreateService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.ike_version_options = ConstService.ike_version_options;
    $scope.dh_group_options = ConstService.dh_group_options;
    $scope.phase1_negotiation_mode_options = ConstService.phase1_negotiation_mode_options;
    $scope.lifetime_units_options = ConstService.lifetime_units_options;
    $scope.rekey_options = ConstService.rekey_options;
    $scope.reauth_options = ConstService.reauth_options;   

    $scope.updateObjects = function(ike_ver)
    {
        if (ike_ver == 'v1') {
            $scope.multi_select = false;
            $scope.encryption_algorithm_options = ConstService.encryption_algorithm_options_v1;
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v1;
        }
        else if (ike_ver == 'v2') {
            $scope.multi_select = true;
            $scope.encryption_algorithm_options =  ConstService.encryption_algorithm_options_v2; 
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v2;
        }
    }

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

        if ($scope.ike_version == 'v1') {
            $scope.encryption_algorithm = [$scope.encryption_algorithm];
            $scope.integrity_algorithm = [$scope.integrity_algorithm];
            $scope.dh_group = [$scope.dh_group];
        }

       var data = {
         name: $scope.scope_name,
         ike_version: $scope.ike_version,
         encryption_algorithm: $scope.encryption_algorithm,
         integrity_algorithm: $scope.integrity_algorithm,
         dh_group: $scope.dh_group,
         phase1_negotiation_mode: $scope.phase1_negotiation_mode,
         lifetime_value: $scope.lifetime_value,
         lifetime_units: $scope.lifetime_units,
         rekey: $scope.rekey,
         reauth: $scope.reauth,
         description: $scope.description
       };

       CreateService.create($scope, data, 'ikepolicies');
    };
});

app.controller('UpdateIKEPolicyController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService, UpdateServiceEMS, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var ikepolicies_id = ScopeService.getProperty();

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.ike_version_options = ConstService.ike_version_options;
    $scope.dh_group_options = ConstService.dh_group_options;
    $scope.phase1_negotiation_mode_options = ConstService.phase1_negotiation_mode_options;
    $scope.lifetime_units_options = ConstService.lifetime_units_options;
    $scope.rekey_options = ConstService.rekey_options;
    $scope.reauth_options = ConstService.reauth_options;   

    $scope.updateObjects = function(ike_ver)
    {
        if (ike_ver == 'v1') {
            $scope.multi_select = false;
            $scope.encryption_algorithm_options = ConstService.encryption_algorithm_options_v1;
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v1;
        }
        else if (ike_ver == 'v2') {
            $scope.multi_select = true;
            $scope.encryption_algorithm_options =  ConstService.encryption_algorithm_options_v2; 
            $scope.integrity_algorithm_options = ConstService.integrity_algorithm_options_v2;
        }
    }

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadDetailsService.showData($scope, 'ikepolicies', ikepolicies_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.ike_version = $scope.detailed_scope.ike_version;
      $scope.encryption_algorithm = $scope.detailed_scope.encryption_algorithm;
      $scope.integrity_algorithm = $scope.detailed_scope.integrity_algorithm;
      $scope.dh_group = $scope.detailed_scope.dh_group;
      $scope.phase1_negotiation_mode = $scope.detailed_scope.phase1_negotiation_mode;
      $scope.lifetime_value = $scope.detailed_scope.lifetime_value;
      $scope.lifetime_units = $scope.detailed_scope.lifetime_units;
      $scope.rekey = $scope.detailed_scope.rekey;
      $scope.reauth = $scope.detailed_scope.reauth;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl2;

        if ($scope.ike_version == 'v1') {
            $scope.encryption_algorithm = [$scope.encryption_algorithm];
            $scope.integrity_algorithm = [$scope.integrity_algorithm];
            $scope.dh_group = [$scope.dh_group];
        }

       var data = {
         name: $scope.scope_name,
         ike_version: $scope.ike_version,
         encryption_algorithm: $scope.encryption_algorithm,
         integrity_algorithm: $scope.integrity_algorithm,
         dh_group: $scope.dh_group,
         phase1_negotiation_mode: $scope.phase1_negotiation_mode,
         lifetime_value: $scope.lifetime_value,
         lifetime_units: $scope.lifetime_units,
         rekey: $scope.rekey,
         reauth: $scope.reauth,
         description: $scope.description
       };

       UpdateServiceEMS.update($scope, data, 'ikepolicies', ikepolicies_id);
    };
});