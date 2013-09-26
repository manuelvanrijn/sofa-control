(function() {
  'use strict';

  sofaControlApp.controller('SettingsCtrl', ['$scope', '$rootScope', 'localStorageService',
    function($scope, $rootScope, localStorageService) {
      $scope.init = function() {
        $rootScope.state = 'settings';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };
    }
  ]);
}).call(this);
