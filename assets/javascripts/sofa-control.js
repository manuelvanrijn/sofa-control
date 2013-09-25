var sofaControlApp;

(function() {
  'use strict';

  sofaControlApp = angular.module('sofaControlApp', []);
  sofaControlApp.run(['$rootScope', function($rootScope) {
    $rootScope.state = null;

    $rootScope.loading = function(show) {
      if(show && window.$chocolatechip('.popup').length === 0) {
        window.$chocolatechip.UIPopup({
          empty: true
        });
        window.$chocolatechip('.popup').UIBusy({
          'size': '80px'
        });
      }
      else {
        window.$chocolatechip('.popup').UIPopupClose();
      }
    };
  }]);

}).call(this);
