(function() {
  'use strict';

  sofaControlApp.controller('SabnzbCtrl', ['$scope', '$rootScope', 'SABnzbdService', 'NZBIndexService', 'NZBClubService',
    function($scope, $rootScope, SABnzbdService, NZBIndexService, NZBClubService) {
      $scope.queue = [];
      $scope.history = [];
      $scope.searchResult = {};
      $scope.stats = {};

      $scope.init = function() {
        $rootScope.state = 'sabnzbd';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };

      $scope.getHistory = function() {
        $rootScope.loading(true);
        SABnzbdService.history().then(function(data) {
          $scope.history = data.slots;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.secondsToTime = function(totalSeconds) {
        var seconds = ('0' + parseInt(totalSeconds % 60)).slice(-2)
        var minutes = ('0' + parseInt((totalSeconds / 60) % 60)).slice(-2);
        var hours = ('0' + parseInt(totalSeconds / 3600)).slice(-2);
        return hours + ':' + minutes + '.' + seconds;
      };

      $scope.search = function(query) {
        $rootScope.loading(true);
        // PROVIDER: NZBIndex
        NZBIndexService.search(query).then(function(response) {
          $scope.searchResult = response.data.responseData.feed;
        }, function(error) {
          $scope.searchResult = {};
          console.log(error);
        })['finally'](function() {
          $rootScope.loading(false);
        });

        // PROVIDER: NZBClub
        // NZBClubService.search(query).then(function(response) {
        //   $scope.searchResult = response.data.responseData.feed;
        // }, function(error) {
        //   $scope.searchResult = {};
        //   console.log(error);
        // })['finally'](function() {
        //   $rootScope.loading(false);
        // });;
      };

      $scope.download = function(entry) {
        window.$chocolatechip.UIPopup({
          id: 'warning',
          title: 'Confirm download',
          message: 'Do you want to download: <br />' + entry.title + '?',
          cancelButton: 'Cancel',
          continueButton: 'Download',
          callback: function() {
            // PROVIDER: NZBIndex
            var url = NZBIndexService.getDownloadUrl(entry);

            // PROVIDER: NZBClub
            //var url = NZBClubService.getDownloadUrl(entry);

            SABnzbdService.addTaskByUrl(url);
          }
        });
      };

      var updateQueueAndStats = function() {
        SABnzbdService.queue().then(function(data) {
          $scope.stats = {
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
          }

          $scope.queue = data.slots;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      //setInterval(updateQueueAndStats, 1000);
      updateQueueAndStats();
    }
  ]);
}).call(this);
