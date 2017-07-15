/**
* Main AngularJS Web Application
*/

var http_headers = { headers: {'Content-Type': 'application/json'}};

var app = angular.module('ems', [
  //array of angular dependencies 
  'ui.router', 'ngMaterial', 'ngStorage',
]);

//Define Routing for app
app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.
        otherwise( '/' );
    $stateProvider.
        state('login', {
        url:"/",
        templateUrl: '/static/views/login.html',
        controller: 'LoginController',
      }).
        state('ikepolicies', {
        url:"/ikepolicy_management",
        templateUrl: '/static/views/ikepolicy_management.html',
        controller: 'IKEPolicyManagementController',
      }).
        state('ikepolicies_details', {
        url:"/ikepolicy_details/:id",
        templateUrl: '/static/views/ikepolicy_details.html',
        controller: 'IKEPolicyDetailsController',
      }).
        state('ipsecpolicies', {
        url:"/ipsecpolicy_management",
        templateUrl: '/static/views/ipsecpolicy_management.html',
        controller: 'IPSECPolicyManagementController',
      }).
        state('ipsecpolicies_details', {
        url:"/ipsecpolicy_details/:id",
        templateUrl: '/static/views/ipsecpolicy_details.html',
        controller: 'IPSECPolicyDetailsController',
      }).
        state('vpnendpoint_group', {
        url:"/vpnendpoint_group_management",
        templateUrl: '/static/views/vpnendpoint_group_management.html',
        controller: 'VPNEndpointGroupManagementController',
      }).
        state('vpnendpoint_localsite', {
        url:"/vpnendpoint_localsite_management",
        templateUrl: '/static/views/vpnendpoint_localsite_management.html',
        controller: 'VPNEndpointLocalsiteManagementController',
      }).
        state('vpnendpoint_localsite_details', {
        url:"/vpnendpoint_localsite_details/:id",
        templateUrl: '/static/views/vpnendpoint_localsite_details.html',
        controller: 'VPNEndpointLocalsiteDetailsController',
      }).
        state('vpnendpoint_remotesite', {
        url:"/vpnendpoint_remotesite_management",
        templateUrl: '/static/views/vpnendpoint_remotesite_management.html',
        controller: 'VPNEndpointRemotesiteManagementController',
      }).
        state('vpnendpoint_remotesite_details', {
        url:"/vpnendpoint_remotesite_details/:id",
        templateUrl: '/static/views/vpnendpoint_remotesite_details.html',
        controller: 'VPNEndpointRemotesiteDetailsController',
      }).
        state('vpnbind_group_to_group', {
        url:"/vpnbind_group_to_group_management",
        templateUrl: '/static/views/vpnbind_group_to_group_management.html',
        controller: 'VPNBindGroupToGroupManagementController',
      }).
        state('vpnbind_group_to_group_details', {
        url:"/vpnbind_group_to_group_details/:id",
        templateUrl: '/static/views/vpnbind_group_to_group_details.html',
        controller: 'VPNBindGroupToGroupDetailsController',
      }).
        state('vpnbind_localsite_to_localsite_management', {
        url:"/vpnbind_localsite_to_localsite_management",
        templateUrl: '/static/views/vpnbind_localsite_to_localsite_management.html',
        controller: 'VPNBindLocalsiteToLocalsiteManagementController',
      }).
        state('vpnbind_localsite_to_localsite_details', {
        url:"/vpnbind_localsite_to_localsite_details/:id",
        templateUrl: '/static/views/vpnbind_localsite_to_localsite_details.html',
        controller: 'VPNBindLocalsiteToLocalsiteDetailsController',
      }).
        state('cacert', {
        url:"/cacert_management",
        templateUrl: '/static/views/cacert_management.html',
        controller: 'CACertManagementController',
      }).
        state('cacert_details', {
        url:"/cacert_details/:id",
        templateUrl: '/static/views/cacert_details.html',
        controller: 'CACertDetailsController',
      }).
        state('cert', {
        url:"/cert_management",
        templateUrl: '/static/views/cert_management.html',
        controller: 'CertManagementController',
      }).
        state('cert_details', {
        url:"/cert_details/:id",
        templateUrl: '/static/views/cert_details.html',
        controller: 'CertDetailsController',
      }).
        state('users', {
        url:"/user_management",
        templateUrl: '/static/views/user_management.html',
        controller: 'UserManagementController',
      }).
        state('users_details', {
        url:"/user_details/:id",
        templateUrl: '/static/views/user_details.html',
        controller: 'UserDetailsController',
      }).
        state('certificate_users', {
        url:"/certificate_user_management",
        templateUrl: '/static/views/certificate_user_management.html',
        controller: 'CertUserManagementController',
      }).
        state('logout', {
        url:"/logout",
        controller: 'LogoutController',
      }).
        state('projects', {
        url:"/project_management",
        templateUrl: '/static/views/project_management.html',
        controller: 'ProjectManagementController',
      }).
        state('groups', {
        url:"/group_management",
        templateUrl: '/static/views/group_management.html',
        controller: 'GroupManagementController',
      }).
        state('groups_details', {
        url:"/group_details/:id",
        templateUrl: '/static/views/group_details.html',
        controller: 'GroupDetailsController',
      }).
        state('roles', {
        url:"/role_management",
        templateUrl: '/static/views/role_management.html',
        controller: 'RoleManagementController',
      }).
        state('roles_rule_detail', {
        url:"/role_rule_details/:id",
        templateUrl: '/static/views/role_rule_details.html',
        controller: 'RoleRuleDetailsController',
      }).
        state('roles_group_detail', {
        url:"/role_group_details/:id",
        templateUrl: '/static/views/role_group_details.html',
        controller: 'RoleGroupDetailsController',
      }).
        state('ldap_management', {
        url:"/ldap_management",
        templateUrl: '/static/views/ldap_management.html',
        controller: 'LDAPManagementController',
      }).
        state('auto_rule_creation_management', {
        url:"/auto_rule_creation_management",
        templateUrl: '/static/views/auto_rule_creation_management.html',
        controller: 'AutoRuleCreationManagementController',
      });
}]);

app.run(
  function ($rootScope, $http, $location, $localStorage) {
  
  // // Resource URL to access RBAC resources
  $localStorage.resourceUrl1 = '/v1/main/auth/projects/ipsecems';

  // // Resource URL to access EMS resources
  $localStorage.resourceUrl2 = '/v1/main/ipsecvpn';

  if ($localStorage.currentUser) {
      $http.defaults.headers.common['X-Auth-Token'] = 'Token ' + $localStorage.currentUser.authToken;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var publicPages = ['/'];
    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if (restrictedPage && !$localStorage.currentUser) {
        delete $localStorage.currentUser;
        $http.defaults.headers.common['X-Auth-Token'] = '';
        $location.path('/');
    }

    $rootScope.showSidebar = function(){ 
       if(!($location.path() === '/')){
          document.getElementById("get_user_name").value = $localStorage.currentUser.username;
          document.getElementById("get_user_name").style.width = (($localStorage.currentUser.username.length + 1) * 8) + 'px';
          return true;
       }else{
          return false;
       }
    };

    $rootScope.showNavbar = function(){ 
       if(!($location.path() === '/')){
          return true;
       }else{
          return false;
       }
    };
  });
});
