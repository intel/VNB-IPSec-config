var app = angular.module('ems');

app.controller('RoleRuleDetailsController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                ScopeService, $localStorage, $stateParams, ErrMgmtService, DialogPopUpService,
                LoadDetailsService) {

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.resourceUrl = $localStorage.resourceUrl1;

    $scope.addRule = function(ev) {
        ScopeService.setProperty($stateParams.id);
        DialogPopUpService.popup(ev, $scope, 'add_rule.html');
    }

    $scope.removeRule = function(ev, rule_id) {

        var confirm = $mdDialog.confirm()
           .title('Delete?')
           .textContent("Deleting the rule " + rule_id  + ". Are you sure you want to delete the rule?")
           .targetEvent(ev)
           .ok('Yes, Delete it!')
           .cancel("No");

        el = angular.element( document.querySelector( '#messageBox' ) );

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = {}
            $http.delete($localStorage.resourceUrl1 + "/roles/" + 
                          $stateParams.id + "/rules/" + rule_id + "/", http_headers).then(
                function(response) {
                   LoadDetailsService.showData($scope, 'roles', $stateParams.id);
                },
                function(response) {
                  if (response.status == 401) {
                      delete $localStorage.currentUser;
                      $localStorage.error = 'The session expired. Please login again.';
                  }else{
                   $('html,body').scrollTop(0);
                   ErrMgmtService.showErrorMsg("Error: Rule deletion failed.", response);
                 }
              });
        });
    }

    $scope.reorderRule = function(ev, rule_id, order) {
        ScopeService.setProperty($stateParams.id);
        ScopeService.setKey(rule_id);
        ScopeService.setVal(order);
        DialogPopUpService.popup(ev, $scope, 'reorder_rule.html');
    }

    //Event to reload data after scope operation
    $rootScope.$on('refresh', function(event) {
        LoadDetailsService.showData($scope, 'roles', $stateParams.id);
    });

    LoadDetailsService.showData($scope, 'roles', $stateParams.id);
});

app.controller('AddRuleController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, ConstService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.role_id = ScopeService.getProperty();

    $scope.permission_options = ConstService.permission_options;

    $scope.add = function() {
       $scope.show_prog_bar = true;
       $scope.show_form_elements = false;

       $scope.show_status_msgs = true;
       $scope.show_err_icon = false;
       $scope.show_success_icon = false;
       $scope.status_msg = "Adding rule " + $scope.resource_endpoint;

       var data = {
         order: $scope.order,
         resource_endpoint: $scope.resource_endpoint,
         permissions: $scope.permissions
       };

       $http.put($localStorage.resourceUrl1 + "/roles/" + 
                  $scope.role_id + "/rules/", data, http_headers).then(
        function(response) {
           $scope.show_prog_bar = false;
           $rootScope.$emit('refresh'); 
           $scope.show_success_icon = true;
           $scope.show_err_icon = false;
           $scope.status_msg = "Rule " + $scope.resource_endpoint + " added successfully";
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
               $scope.status_msg = "Rule addition failed due to following errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
        });
    };
});

app.controller('RemoveRuleController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.role_id = ScopeService.getProperty();
    $scope.rule_id = ScopeService.getVal();

    $scope.submit = function(){
      $scope.show_prog_bar = true;
      $scope.show_form_elements = false;

      $scope.show_status_msgs = true;
      $scope.show_err_icon = false;
      $scope.show_success_icon = false;
      $scope.status_msg = "Removing rule " + $scope.resource_endpoint;

      var data = {
      };

      $http.delete($localStorage.resourceUrl1 + "/roles/" + 
                    $scope.role_id + "/rules/" + $scope.rule_id + "/", data, http_headers).then(
      function(response) {
      $scope.show_prog_bar = false;
      $rootScope.$emit('refresh'); 
      $scope.show_success_icon = true;
      $scope.show_err_icon = false;
      $scope.status_msg = "Rule " + $scope.resource_endpoint + " deleted successfully";
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
          $scope.status_msg = "Rule deletion failed due to following errors. \
                              Please correct listed fileds.";
          $scope.error_messages = response.data;
      }
      });
    };
});

app.controller('ReorderRuleController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    $scope.role_id = ScopeService.getProperty();
    $scope.rule_id = ScopeService.getKey();
    $scope.source_order = ScopeService.getVal();

    $scope.loadData = function () {
      highlightMgmtLink('roles_mgmt_link');
      $http.get($localStorage.resourceUrl1 + "/roles/" + $scope.role_id + "/", http_headers)
          .then(function(response) {
              $scope.available_rule_scopes = response.data.rules;
            },
            function(response){
              if (response.status == 401) {
                delete $localStorage.currentUser;
                $localStorage.error = 'The session expired. Please login again.';
              }
            }
    )};
    $scope.loadData();

    $scope.reorder = function(position, order){
      $scope.show_prog_bar = true;
      $scope.show_form_elements = false;
      $scope.show_status_msgs = true;
      $scope.show_err_icon = false;
      $scope.show_success_icon = false;
      $scope.status_msg = "Reordering rule " + $scope.resource_endpoint;

      if(order != -1 && $scope.source_order < order){
        if (position=='before')
          $scope.order=order-1;
        else if (position=='after')
          $scope.order=order;
      }
      else if (order != -1 && $scope.source_order > order) {
        if (position=='before')
          $scope.order=order;
        else if (position=='after')
          $scope.order=order + 1;
      }
      else if (order == -1) {
        if(position=='top')
          $scope.order=1;
        else if (position=='last'){
          var last=$scope.available_rule_scopes[ Object.keys($scope.available_rule_scopes).pop() ];
          $scope.order=last.order;      
        }
      }

      $http.patch($localStorage.resourceUrl1 + "/roles/" + $scope.role_id + 
                  "/rules/" + $scope.rule_id + "/orders/" + $scope.order + "/", {}, http_headers).then(
      function(response) {
          $scope.show_prog_bar = false;
          $rootScope.$emit('refresh'); 
          $scope.show_success_icon = true;
          $scope.show_err_icon = false;
          $scope.status_msg = "Rule " + $scope.resource_endpoint + " reordered successfully to " + $scope.order;
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
          $scope.status_msg = "Rule reordering failed due to following errors. \
                              Please correct listed fileds.";
          $scope.error_messages = response.data;
        }
      });
    };
});