var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory used for calls to RBAC web service, as RBAC uses 'patch' method for update
    This factory service is used for update operation i.e. to update a resource
    
    For example, updating information of a specific user.

    'update()' function takes arguments:

    $scope: $scope variable from controller where call took place
    data: http data required to make http request for that resource (fields which needs to be updated)
    resourceName: Name of resource which is getting updated (users)
    resourceID: ID of resource which is getting updated (user id)
*/

app.factory('UpdateService', function($http, $rootScope, $localStorage, $mdDialog,
              ResourceConstants, $state) {
      function update($scope, data, resourceName, resourceID) {
         $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
         $scope.status_msg = "Updating " + ResourceConstants[resourceName] + " " + resourceID + ".";

         $http.patch($scope.resourceUrl + "/" + resourceName + "/" + 
          resourceID + "/", data, http_headers).then(
          function(response) {
             $scope.show_prog_bar = false;
             $rootScope.$emit('scope-operation'); 
             $scope.show_success_icon = true;
             $scope.show_err_icon = false;
             $scope.status_msg = ResourceConstants[resourceName] + " " + resourceID + " updated successfully.";
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
               $scope.status_msg = ResourceConstants[resourceName] + " updation failed due to following errors. \
                                    Please correct listed fileds.";
               $scope.error_messages = response.data;
            }
        });
      };

    return {
        update: update
    }
});
