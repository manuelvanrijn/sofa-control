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
        SickBeardService.history(25).then(function(data) {
          $scope.history = data;
        });
      };

      $scope.getShows = function() {
        SickBeardService.shows().then(function(data) {
          $scope.shows = [];
          for(var tvdbid in data) {
            var show = data[tvdbid];
            show.tvdbid = tvdbid;
            $scope.shows.push(show);
          }
        });
      };

      $scope.getBanner = function(show) {
        return 'http://thetvdb.com/banners/posters/' + show.tvdbid + '-1.jpg';
      };

      $scope.search = function(query) {
        $scope.searchResult = {};
        SickBeardService.searchShows(query).then(function(data) {
          $scope.searchResult = data;
        });
      };

      $scope.addShow = function(show) {
        console.log(show);
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
