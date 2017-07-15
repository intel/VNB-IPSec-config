
var app = angular.module('ems');
var http_headers = { headers: { 'Content-Type': 'application/json'}};


app.controller('CertManagementController', function($scope, $rootScope, $http, $mdDialog, $mdMedia, 
                $localStorage, ScopeService, ErrMgmtService, LoadService, DeleteService, DialogPopUpService) {
    $scope.title = 'Certificate';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.selected = {}; 
    $scope.sortType = 'deleted';
    $scope.sortReverse = false;

    var resourceName = 'vpncertificates';
    $scope.resourceUrl = $localStorage.resourceUrl2;
  
    //Event to reload data after scope operation
    $rootScope.$on('scope-operation', function(event) {
        LoadService.loadData($scope, resourceName);
    });

    $scope.selectedDelete = function(ev) {
      DeleteService.deleting(ev, $scope, resourceName);
    }

    $scope.createCertDialog = function(ev) {
      DialogPopUpService.popup(ev, $scope, 'create_cert.html');
    }

    $scope.updateCert = function(ev, cert_id) {
      ScopeService.setProperty(cert_id);
      DialogPopUpService.popup(ev, $scope, 'update_cert.html');
    }

    LoadService.loadData($scope, resourceName);
  });

app.controller('CreateCertController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, CreateService, LoadService) {

     $scope.show_form_elements = true;
     $scope.show_prog_bar = false;

     $scope.resourceUrl = $localStorage.resourceUrl2;
     LoadService.loadData($scope, 'vpncacertificates');

    $scope.submit = function(){
        $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
      $http({
            method: 'POST',
            url: $localStorage.resourceUrl2 + "/vpncertificates/",
            headers: {
                'Content-Type': undefined
            },
            data: {
                name: $scope.name,
                right_id: $scope.right_id,
                vpncacertificate_id: $scope.vpncacertificate_id,
                certificate: $scope.file1,
                key: $scope.file2
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
             $scope.status_msg = "Certificate created successfully.";

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
               $scope.status_msg = "Certificate creation failed due to following \
                                    errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
        });
    };
});

app.controller('UpdateCertController', function($scope, $rootScope, $http, $mdDialog, 
                $mdMedia, $localStorage, ScopeService, ErrMgmtService, UpdateService, 
                LoadService, LoadDetailsService) {

    $scope.show_form_elements = true;
    $scope.show_prog_bar = false;
    var cert_id = ScopeService.getProperty();

    $scope.resourceUrl = $localStorage.resourceUrl2;
    LoadService.loadData($scope, 'vpncacertificates');
    LoadDetailsService.showData($scope, 'vpncertificates', cert_id).then(function(data){
      $scope.name = $scope.detailed_scope.name;
      $scope.right_id = $scope.detailed_scope.right_id;
      $scope.vpncacertificate_id = $scope.detailed_scope.vpncacertificate_id;
    });

    $scope.submit = function(){
        $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
      $http({
            method: 'PUT',
            url: $localStorage.resourceUrl2 + "/vpncertificates/",
            headers: {
                'Content-Type': undefined
            },
            data: {
                name: $scope.name,
                right_id: $scope.right_id,
                vpncacertificate_id: $scope.vpncacertificate_id,
                certificate: $scope.file1,
                key: $scope.file2
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
             $scope.status_msg = "Certificate updated successfully.";
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
               $scope.status_msg = "Certificate updation failed due to following \
                                    errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
        });
    };
});