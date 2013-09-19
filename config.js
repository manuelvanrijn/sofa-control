(function() {
  'use strict';

  sofaControlApp
    .constant('SABNZBD', {
      host: 'localhost',
      port: 8080,
      apiKey: ''
    })
    .constant('COUCHPOTATO', {
      host: 'localhost',
      port: 5050,
      username: '',
      password: ''
    })
    .constant('SICKBEARD', {
      host: 'localhost',
      port: 8081,
      apiKey: ''
    });

}).call(this);
