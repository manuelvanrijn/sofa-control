(function() {
  'use strict';

  sofaControlApp.service('SickBeardService', ['$http', '$rootScope', function($http, $rootScope) {
    var _instance = this;

    $rootScope.$on('setSickBeardConfig', function(e, config) {
      _instance.url = 'http://' + config.host + ':' + config.port + '/api/' + config.apiKey + '/?cmd=';
      _instance.available().then(function(data) {
        if(data.status === false) {
          $rootScope.$broadcast('SickBeardService.connectionError', data);
        }
        else {
          $rootScope.$broadcast('SickBeardService.connected', data);
        }
      });
    });

    this.url = null;

    this.available = function() {
      // using the get_config call to check if app is online
      var url = this.url + 'sb.ping';
      return $http.jsonp(url + '&callback=JSON_CALLBACK', { timeout: 3000 }).then(function(resp) {
        if(resp.data.result === "success") {
          return {
            status: true,
            error: ''
          };
        }
        else {
          return {
            status: false,
            error: resp.data.message
          };
        }
      }, function() {
        return {
          status: false,
          error: 'Error trying to connect'
        };
      });
    };

    this.stats = function() {
      var url = this.url + 'shows.stats';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.forceSearch = function() {
      var url = this.url + 'sb.forcesearch';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.history = function(limit) {
      limit = limit || 10;
      if(limit > 100) {
        limit = 100;
      }

      var url = this.url + 'history&limit=' + limit;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.future = function() {
      var url = this.url + 'future&sort=date&type=today|missed';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.shows = function() {
      var url = this.url + 'shows';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.show = function(tvdbid) {
      var url = this.url + 'show&tvdbid=' + tvdbid;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.pauseResumeShow = function(tvdbid, state) {
      if(state === 0 || state === 1) {
        var url = this.url + 'show.pause&tvdbid=' + tvdbid + '&pause=' + state;
        return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
          return resp.data;
        });
      }
      else {
        return; //todo: some error handling
      }
    };

    this.searchShows = function(query) {
      var url = this.url + 'sb.searchtvdb&name=' + query;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.addShow = function(tvdbid, status) {
      status = status.toLowerCase();
      if(status === 'wanted' || status === 'skipped' || status === 'archived' || status === 'ignored') {
        var url = this.url + 'show.addnew&tvdbid=' + tvdbid + '&status=' + status;
        return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
          return resp.data;
        });
      }
      else {
        return; //todo: some error handling
      }
    };

    this.deleteShow = function(tvdbid) {
      var url = this.url + 'show.delete&tvdbid=' + tvdbid;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.seasons = function(tvdbid, season) {
      var url = this.url + 'show.seasons&tvdbid=' + tvdbid;
      if(season)
        url += '&season=' + season;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.data;
      });
    };

    this.setStatus = function(tvdbid, season, status, episode) {
      status = status.toLowerCase();
      episode = episode || null;

      if(status === 'wanted' || status === 'skipped' || status === 'archived' || status === 'ignored') {
        var url = this.url + 'episode.setstatus&tvdbid=' + tvdbid + '&season=' + season + '&status=' + status + '&force=1';
        if(episode !== null) {
          url += '&episode=' + episode;
        }
        return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
          return resp.data;
        });
      }
      else {
        return; //todo: some error handling
      }
    };
  }]);
}).call(this);
