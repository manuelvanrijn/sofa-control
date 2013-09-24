(function() {
  'use strict';

  sofaControlApp.controller('CouchPotatoCtrl', ['$scope', '$rootScope', 'CouchPotatoService',
    function($scope, $rootScope, CouchPotatoService) {
      $scope.init = function() {
        $rootScope.state = 'couchpotato';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };
    }
  ]);
}).call(this);
