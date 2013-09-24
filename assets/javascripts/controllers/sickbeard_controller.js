(function() {
  'use strict';

  sofaControlApp.controller('SickBeardCtrl', ['$scope', '$rootScope', 'SickBeardService',
    function($scope, $rootScope, SickBeardService) {
      $scope.init = function() {
        $rootScope.state = 'sickbeard';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };
    }
  ]);
}).call(this);
