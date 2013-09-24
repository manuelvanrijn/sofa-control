(function() {
  'use strict';

  sofaControlApp.controller('SabnzbCtrl', ['$scope', '$rootScope', 'SABnzbdService', 'NZBIndexService',
    function($scope, $rootScope, SABnzbdService, NZBIndexService) {
      $scope.queue = [];
      $scope.history = [];
      $scope.searchResult = {};

      $scope.init = function() {
        $rootScope.state = 'sabnzbd';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };

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

      $scope.search = function(query) {
        NZBIndexService.search(query).then(function(response) {
          $scope.searchResult = response.data.responseData.feed;
        }, function(error) {
          $scope.searchResult = {};
          console.log(error);
        });
      };

      $scope.download = function(entry) {
        window.$chocolatechip.UIPopup({
          id: 'warning',
          title: 'Confirm download',
          message: 'Do you want to download: <br />' + entry.title + '?',
          cancelButton: 'Cancel',
          continueButton: 'Download',
          callback: function() {
            var link = entry.link.replace('/release/', '/download/');
            SABnzbdService.addTaskByUrl(link, entry.title);
          }
        });
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
