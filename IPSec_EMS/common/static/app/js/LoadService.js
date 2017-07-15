var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory service is used to load all scopes of a resource 
    
    For example, get information of all users.

    'sloadData()' function takes arguments:

    $scope: $scope variable from controller where call took place
    resourceName: Name of resource which is getting created (users)
*/
      
app.factory('LoadService', function($http, $localStorage, $state) {
      function loadData($scope, resourceName) {
        highlightMgmtLink(resourceName + '_mgmt_link');
        $http.get($scope.resourceUrl + 
                  "/" + resourceName + "/", http_headers)
            .then(function(response) {
                $scope.available_scopes = response.data;
              },
              function(response){
                if (response.status == 401 || response.status == 403) {
                  delete $localStorage.currentUser;
                  $localStorage.error = 'The session expired. \
                                        Please login again.';
                  $state.go('login'); 
                }
              }
            )
      }; 

    return {
        loadData: loadData
    }
});
