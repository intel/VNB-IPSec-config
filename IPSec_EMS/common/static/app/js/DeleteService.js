var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory service is used for delete operation i.e. to delete a resource
    
    For example, deleting a user.

    'deleting()' : This function is to delete all selected resources which in turn calls 
                    deleteScope() to make delete calls for each scope

    'deleting()' function takes arguments:

    ev: environment
    $scope: $scope variable from controller where call took place
    resourceName: Name of resource which is getting created (users)
    
    'deleteScope()' : This function is to delete each scope 

    ev: environment
    scope_id: id of resource which needs to be deleted
    $scope: $scope variable from controller where call took place
    resourceName: Name of resource which is getting created (users)
*/

app.factory('DeleteService', function($mdDialog, $http, $localStorage, LoadService, 
            ErrMgmtService, ResourceConstants, $state) {
    function deleteScope(ev, scope_id, $scope, resourceName) {   
        http_headers['data'] = {}
        $http.delete($scope.resourceUrl + "/" + 
                      resourceName + "/" + scope_id + "/", http_headers).then(
            function(response) {
               LoadService.loadData($scope, resourceName);
            },
            function(response) {
              if (response.status == 401 || response.status == 403) {
                  delete $localStorage.currentUser;
                  $localStorage.error = 'The session expired. Please login again.';
                  $state.go('login'); 
              }else{
               $('html,body').scrollTop(0);
               ErrMgmtService.showErrorMsg("Error: " + ResourceConstants[resourceName] + " deletion \
                                            failed.", response);
             }
          }); 
    }
 
    function deleting(ev, $scope, resourceName) {
      var confirm = $mdDialog.confirm()
           .title('Delete?')
           .textContent("Deleting " + ResourceConstants[resourceName] +" would disable all access to it. \
                        Are you sure you want to delete all the selected " + ResourceConstants[resourceName] + "?")
           .targetEvent(ev)
           .ok('Yes, Delete it!')
           .cancel("No");
        el = angular.element( document.querySelector( '#messageBox' ) );

        $mdDialog.show(confirm).then(function() {
            scope_names = Object.keys($scope.selected); 
            for(index = 0; index < scope_names.length; ++index){
                deleteScope(ev, scope_names[index], $scope, resourceName); 
            }
            $scope.selected = {}; 
        },
        function(){
          $scope.selected = {}; 
        });  
    }

    return {
        deleting: deleting
    }
});
