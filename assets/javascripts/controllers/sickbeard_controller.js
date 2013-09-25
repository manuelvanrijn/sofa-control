(function() {
  'use strict';

  sofaControlApp.controller('SickBeardCtrl', ['$scope', '$rootScope', 'SickBeardService',
    function($scope, $rootScope, SickBeardService) {
      $scope.history = [];
      $scope.shows = [];
      $scope.searchResult = {};
      $scope.stats = {};

      $scope.init = function() {
        $rootScope.state = 'sickbeard';
        $rootScope.$apply();

        $('.tabbar:visible a.button:first').trigger('singletap');
      };

      $scope.getHistory = function() {
        $rootScope.loading(true);
        SickBeardService.history(25).then(function(data) {
          $scope.history = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.getShows = function() {
        $rootScope.loading(true);
        SickBeardService.shows().then(function(data) {
          $scope.shows = [];
          for(var tvdbid in data) {
            var show = data[tvdbid];
            show.tvdbid = tvdbid;
            $scope.shows.push(show);
          }
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.getBanner = function(show) {
        return 'http://thetvdb.com/banners/posters/' + show.tvdbid + '-1.jpg';
      };

      $scope.search = function(query) {
        $rootScope.loading(true);
        $scope.searchResult = {};
        SickBeardService.searchShows(query).then(function(data) {
          $scope.searchResult = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.addShow = function(show, status) {
        $rootScope.loading(true);
        window.$chocolatechip.UIHideSheet();
        SickBeardService.addShow(show.tvdbid, status).then(function(data) {
          $rootScope.loading(false);

          window.$chocolatechip.UIPopup({
            id: 'showAddedPopUp',
            title: 'New show',
            message: 'ok', //data.message,
            cancelButton: false,
            continueButton: 'OK',
            callback: function() {
              $scope.searchResult = {};
              $scope.query = '';
              $scope.$apply();
            }
          });
        });
      };

      $scope.showAddShowOptions = function(show) {
        window.$chocolatechip.UISheet({
          id: 'addShowSheet'
        });
        $('#addShowSheet section').html($('#addShowOptions').html());

        $('#addShowSheet section a').on('singletap', function(e) {
          e.preventDefault();
          $scope.addShow(show, $(this).data('status'));
        });

        window.$chocolatechip.UIShowSheet();
      };

      $scope.getStats = function() {
        SickBeardService.stats().then(function(data) {
          $scope.stats = data;
        });
      };

      // filters
      $scope.statusContinuing = function() {
        return function(show) {
          return show.status === 'Continuing';
        };
      };
      $scope.statusNotContinuing = function() {
        return function(show) {
          return show.status !== 'Continuing';
        };
      };
    }
  ]);
}).call(this);
