var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This constant service is used to print messages(error/success) 
    
    keys are resource which are part of URLs while making http request and
    values are names of those resources
*/

app.constant('ResourceConstants', {
    'certificate_users' : 'certificate user',
    'groups' : 'group',
    'ikepolicies' : 'ike policy',
    'ipsecpolicies' : 'ipsec policy',
    'roles' : 'role',
    'users' : 'user',
    'vpnbindgrouptogroup' : 'vpn bind group to group',
    'vpnbindlocalsitetolocalsite' : 'vpn bind localsite to localsite',
    'vpnendpointgroups' : 'vpn endpoint group',
    'vpnendpointlocalsites' : 'vpn endpoint localsite',
    'vpnendpointremotesites' : 'vpn endpoint remotesite',
    'ldap_config' : 'ldap configuration'

});
