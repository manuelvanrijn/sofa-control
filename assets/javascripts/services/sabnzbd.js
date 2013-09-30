(function() {
  'use strict';

  sofaControlApp.service('SABnzbdService', ['$http', '$rootScope', function($http, $rootScope) {
    var _instance = this;

    $rootScope.$on('setSABnzbdConfig', function(e, config) {
      _instance.url = 'http://' + config.host + ':' + config.port + '/api?apikey=' + config.apiKey + '&output=json';
      _instance.available().then(function(data) {
        if(data.status === false) {
          $rootScope.$broadcast('SABnzbdService.connectionError', data);
        }
        else {
          $rootScope.$broadcast('SABnzbdService.connected', data);
        }
      });
    });

    this.url = null;

    this.available = function() {
      // using the get_config call to check if app is online
      var url = this.url + '&mode=get_config';
      return $http.jsonp(url + '&callback=JSON_CALLBACK', { timeout: 3000 }).then(function(resp) {
        if(resp.data.status === undefined) {
          return {
            status: true,
            error: ''
          };
        }
        else {
          return {
            status: resp.data.status,
            error: resp.data.error
          };
        }
      }, function() {
        return {
          status: false,
          error: 'Error trying to connect'
        };
      });
    };

    this.queue = function(start, limit) {
      start = start || 0;
      limit = limit || 10;
      var url = this.url + '&mode=queue&start=' + start + '&limit=' + limit;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.queue;
      });
    };

    this.history = function(start, limit) {
      start = start || 0;
      limit = limit || 10;
      var url = this.url + '&mode=history&start=' + start + '&limit=' + limit;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.history;
      });
    };

    this.addTaskByUrl = function(nzbUrl, priority) {
      var url = this.url + '&mode=addurl&name=' + nzbUrl + '&priority=' + priority;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.deleteTask = function(nzoId) {
      var url = this.url + '&mode=queue&name=delete&value=' + nzoId;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.pauseTask = function(nzoId) {
      var url = this.url + '&mode=queue&name=pause&value=' + nzoId;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.resumeTask = function(nzoId) {
      var url = this.url + '&mode=queue&name=resume&value=' + nzoId;
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data;
      });
    };

    this.pauseDownloads = function() {
      var url = this.url + '&mode=pause';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.status;
      });
    };

    this.resumeDownloads = function() {
      var url = this.url + '&mode=resume';
      return $http.jsonp(url + '&callback=JSON_CALLBACK').then(function(resp) {
        return resp.data.status;
      });
    };

  }]);
}).call(this);
