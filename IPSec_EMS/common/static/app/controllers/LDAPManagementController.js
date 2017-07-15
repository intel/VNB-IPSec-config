
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('LDAPManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {


    $scope.title = 'LDAP Configuration';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'ldap_config';
    $scope.resourceUrl = $localStorage.resourceUrl1;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createLDAPConfigurationDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_ldap_configuration.html');
    }

    $scope.updateLDAPConfiguration = function(ev, ldap_config_id) {
      ScopeService.setProperty(ldap_config_id);
      DialogPopUpService.popup(ev, $scope, 'update_ldap_configuration.html');
    }

    LoadService.loadData($scope, resourceName);
  });

app.controller('CreateLDAPConfigurationController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, CreateService, ConstService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.ldap_version_options = ConstService.ldap_version_options;

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         ldap_uri: $scope.ldap_uri,
         relative_distinguished_name: $scope.relative_distinguished_name,
         ldap_version: $scope.ldap_version
       };

       CreateService.create($scope, data, 'ldap_config');
    };
});

app.controller('UpdateLDAPConfigurationController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, UpdateService, ConstService, 
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var ldap_config_id = ScopeService.getProperty();

    $scope.ldap_version_options = ConstService.ldap_version_options;

    $scope.resourceUrl = $localStorage.resourceUrl1;
    LoadDetailsService.showData($scope, 'ldap_config', ldap_config_id).then(function(data){
      $scope.ldap_uri = $scope.detailed_scope.ldap_uri;
      $scope.relative_distinguished_name = $scope.detailed_scope.relative_distinguished_name;
      $scope.ldap_version = $scope.detailed_scope.ldap_version;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         ldap_uri: $scope.ldap_uri,
         relative_distinguished_name: $scope.relative_distinguished_name,
         ldap_version: $scope.ldap_version
       };

       UpdateService.update($scope, data, 'ldap_config', ldap_config_id);
    };
});
