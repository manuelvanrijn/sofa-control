var sofaControlApp;

(function() {
  'use strict';

  angular.module('LocalStorageModule').value('prefix', 'sofaControlApp');
  sofaControlApp = angular.module('sofaControlApp', ['LocalStorageModule']);
  sofaControlApp.run(['$rootScope', function($rootScope) {
    $rootScope.state = null;
    $rootScope.sabnzbdConfigs = [];
    $rootScope.sickBeardConfigs = [];
    $rootScope.couchPotatoConfigs = [];

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
