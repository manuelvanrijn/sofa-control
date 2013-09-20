(function() {
  'use strict';

  sofaControlApp.controller('SabnzbCtrl', ['$scope', '$rootScope', 'SABnzbdService',
    function($scope, $rootScope, SABnzbdService) {
      $scope.queue = [];
      $scope.history = [];

      $scope.getHistory = function() {
        SABnzbdService.history().then(function(data) {
          $scope.history = data.slots;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      $scope.secondsToTime = function(totalSeconds) {
        var seconds = ('0' + parseInt(totalSeconds % 60)).slice(-2)
        var minutes = ('0' + parseInt((totalSeconds / 60) % 60)).slice(-2);
        var hours = ('0' + parseInt(totalSeconds / 3600)).slice(-2);
        return hours + ':' + minutes + '.' + seconds;
      };

      var updateQueue = function() {
        SABnzbdService.queue().then(function(data) {
          $scope.queue = data.slots;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      //setInterval(updateQueue, 1000);
      updateQueue();
    }
  ]);
}).call(this);
