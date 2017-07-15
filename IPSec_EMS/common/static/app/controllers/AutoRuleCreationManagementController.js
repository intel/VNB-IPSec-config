
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('AutoRuleCreationManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, DialogPopUpService, ConstService, AddService, LoadService) {


    $scope.title = 'Auto Rule Creation Setup';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;

    $scope.permission_options = ConstService.permission_options;
    $scope.resource_options = ConstService.resource_options;

    $scope.resourceUrl = $localStorage.resourceUrl1;
    LoadService.loadData($scope, 'groups');

    $scope.rowsCount = 1;
    $scope.rules = [];

    $scope.addRow = function(){
      $scope.rules.push({ 
        order: $scope.rowsCount++,
        resource_endpoint: "",
        permissions: []
      });
    };

    $scope.submit = function(ev){

      var data_role = {
        name: $scope.name,
        rules: $scope.rules
      };
      $http.post($localStorage.resourceUrl1 + "/" + 
                  "roles" + "/", data_role, http_headers).then(
        function(response) {
          ScopeService.setKey('success');
           $scope.resourceUrl = $localStorage.resourceUrl1;
           $scope.status_msg = "Role created successfully.";
           ScopeService.setProperty($scope.status_msg);
           DialogPopUpService.popup(ev, $scope, 'status_message.html');
           AddService.add($scope, 'roles', response.data.id, 'groups', $scope.groups, 'refresh');
        },
        function(response) {
          if (response.status == 401) {
            delete $localStorage.currentUser;
            $localStorage.error = 'The session expired. Please login again.';
            $mdDialog.cancel();
            $state.go('login'); 
          }else{
            ScopeService.setKey('fail');
             $scope.status_msg = "Role creation failed due to following \
                                  errors. Please correct listed fileds.";
             ScopeService.setProperty($scope.status_msg);
             $scope.error_messages = response.data;
             ScopeService.setVal($scope.error_messages);
           }
       });
    };
   
  });

app.controller('StatusManagementController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, ScopeService) {

  $scope.show_prog_bar = true;
  $scope.show_form_elements = false;

  $scope.show_status_msgs = true;
  $scope.show_err_icon = false;
  $scope.show_success_icon = false;

  var status = ScopeService.getKey();

  if (status == 'success') {
    $scope.show_prog_bar = false; 
    $scope.show_success_icon = true;
    $scope.show_err_icon = false;
    $scope.status_msg = ScopeService.getProperty();
  }
  else if (status == 'fail') {
    $scope.show_prog_bar = false;
    $scope.show_err_icon = true;
    $scope.show_success_icon = false;
    $scope.status_msg = ScopeService.getProperty();
    $scope.error_messages = ScopeService.getVal();
  }
});