(function() {
  'use strict';

  sofaControlApp.service('CouchPotatoService', ['$http', '$rootScope', function($http, $rootScope) {
    var _instance = this;

    $rootScope.$on('setCouchPotatoConfig', function(e, config) {
      _instance.url = 'http://' + config.host + ':' + config.port + '/api/' + config.apiKey + '/';
    });

    this.url = null;

    this.available = function() {
      var url = this.url + 'app.available/';
      return $http.jsonp(url + '?callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.version = function() {
      var url = this.url + 'app.version/';
      return $http.jsonp(url + '?callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.searchWantedList = function() {
      var url = this.url + 'movie.searcher.full_search/';
      return $http.jsonp(url + '?callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.search = function(query) {
      var url = this.url + 'movie.search/';
      return $http.jsonp(url + '?q=' + query + '&callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.movies = function() {
      var url = this.url + 'movie.list/';
      return $http.jsonp(url + '?callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.addMovie = function(profileId, identifier, title) {
      var url = this.url + 'movie.list/';
      return $http.jsonp(url + '?profile_id=' + profileId + '&identifier=' + identifier + '&title=' + title + '&callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.profiles = function() {
      var url = this.url + 'profile.list/';
      return $http.jsonp(url + '?callback_func=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

  }]);
}).call(this);
