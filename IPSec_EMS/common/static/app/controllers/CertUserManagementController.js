
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('CertUserManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {
    $scope.title = 'Certificate Users';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'certificate_users';
    $scope.resourceUrl = $localStorage.resourceUrl1;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createCertUserDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_certificate_user.html');
    }

    $scope.updateCertUser = function(ev, certificate_user_id) {
      ScopeService.setProperty(certificate_user_id);
      DialogPopUpService.popup(ev, $scope, 'update_certificate_user.html');
    }

    LoadService.loadData($scope, resourceName);
  });

app.controller('CreateCertUserController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, CreateService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         subject_pattern: $scope.subject_pattern,
         description: $scope.description
       };

       CreateService.create($scope, data, 'certificate_users');
    };
});

app.controller('UpdateCertUserController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, UpdateService, LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var certificate_user_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl1;
    LoadDetailsService.showData($scope, 'certificate_users', certificate_user_id).then(function(data){
      $scope.subject_pattern = $scope.detailed_scope.subject_pattern;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.submit = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;

       var data = {
         subject_pattern: $scope.subject_pattern,
         description: $scope.description
       };

       UpdateService.update($scope, data, 'certificate_users', certificate_user_id);
    };
});