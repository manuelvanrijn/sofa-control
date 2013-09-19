(function() {
  'use strict';

  sofaControlApp.service('SABnzbdService', ['$http', 'SABNZBD', function($http, SABNZBD) {
    this.url = 'http://' + SABNZBD.host + ':' + SABNZBD.port + '/api?apikey=' + SABNZBD.apiKey + '&output=json';

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

    this.addTaskByUrl = function(nzbUrl, friendlyName) {
      var url = this.url + '&mode=addurl&name=' + nzbUrl + '&nzbname=' + friendlyName;
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
