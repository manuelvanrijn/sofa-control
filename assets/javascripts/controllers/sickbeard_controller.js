(function() {
  'use strict';

  sofaControlApp.controller('SickBeardCtrl', ['$scope', '$rootScope', 'SickBeardService',
    function($scope, $rootScope, SickBeardService) {
      $scope.error = null;
      $scope.history = [];
      $scope.shows = [];
      $scope.searchResult = {};
      $scope.stats = {};
      $scope.seasons = [];
      $scope.showState = {
        show: null,
        season: null,
        seasonNumber: null
      };

      var $elms = $('#tabbar-sickbeard, article#sickbeard .tabbar-panel:first');
      $rootScope.$on('SickBeardService.connectionError', function(e, result) {
        $elms.addClass('hidden');
        $('#sickbeard-error').removeClass('hidden');
        $scope.error = result.error;
      });

      $rootScope.$on('SickBeardService.connected', function(e, result) {
        $elms.removeClass('hidden');
        $('#sickbeard-error').addClass('hidden');
        $scope.error = null;
        $('#tabbar-sickbeard a.button:first').trigger('singletap');
      });

      $scope.init = function() {
        // custom events because chui prevents nav click things...
        $('#clearShow').off('singletap').on('singletap', function() {
          $scope.setShow(null);
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
        $('#clearSeason').off('singletap').on('singletap', function() {
          $scope.setSeason(null, null);
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });

        $rootScope.state = 'sickbeard';
        $rootScope.$apply();
      };

      $scope.resetShowState = function() {
        $scope.showState = {
          show: null,
          season: null,
          seasonNumber: null
        };
        if(!$scope.$$phase) {
          $scope.$apply();
        }
      };

      $scope.getHistory = function() {
        $rootScope.loading(true);
        $scope.resetShowState();
        SickBeardService.history(25).then(function(data) {
          $scope.history = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.getShows = function() {
        $rootScope.loading(true);
        $scope.resetShowState();
        $scope.seasons = [];
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
        if(show === null) {
          return;
        }
        return 'http://thetvdb.com/banners/posters/' + show.tvdbid + '-1.jpg';
      };

      $scope.getBanner = function(show) {
        if(show === null) {
          return;
        }
        return 'http://thetvdb.com/banners/graphical/' + show.tvdbid + '-g2.jpg';
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
        $('#addShowSheet').remove();
        SickBeardService.addShow(show.tvdbid, status).then(function(data) {
          $rootScope.loading(false);

          window.$chocolatechip.UIPopup({
            id: 'showAddedPopUp',
            title: 'New show',
            message: data.message,
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

      $scope.setShow = function(show) {
        $scope.showState.show = show;
        $scope.seasons = [];
        if(show === null) {
          return;
        }
        $rootScope.loading(true);
        SickBeardService.seasons(show.tvdbid).then(function(data) {
          $scope.seasons = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.setSeason = function(number, season) {
        $scope.showState.season = season;
        $scope.showState.seasonNumber = number;
      };

      $scope.numberOfEpisodes = function(season) {
        // -1 for the angular $$hashkey property
        return Object.keys(season).length - 1;
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
        $rootScope.loading(true);
        $scope.resetShowState();
        SickBeardService.stats().then(function(data) {
          $scope.stats = data;
        })['finally'](function() {
          $rootScope.loading(false);
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
