
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('RoleManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'Roles';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'roles';
    $scope.resourceUrl = $localStorage.resourceUrl1;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createRoleDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_role.html');
    }

    $scope.updateRole = function(ev, role_id) {
      ScopeService.setProperty(role_id);
      DialogPopUpService.popup(ev, $scope, 'update_role.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateRoleController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, CreateService, ConstService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.permission_options = ConstService.permission_options;

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
          name: $scope.scope_name,
          rules: [{
            order: $scope.rules.order,
            resource_endpoint: $scope.rules.resource_endpoint,
            permissions: $scope.rules.permissions
          }],
          description: $scope.description
       };

       CreateService.create($scope, data, 'roles');
    };
});

app.controller('UpdateRoleController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, UpdateService, LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var role_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl1;
    LoadDetailsService.showData($scope, 'roles', role_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         name: $scope.scope_name,
          description: $scope.description
       };

       UpdateService.update($scope, data, 'roles', role_id);
    };
});