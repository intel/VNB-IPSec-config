
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};


app.controller('UserManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {

    $scope.title = 'Users';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    $scope.resourceUrl = $localStorage.resourceUrl1;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, 'users'); 
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, 'users');
    }

    $scope.createUserDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_user.html');
    }

    $scope.updateUser = function(ev, user_id) {
      ScopeService.setProperty(user_id);
      DialogPopUpService.popup(ev, $scope, 'update_user.html');
    }

    $scope.changePassword = function(ev, user_id) {
      ScopeService.setProperty(user_id);
      DialogPopUpService.popup(ev, $scope, 'change_password.html');
    }

    LoadService.loadData($scope, 'users');
});

app.controller('CreateScopeController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, CreateService, LoadService, ConstService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.resourceUrl = $localStorage.resourceUrl1;

    LoadService.loadData($scope, 'ldap_config');

    $scope.auth_by_ldap_options = ConstService.auth_by_ldap_options;

    $scope.submit = function() {
      if ($scope.password != $scope.confirm_password) {
          $scope.show_prog_bar = false;
          $scope.show_err_icon = true;
          $scope.show_success_icon = false;
          $scope.status_msg = "Your password field does not match with confirm password field. \
                              Please reenter your password.";
       }
       else {

           var data = {
             username: $scope.scope_name,
             email: $scope.email,
             password: $scope.password,
             auth_by_ldap: $scope.auth_by_ldap,
             ldap_config_id: $scope.ldap_config_id,
             description: $scope.description
         };

           CreateService.create($scope, data, 'users');
       }
    };
});

app.controller('UpdateUserController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, UpdateService, LoadDetailsService, ConstService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var user_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl1;

    LoadDetailsService.showData($scope,  'users', user_id).then(function(data){
      $scope.scope_name = $scope.detailed_scope.username;
      $scope.email = $scope.detailed_scope.email;
      $scope.auth_by_ldap = $scope.detailed_scope.auth_by_ldap;
      $scope.ldap_config_id = $scope.detailed_scope.ldap_config_id;
      $scope.description = $scope.detailed_scope.description;
    });

    $scope.auth_by_ldap_options = ConstService.auth_by_ldap_options;

    $scope.submit = function() {

       var data = {
         username: $scope.scope_name,
         email: $scope.email,
         auth_by_ldap: $scope.auth_by_ldap,
         ldap_config_id: $scope.ldap_config_id,
         description: $scope.description
       };

       UpdateService.update($scope, data, 'users', user_id);
    };
});

app.controller('ChangePasswordController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, UpdateService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var user_id = ScopeService.getProperty();

    $scope.submit = function() {
       if ($scope.password != $scope.confirm_password) {
          $scope.show_prog_bar = false;
          $scope.show_err_icon = true;
          $scope.show_success_icon = false;
          $scope.status_msg = "Your password field does not match with confirm \
                              password field. Please reenter your password.";
       }
       else {

        $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
         $scope.status_msg = "Updating password for user " + user_id;

         var data = {
             original_password: $scope.original_password,
             password: $scope.password
           };

         $http.patch($localStorage.resourceUrl1 + "/users/" + 
          user_id + "/password/", data, http_headers).then(
          function(response) {
             $scope.show_prog_bar = false;
             $rootScope.$emit('scope-operation'); 
             $scope.show_success_icon = true;
             $scope.show_err_icon = false;
             $scope.status_msg = "Password for user " + user_id + " changed successfully";
          },
          function(response) {
            if (response.status == 401) {
              delete $localStorage.currentUser;
              $localStorage.error = 'The session expired. Please login again.';
              $mdDialog.cancel();
              $state.go('login'); 
            }else{
               $scope.show_prog_bar = false;
               $scope.show_err_icon = true;
               $scope.show_success_icon = false;
               $scope.status_msg = "Password updation failed due to following errors. \
                                    Please correct listed fileds.";
               $scope.error_messages = response.data;
            }
        });
      }
    };
});