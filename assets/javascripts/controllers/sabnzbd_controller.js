(function() {
  'use strict';

  sofaControlApp.controller('SabnzbCtrl', ['$scope', '$rootScope', 'SABnzbdService', 'NZBIndexService', 'NZBClubService',
    function($scope, $rootScope, SABnzbdService, NZBIndexService, NZBClubService) {
      $scope.queue = [];
      $scope.history = [];
      $scope.searchResult = {};
      $scope.stats = {};
      $scope.providerIndex = 0;

      $scope.init = function() {
        $rootScope.state = 'sabnzbd';
        $rootScope.$apply();

        // setup providers
        $scope.providers = [];
        $scope.providers.push(NZBIndexService);
        $scope.providers.push(NZBClubService);

        $('.tabbar:visible a.button:first').trigger('singletap');
      };

      $scope.prepareSearch = function() {
        $scope.query = '';
        $scope.searchResult = {};
        if($('#providerList').hasClass('select') === false) {
          window.$chocolatechip('#providerList').UISelectList({
            selected: $scope.providerIndex,
            callback: function() {
              $scope.providerIndex = parseInt($(this).data('index'), 10);
            }
          });
        }
        $scope.$apply();
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
        var seconds = ('0' + parseInt(totalSeconds % 60, 10)).slice(-2);
        var minutes = ('0' + parseInt((totalSeconds / 60) % 60, 10)).slice(-2);
        var hours = ('0' + parseInt(totalSeconds / 3600, 10)).slice(-2);
        return hours + ':' + minutes + '.' + seconds;
      };

      $scope.search = function(query, providerIndex) {
        $rootScope.loading(true);

        var provider = $scope.providers[providerIndex];
        provider.search(query).then(function(response) {
          $scope.searchResult = response.data.responseData.feed;
          $rootScope.loading(false);
        }, function(error) {
          window.$chocolatechip.UIPopup({
            id: 'showAddesearchErrordPopUp',
            title: 'Search error',
            message: error.responseDetails,
            cancelButton: false,
            continueButton: 'OK',
            callback: function() {
              $scope.searchResult = {};
              if(!$scope.$$phase) {
                $scope.$apply();
              }
            }
          });
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
            var provider = $scope.providers[$scope.providerIndex];
            var url = provider.getDownloadUrl(entry);
            SABnzbdService.addTaskByUrl(url).then(function(data) {
              var title = 'Success';
              var message = 'Download added to the queue';
              if(data.status !== true) {
                title = 'Failed';
                message = 'Download could not be added to the queue';
              }
              window.$chocolatechip.UIPopup({
                id: 'addDownload',
                title: title,
                message: message,
                cancelButton: false,
                continueButton: 'OK'
              });
            });
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
