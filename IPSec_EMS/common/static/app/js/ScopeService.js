var app = angular.module('ems');
var http_headers = { headers: {'X-Auth-Token': "1qa5rfefgrtwu73wiu3", 'Content-Type': 'application/json'}};
      
app.service('ScopeService', function () {
    var property = '';
    var key = "key"; 
    var val = "val"; 

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        },
        getKey: function() {
            return key; 
        },
        setKey: function(value) {
            key = value; 
        },
        getVal: function() {
            return val; 
        }, 
        setVal: function(value) {
            val = value; 
        }
    };
});

