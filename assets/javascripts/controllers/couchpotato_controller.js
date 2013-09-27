(function() {
  'use strict';

  sofaControlApp.controller('CouchPotatoCtrl', ['$scope', '$rootScope', 'CouchPotatoService',
    function($scope, $rootScope, CouchPotatoService) {
      $scope.init = function() {
        $rootScope.state = 'couchpotato';
        $rootScope.$apply();

        CouchPotatoService.available().then(function(data) {
          var $elms = $('#tabbar-couchpotato, article#couchpotato .tabbar-panel:first');
          if(data.status === false) {
            $elms.addClass('hidden');
            $('#couchpotato-error').removeClass('hidden');
            $scope.error = data.error;
          }
          else {
            $elms.removeClass('hidden');
            $('#couchpotato-error').addClass('hidden');
            $scope.error = null;
          }
          $('.tabbar:visible a.button:first').trigger('singletap');
        });
      };
    }
  ]);
}).call(this);
