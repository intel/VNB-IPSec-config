
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('GroupManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'Groups';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'groups';
    $scope.resourceUrl = $localStorage.resourceUrl1;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createGroupDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_group.html');
    }

    $scope.addUser = function(ev, resource1, value1) {
      ScopeService.setProperty(resource1);
      ScopeService.setVal(value1);
      DialogPopUpService.popup(ev, $scope, 'add_user.html');
    }

    $scope.addCertUser = function(ev, resource1, value1) {
      ScopeService.setProperty(resource1);
      ScopeService.setVal(value1);
      DialogPopUpService.popup(ev, $scope, 'add_certificate_user.html');
    }

    $scope.updateGroup = function(ev, group_id) {
      ScopeService.setProperty(group_id);
      DialogPopUpService.popup(ev, $scope, 'update_group.html');
    }

    LoadService.loadData($scope, resourceName);
});

app.controller('CreateGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, CreateService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         name: $scope.scope_name,
         description: $scope.description
       };

       CreateService.create($scope, data, 'groups');
    };
});

app.controller('UpdateGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, UpdateService, LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var group_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl1;
    LoadDetailsService.showData($scope, 'groups', group_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.name;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         name: $scope.scope_name,
         description: $scope.description
       };

       UpdateService.update($scope, data, 'groups', group_id);
    };
});

app.controller('AddCertUserController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, AddService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var resourceName1 = ScopeService.getProperty();
    var resourceID1 = ScopeService.getVal();

    $scope.resourceUrl = $localStorage.resourceUrl1;

    LoadService.loadData($scope, 'certificate_users');

    $scope.add = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;
       AddService.add($scope, resourceName1, resourceID1, 'certificate_users', $scope.certificate_users,
                      'scope-operation');
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});

app.controller('AddUserController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, AddService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var resourceName1 = ScopeService.getProperty();
    var resourceID1 = ScopeService.getVal();

    $scope.resourceUrl = $localStorage.resourceUrl1;

    LoadService.loadData($scope, 'users');

    $scope.add = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;
       AddService.add($scope, resourceName1, resourceID1, 'users', $scope.users, 'scope-operation');
      };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});