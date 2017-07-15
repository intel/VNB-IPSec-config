var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};
      
app.factory('DialogPopUpService', function($mdDialog, $mdMedia) {
      function popup(ev, $scope, staticFile) {
         el = angular.element( document.querySelector( '.row' ) );
          $mdDialog.show({
              controller: DialogController,
              templateUrl: '/static/views/' + staticFile,
              parent: el, 
              targetEvent: ev,
              clickOutsideToClose:true,
           })
           .then(function(answer) {
               
           });
           $scope.$watch(function() {
               return $mdMedia('xs') || $mdMedia('sm');
           }, function(wantsFullScreen) {
               $scope.customFullscreen = (wantsFullScreen === true);
           });
      };
      function DialogController($scope, $http, $mdDialog) {
          $scope.hide = function() {
              $mdDialog.hide();
          };
          $scope.cancel = function() {
              $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
              $mdDialog.hide(answer);
          };
      };

    return {
        popup: popup
    }
});
