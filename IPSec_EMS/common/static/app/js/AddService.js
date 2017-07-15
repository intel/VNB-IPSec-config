var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory service is used for add operation i.e. to add a resource to another resource
    
    For example, adding user to a group.

    'add()' function takes arguments:

    $scope: $scope variable from controller where call took place
    resourceName1: Name of resource where another resource is getting added (groups)
    resourceID1: ID of resource where another resource is getting added (group id)
    resourceName2: Name of resource which is getting added (users)
    resourceID2: ID of resource which is getting added (user id)
    refreshOperationName: refresh or scope-operation
*/

app.factory('AddService', function($http, $rootScope, $localStorage, $mdDialog, ResourceConstants, $state) {
  function add($scope, resourceName1, resourceID1, resourceName2, resourceID2, refreshOperationName) {
     $scope.show_prog_bar = true;
     $scope.show_form_elements = false;

     $scope.show_status_msgs = true;
     $scope.show_err_icon = false;
     $scope.show_success_icon = false;
     $scope.status_msg = "Adding " + ResourceConstants[resourceName2] + " " + resourceID1;

     $http.put($scope.resourceUrl + "/" + resourceName1 + 
                "/" + resourceID1 + "/" + resourceName2 + "/" + resourceID2 + "/", {}, http_headers).then(
      function(response) {
         $scope.show_prog_bar = false;
         $rootScope.$emit(refreshOperationName); 
         $scope.show_success_icon = true;
         $scope.show_err_icon = false;
         $scope.status_msg = ResourceConstants[resourceName2] + " " + resourceID1 + " is added to a " + 
                              ResourceConstants[resourceName1] + " successfully";
      },
      function(response) {
        if (response.status == 401 || response.status == 403) {
          delete $localStorage.currentUser;
          $localStorage.error = 'The session expired. Please login again.';
          $mdDialog.cancel();
          $state.go('login'); 
        }else{
           $scope.show_prog_bar = false;
           $scope.show_err_icon = true;
           $scope.show_success_icon = false;
           $scope.status_msg = "Adding " + ResourceConstants[resourceName1] + " to a " + 
                                ResourceConstants[resourceName2] + " failed due \
                                to following errors. Please correct listed fileds.";
           $scope.error_messages = response.data;
         }
       });
    };

    return {
        add: add
    }
});
