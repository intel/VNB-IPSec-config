
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('CACertManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {
    $scope.title = 'CA Certificate';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpncacertificates';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createCACertDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_cacert.html');
    }

    $scope.updateCACert = function(ev, cacert_id) {
      ScopeService.setProperty(cacert_id);
      DialogPopUpService.popup(ev, $scope, 'update_cacert.html');
    }

    LoadService.loadData($scope, resourceName);
  });

app.controller('CreateCACertController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, CreateService) {

     $scope.show_form_elements = true;
     $scope.show_prog_bar = false;

    $scope.submit = function(){
        $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
      $http({
            method: 'POST',
            url: $localStorage.resourceUrl2 + "/vpncacertificates/",
            headers: {
                'Content-Type': undefined
            },
            data: {
                name: $scope.name,
                ca_certificate: $scope.file
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
        })
        .success(function (response) {
            $scope.show_prog_bar = false;
             $rootScope.$emit('scope-operation'); 
             $scope.show_success_icon = true;
             $scope.show_err_icon = false;
             $scope.status_msg = "CA certificate created successfully.";

        })
        .error(function (response, status) {
            if (response.status == 401) {
              delete $localStorage.currentUser;
              $localStorage.error = 'The session expired. Please login again.';
              $mdDialog.cancel();
              $state.go('login'); 
            }else{
               $scope.show_prog_bar = false;
               $scope.show_err_icon = true;
               $scope.show_success_icon = false;
               $scope.status_msg = "CA certificate creation failed due to following \
                                    errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
        });
    };
});

app.controller('UpdateCACertController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, UpdateService,
                LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var cacert_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadDetailsService.showData($scope, 'vpncacertificates', cacert_id).then(function(data){
      $scope.name = $scope.detailed_scope.name;
    });

    $scope.submit = function(){
        $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
      $http({
            method: 'PUT',
            url: $localStorage.resourceUrl2 + "/vpncacertificates/",
            headers: {
                'Content-Type': undefined
            },
            data: {
                name: $scope.name,
                ca_certificate: $scope.file
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
        })
        .success(function (response) {
            $scope.show_prog_bar = false;
             $rootScope.$emit('scope-operation'); 
             $scope.show_success_icon = true;
             $scope.show_err_icon = false;
             $scope.status_msg = "CA certificate updated successfully.";
        })
        .error(function (response, status) {
            if (response.status == 401) {
              delete $localStorage.currentUser;
              $localStorage.error = 'The session expired. Please login again.';
              $mdDialog.cancel();
              $state.go('login'); 
            }else{
               $scope.show_prog_bar = false;
               $scope.show_err_icon = true;
               $scope.show_success_icon = false;
               $scope.status_msg = "CA certificate updation failed due to following \
                                    errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
        });
    };
});