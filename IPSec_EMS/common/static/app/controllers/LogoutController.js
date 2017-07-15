var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

app.controller('LogoutController',
    ['$scope', '$rootScope', '$http', '$mdDialog', '$localStorage','$state',
    function ($scope, $rootScope, $http, $mdDialog, $localStorage, $state) {   
        // remove user from local storage and clear http auth header
        $http
          .delete($localStorage.resourceUrl1 + '/tokens/', {})
          .then(function(response) {
              delete $localStorage.currentUser;
              $http.defaults.headers.common['X-Auth-Token'] = '';
              $mdDialog.hide();
              $state.go('login');
          }, 
          function(response) {
            $scope.authMsg = 'Server Request Error';
          });
    }]);
