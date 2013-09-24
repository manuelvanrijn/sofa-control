var sofaControlApp;

(function() {
  'use strict';

  sofaControlApp = angular.module('sofaControlApp', []);
  sofaControlApp.run(['$rootScope', function($rootScope) {
    $rootScope.state = null;
  }]);

}).call(this);
