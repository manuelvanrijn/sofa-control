var toeter;
(function() {
  'use strict';

  sofaControlApp.controller('SickBeardCtrl', ['$scope', '$rootScope', 'SickBeardService',
    function($scope, $rootScope, SickBeardService) {
      $scope.history = [];
      $scope.shows = [];
      $scope.searchResult = {};
      $scope.stats = {};
      $scope.seasons = [];
      $scope.currentShow = null;
      $scope.currentSeason = null;

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
        $scope.shows = [];
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

      $scope.getPoster = function(show) {
        if(show === null)
          return;
        return 'http://thetvdb.com/banners/posters/' + show.tvdbid + '-1.jpg';
      };

      $scope.getBanner = function(show) {
        if(show === null)
          return;
        return 'http://thetvdb.com/banners/graphical/' + show.tvdbid + '-g2.jpg';
      }

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
      $scope.goto = function(id, show) {
        $scope.currentShow = show;
        $("article#sickbeard section").addClass('hidden')
        $("article#sickbeard section" + id).removeClass('hidden');

        if($scope.currentShow !== null) {
          $scope.getSeasons($scope.currentShow);
        }
      };

      $scope.getSeasons = function(show) {
        $scope.seasons = [];
        $scope.currentSeason = null;

        $rootScope.loading(true);
        window.$chocolatechip.UIHideSheet();
        SickBeardService.seasons(show.tvdbid).then(function(data) {
          $scope.seasons = data;
          toeter = $scope;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.setCurrentSeason = function(season) {
        $scope.currentSeason = season;
      };

      $scope.numberOfEpisodes = function(season) {
        // -1 for the angular $$hashkey property
        return Object.keys(season).length - 1;
      }

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
