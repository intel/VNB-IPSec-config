var app = angular.module('ems');

app.controller('GroupDetailsController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, $stateParams, ErrMgmtService, LoadDetailsService) {

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.resourceUrl = $localStorage.resourceUrl1;

    //Event to reload data after scope operation
    $rootScope.$on('refresh', function(event) {
        LoadDetailsService.showData($scope, 'groups', $stateParams.id);
    });

    $scope.delete = function(ev, resource, id){
        var confirm = $mdDialog.confirm()
           .title('Delete?')
           .textContent("Deleting the user " + id  + ". Are you sure you want to delete the user?")
           .targetEvent(ev)
           .ok('Yes, Delete it!')
           .cancel("No");

        el = angular.element( document.querySelector( '#messageBox' ) );

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = {}
            $http.delete($localStorage.resourceUrl1 + "/groups/" + 
                          $stateParams.id + "/" + resource + "/" + id + "/", http_headers).then(
                function(response) {
                   LoadDetailsService.showData($scope, 'groups', $stateParams.id);
                },
                function(response) {
                  if (response.status == 401) {
                    delete $localStorage.currentUser;
                    $localStorage.error = 'The session expired. Please login again.';
                  }else{
                   $('html,body').scrollTop(0);
                   ErrMgmtService.showErrorMsg("Error: User deletion failed.", response);
                 }
              });
        });
    };

    LoadDetailsService.showData($scope, 'groups', $stateParams.id);
    
});
