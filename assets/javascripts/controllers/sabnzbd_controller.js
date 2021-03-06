(function() {
  'use strict';

  sofaControlApp.controller('SabnzbCtrl', ['$scope', '$rootScope', 'SABnzbdService', 'NZBIndexService', 'NZBClubService',
    function($scope, $rootScope, SABnzbdService, NZBIndexService, NZBClubService) {
      var _updateQueueAndStatsPointer = null;
      $scope.error = null;
      $scope.queue = [];
      $scope.history = [];
      $scope.searchResult = {};
      $scope.stats = {};
      $scope.providerIndex = 0;


      var $elms = $('#tabbar-sabnzbd, article#sabnzbd .tabbar-panel:first');
      $rootScope.$on('SABnzbdService.connectionError', function(e, result) {
        $elms.addClass('hidden');
        $('#sabnzbd-error').removeClass('hidden');
        $scope.error = result.error;
      });

      $rootScope.$on('SABnzbdService.connected', function(e, result) {
        $elms.removeClass('hidden');
        $('#sabnzbd-error').addClass('hidden');
        $scope.error = null;
        _updateQueueAndStatsPointer = setInterval(updateQueueAndStats, 2000);
        updateQueueAndStats();
        $('#tabbar-sabnzbd a.button:first').trigger('singletap');
      });

      $scope.$watch('state', function(value) {
        if(value !== 'sabnzbd') {
          clearInterval(_updateQueueAndStatsPointer);
        }
      });

      $scope.init = function() {
        $rootScope.state = 'sabnzbd';
        $rootScope.$apply();

        // setup providers
        $scope.providers = [];
        $scope.providers.push(NZBIndexService);
        $scope.providers.push(NZBClubService);
      };

      $scope.showQueueOptions = function(task) {
        // hack for ios, trigger singletap to early when clicking the handle
        // and having a list with clickable items
        if($('#tabbar-sabnzbd:visible').length === 0) {
          return;
        }

        $scope.currentTask = task;
        $('.sheet').remove();
        window.$chocolatechip.UISheet({
          id: 'queueSheet'
        });
        $('#queueSheet .handle').on('singletap', function() {
          $('#tabbar-sabnzbd').show();
        });

        setTimeout(function() {
          $('#queueSheet section').html($('#queueOptions').children().clone(true, true));
          /*$('#queueSheet section a').on('singletap', function(e) {
            e.preventDefault();
            //$scope.addShow(show, $(this).data('status'));
          });*/
        }, 300);

        window.$chocolatechip.UIShowSheet();
        $('#tabbar-sabnzbd').hide();
      };

      $scope.resumeTask = function() {
        SABnzbdService.resumeTask($scope.currentTask.nzo_id).then(function(data) {
          window.$chocolatechip.UIHideSheet();
          $('#tabbar-sabnzbd').show();
        });

      };

      $scope.pauseTask = function() {
        SABnzbdService.pauseTask($scope.currentTask.nzo_id).then(function(data) {
          window.$chocolatechip.UIHideSheet();
          $('#tabbar-sabnzbd').show();
        });
      };

      $scope.deleteTask = function() {
        window.$chocolatechip.UIPopup({
          id: 'warning',
          title: 'Confirm removal',
          message: 'Are you sure you want to delete the task "' + $scope.currentTask.filename + '"?',
          cancelButton: 'Cancel',
          continueButton: 'Delete',
          callback: function() {
            window.$chocolatechip.UIHideSheet();
            $('#tabbar-sabnzbd').show();
            SABnzbdService.deleteTask($scope.currentTask.nzo_id);
          }
        });
      };

      $scope.toggleServerState = function() {
        if($scope.stats.status === 'Paused') {
          SABnzbdService.resumeDownloads();
        }
        else {
          SABnzbdService.pauseDownloads();
        }
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
          window.result = data.slots
          $scope.history = data.slots;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.toggleHistoryInfo = function(event) {
        $(event.currentTarget).find('.sabnzbd_actions').toggle();
      };

      $scope.secondsToTime = function(totalSeconds) {
        var seconds = ('0' + parseInt(totalSeconds % 60, 10)).slice(-2);
        var minutes = ('0' + parseInt((totalSeconds / 60) % 60, 10)).slice(-2);
        var hours = ('0' + parseInt(totalSeconds / 3600, 10)).slice(-2);
        return hours + ':' + minutes + '.' + seconds;
      };

      $scope.search = function(query, providerIndex) {
        $rootScope.loading(true);
        $('input#sabquery').blur();
        var provider = $scope.providers[providerIndex];
        provider.search(query).then(function(response) {
          $scope.searchResult = response.data.responseData.feed;
          $rootScope.loading(false);
        }, function(error) {
          window.$chocolatechip.UIPopup({
            id: 'showSearchErrorPopUp',
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

      $scope.showAddNzbOptions = function(entry) {
        // hack for ios, trigger singletap to early when clicking the handle
        // and having a list with clickable items
        if($('#tabbar-sabnzbd:visible').length === 0) {
          return;
        }

        $('.sheet').remove();
        window.$chocolatechip.UISheet({
          id: 'addNzbSheet'
        });
        $('#addNzbSheet .handle').on('singletap', function() {
          $('#tabbar-sabnzbd').show();
        });
        $('#addNzbSheet section').html($('#addNzbOptions').html());

        $('#addNzbSheet section a').on('singletap', function(e) {
          e.preventDefault();
          $scope.download(entry, $(this).data('priority'));
        });

        window.$chocolatechip.UIShowSheet();
        $('#tabbar-sabnzbd').hide();
      };

      $scope.download = function(entry, priority) {
        $rootScope.loading(true);

        var provider = $scope.providers[$scope.providerIndex];
        var url = provider.getDownloadUrl(entry);

        SABnzbdService.addTaskByUrl(url, priority).then(function(data) {
          var title = 'Success';
          var message = 'Download added to the queue';
          if(data.status !== true) {
            title = 'Failed';
            message = 'Download could not be added to the queue';
          }

          $rootScope.loading(false);
          window.$chocolatechip.UIPopup({
            id: 'addDownload',
            title: title,
            message: message,
            cancelButton: false,
            continueButton: 'OK',
            callback: function() {
              window.$chocolatechip.UIHideSheet();
              $('#tabbar-sabnzbd').show();
            }
          });
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
    }
  ]);
}).call(this);
