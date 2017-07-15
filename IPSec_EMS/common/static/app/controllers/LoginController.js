'use strict';

var app = angular.module('ems');

app.controller('LoginController',
    ['$scope', '$rootScope', '$http', '$localStorage','$state',
    function ($scope, $rootScope, $http, $localStorage, $state) {   
        $scope.error = $localStorage.error;
        $scope.login = function () {
            $http
              .post($localStorage.resourceUrl1 + '/tokens/', {username: $scope.username, password: $scope.password})
              .then(function(response) {
                if ( response ) {
                  $localStorage.currentUser = { username: $scope.username, authToken: response.data.auth_token };
                  $http.defaults.headers.common['X-Auth-Token'] = 'Token ' + response.data.auth_token;
                  $localStorage.error = '';
                  $state.go('ikepolicies'); 
                }
              }, 
              function(response) {
                if (response.status == 400) {
                  $scope.error = 'The username and/or password you have entered is invalid.';
                }
                else if (response.status >= 500) {
                  $scope.error = 'Server error.';
                }
                else {
                  $scope.error = response.data.detail;
                }
              });
        };
    }]);
