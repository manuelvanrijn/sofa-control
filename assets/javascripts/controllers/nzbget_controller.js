(function() {
  'use strict';

  sofaControlApp.controller('NzbgetCtrl', ['$scope', '$rootScope', 'NZBGetService', 'NZBIndexService', 'NZBClubService',
    function($scope, $rootScope, NZBGetService, NZBIndexService, NZBClubService) {
      $scope.error = null;
      $scope.queue = [];

      var $elms = $('#tabbar-nzbget, article#nzbget .tabbar-panel:first');
      $rootScope.$on('NZBGetService.connectionError', function(e, result) {
        $elms.addClass('hidden');
        $('#nzbget-error').removeClass('hidden');
        $scope.error = result.error;
      });

      $rootScope.$on('NZBGetService.connected', function(e, result) {
        $elms.removeClass('hidden');
        $('#nzbget-error').addClass('hidden');
        $scope.error = null;
        $('#tabbar-nzbget a.button:first').trigger('singletap');
      });

      $scope.init = function() {
        $rootScope.state = 'nzbget';
        $rootScope.$apply();

        $scope.queue = [];
window.scope = $scope;
        // setup providers
        $scope.providers = [];
        $scope.providers.push(NZBIndexService);
        $scope.providers.push(NZBClubService);

        updateQueueAndStats();
      };

      var updateQueueAndStats = function() {
        // NZBGetService.listfiles().then(function(data) {
        //   console.log(data);
        // });
        NZBGetService.listgroups().then(function(data) {
          /*$scope.stats = {
            kbpersec: data.kbpersec,
            status: data.status,
            timeleft: data.timeleft,
            uptime: data.uptime,
            version: data.version,
            diskspace1: data.diskspace1,
            diskspacetotal1: data.diskspacetotal1,
            diskspace2: data.diskspace2,
            diskspacetotal2: data.diskspacetotal2,
          };

          // remove values for disk 2 if same as disk 1
          if($scope.stats.diskspace1 === $scope.stats.diskspace2 && $scope.stats.diskspacetotal1 === $scope.stats.diskspacetotal2) {
            $scope.stats.diskspace2 = 0;
            $scope.stats.diskspacetotal2 = 0;
          }*/

          $scope.queue = data;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };
    }
  ]);
}).call(this);
