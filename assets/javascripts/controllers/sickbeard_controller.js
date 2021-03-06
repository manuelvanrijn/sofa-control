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
        $('input#sbquery').blur();
        SickBeardService.searchShows(query).then(function(data) {
          $scope.searchResult = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.addShow = function(show, status) {
        $rootScope.loading(true);

        SickBeardService.addShow(show.tvdbid, status).then(function(data) {
          $rootScope.loading(false);

          window.$chocolatechip.UIPopup({
            id: 'showAddedPopUp',
            title: 'New show',
            message: data.message,
            cancelButton: false,
            continueButton: 'OK',
            callback: function() {
              window.$chocolatechip.UIHideSheet();
              $('#tabbar-sickbeard').show();
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
          var result = [];
          angular.forEach(data, function(episodes, season) {
            var episodeArray = [];
            angular.forEach(episodes, function(episode, episodeNumber) {
              this.push(episode);
            }, episodeArray);
            this.push(episodeArray);
          }, result);
          $scope.seasons = result;
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
        showStatusSheet(function(status) {
          $scope.addShow(show, status);
        });
      };

      $scope.showEditEpisode = function(episode) {
        showStatusSheet(function(status) {
          $rootScope.loading(true);

          var tvdbid = $scope.showState.show.tvdbid;
          var season = $scope.showState.seasonNumber;
          SickBeardService.setStatus(tvdbid, season, status, episode).then(function(data) {
            $rootScope.loading(false);

            var idx = $scope.seasons.indexOf($scope.showState.season);
            $scope.setShow($scope.showState.show);
            setTimeout(function() {
              var season = $scope.seasons[idx];
              $scope.setSeason($scope.showState.seasonNumber, season);
              $scope.$apply();
            }, 300);

            window.$chocolatechip.UIHideSheet();
            $('#tabbar-sickbeard').show();
          });
        });
      };

      var showStatusSheet = function(callback) {
        // hack for ios, trigger singletap to early when clicking the handle
        // and having a list with clickable items
        if($('#tabbar-sickbeard:visible').length === 0) {
          return;
        }

        $('.sheet').remove();
        window.$chocolatechip.UISheet({
          id: 'addShowSheet'
        });
        $('#addShowSheet .handle').on('singletap', function() {
          $('#tabbar-sickbeard').show();
        });
        $('#addShowSheet section').html($('#addShowOptions').html());

        $('#addShowSheet section a').on('singletap', function(e) {
          e.preventDefault();
          callback($(this).data('status'));
        });

        window.$chocolatechip.UIShowSheet();
        $('#tabbar-sickbeard').hide();
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
