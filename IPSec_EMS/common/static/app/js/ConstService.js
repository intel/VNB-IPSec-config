var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This constant service is used to get available options in resources
    for example, to create an ikepolicy, there are options for ike_version_options,
    encryption_algorithm_options etc.
    
    keys are required attributes while making http request and
    values are all options for keys
*/

app.constant('ConstService', {

    // Resources for IKE Policy and IPsec Policy
    ike_version_options : ['v1','v2'],
    dh_group_options : ['modp768', 'modp1024', 'modp1536', 'modp2048', 'modp3072', 'modp4096',
                        'modp6144', 'modp8192', 'modp1024s160', 'modp2048s224', 'modp2048s256',
                        'ecp192', 'ecp224', 'ecp256', 'ecp384', 'ecp521', 'ecp224bp', 'ecp256bp',
                        'ecp384bp', 'ecp512bp'],
    phase1_negotiation_mode_options : ['aggressive', 'main'],
    lifetime_units_options : ['seconds','minutes','hours','days'],
    rekey_options : ['yes','no'],
    reauth_options : ['yes','no'],
    encryption_algorithm_options_v1 : ['aes128', 'aes192', 'aes256', '3des', 'blowfish128', 'blowfish192', 
                                    'blowfish256'],
    encryption_algorithm_options_v2 : ["null", 'aes128', 'aes192', 'aes256', 'aes128ctr', 'aes192ctr',
                    'aes256ctr', 'aes128ccm8', 'aes192ccm8', 'aes256ccm8', 'aes128ccm12',
                    'aes192ccm12', 'aes256ccm12', 'aes128ccm16', 'aes192ccm16',
                    'aes256ccm16', 'aes128gcm8', 'aes192gcm8', 'aes256gcm8', 'aes128gcm12',
                    'aes192gcm12', 'aes256gcm12', 'aes128gcm16', 'aes192gcm16',
                    'aes256gcm16', '3des', 'cast128', 'blowfish128', 'blowfish192',
                    'blowfish256'],

    integrity_algorithm_options_v1 : ['md5', 'sha1', 'sha256', 'sha384', 'sha512'],
    integrity_algorithm_options_v2 : ['md5', 'sha1', 'sha256', 'sha384', 'sha512', 'aesxcbc'],

    transform_protocol_options : ['ah','esp'],
    esn_mode_options : ['esn','noesn'],
    encapsulation_mode_options : ['transport','tunnel'],

    // Resources for VPN Bind Group to Group and Localsite to Localsite
    admin_state_up : ['True','False'],
    dpd_action : ['clear','disabled','hold','restart','restart_by_peer'],
    auth_mode : ['psk','cert'],
    initiator : ['bi-directional','response-only'],

    // Resources RBAC User LDAP auth
    auth_by_ldap_options : ['True','False'],
    ldap_version_options : ['v2','v3'],

    // Resources RBAC Rule permission options
    permission_options : ['VIEW','ADD','DELETE','CHANGE'],

    // Resources of IPsec EMS
    resource_options : ['ikepolicies','ipsecpolicies','vpnendpointgroups','vpnendpointlocalsites',
    'vpnendpointremotesites','vpnbindgrouptogroup','vpnbindlocalsitetolocalsite','vpncacertificates',
    'vpncertificates']
});

