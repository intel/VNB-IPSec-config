var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory service is used to load detailed information of a resource 
    i.e. to load a specific resource
    
    For example, get a user whose user id is *somthing*.

    'showData()' function takes arguments:

    $scope: $scope variable from controller where call took place
    resourceName: Name of resource which is getting created (users)
    resourceID: ID of resource which is getting created (user id)
*/
      
app.factory('LoadDetailsService', function($http,  $localStorage, $state) {
      function showData($scope, resourceName, resourceID) {
        highlightMgmtLink(resourceName + '_mgmt_link');
        return $http.get($scope.resourceUrl + "/" + 
                  resourceName + "/" + resourceID + "/", http_headers)
            .then(function(response) {
              $scope.detailed_scope = response.data;
            },
            function(response){
              if (response.status == 401 || response.status == 403) {
                delete $localStorage.currentUser;
                $localStorage.error = 'The session expired. Please login again.';
                $state.go('login'); 
              }
            }
        )}; 

    return {
        showData: showData
    }
});
