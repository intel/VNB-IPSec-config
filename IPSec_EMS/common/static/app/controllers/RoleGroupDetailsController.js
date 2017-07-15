var app = angular.module('ems'); 

app.controller('RoleGroupDetailsController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                ScopeService, $localStorage, $stateParams, ErrMgmtService, DialogPopUpService,
                LoadDetailsService) {

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.resourceUrl = $localStorage.resourceUrl1;

    $scope.showData = function () {
      LoadDetailsService.showData($scope, 'roles', $stateParams.id);
    };

    $scope.addGroup = function(ev, resource1, value1) {
      ScopeService.setProperty(resource1);
      ScopeService.setVal(value1);
      DialogPopUpService.popup(ev, $scope, 'add_group.html');
    }

    $scope.delete = function(ev, resource, id){
        var confirm = $mdDialog.confirm()
           .title('Delete?')
           .textContent("Deleting the group " + id  + ". Are you sure you want to delete the group?")
           .targetEvent(ev)
           .ok('Yes, Delete it!')
           .cancel("No");

        el = angular.element( document.querySelector( '#messageBox' ) );

        $mdDialog.show(confirm).then(function() {
            http_headers['data'] = {}
            $http.delete($localStorage.resourceUrl1 + "/roles/" + 
                          $stateParams.id + "/" + resource + "/" + id + "/", http_headers).then(
                function(response) {
                   LoadDetailsService.showData($scope, 'roles', $stateParams.id);
                },
                function(response) {
                  if (response.status == 401) {
                      delete $localStorage.currentUser;
                      $localStorage.error = 'The session expired. Please login again.';
                  }else{
                   $('html,body').scrollTop(0);
                   ErrMgmtService.showErrorMsg("Error: Group deletion failed.", response);
                 }
              });
        });
    };

    //Event to reload data after scope operation
    $rootScope.$on('refresh', function(event) {
        LoadDetailsService.showData($scope, 'roles', $stateParams.id);
    });

    LoadDetailsService.showData($scope, 'roles', $stateParams.id);
});

app.controller('AddGroupController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, AddService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var resourceName1 = ScopeService.getProperty();
    var resourceID1 = ScopeService.getVal();

    $scope.resourceUrl = $localStorage.resourceUrl1;

    LoadService.loadData($scope, 'groups');

    $scope.add = function() {
      $scope.resourceUrl = $localStorage.resourceUrl1;
       AddService.add($scope, resourceName1, resourceID1, 'groups', $scope.groups, 'refresh');
      };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});