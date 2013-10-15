(function() {
  'use strict';

  sofaControlApp.service('NZBGetService', ['$http', '$rootScope', function($http, $rootScope) {
    var _instance = this;

    $rootScope.$on('setNZBGetConfig', function(e, config) {
      _instance.url = 'http://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port + '/jsonprpc/';
      _instance.available().then(function(data) {
        if(data.status === false) {
          $rootScope.$broadcast('NZBGetService.connectionError', data);
        }
        else {
          $rootScope.$broadcast('NZBGetService.connected', data);
        }
      });
    });

    this.url = null;

    this.available = function() {
      // using the get_config call to check if app is online
      var url = this.url + 'version';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK', { timeout: 3000 }).then(function(resp) {
        if(resp.status === 200 && resp.data.result !== undefined) {
          return {
            status: true,
            error: ''
          };
        }
        else {
          return {
            status: false,
            error: 'Error trying to connect'
          };
        }
      }, function() {
        return {
          status: false,
          error: 'Error trying to connect'
        };
      });
    };

    // Request for list of items in URL-queue.
    this.urlqueue = function() {
      var url = this.url + 'urlqueue';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK').then(function(resp) {
        return resp.data.result;
      });
    };

    // Request for list of items in post-processor-queue.
    this.postqueue = function() {
      var url = this.url + 'postqueue';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK').then(function(resp) {
        return resp;
      });
    };

    // Request for groups' list. This method returns summary information for
    // each file group. A group is a collection of files from one nzb-file.
    this.listgroups = function() {
      var url = this.url + 'listgroups';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK').then(function(resp) {
        return resp.data.result;
      });
    };

    this.pausedownload = function() {
      var url = this.url + 'pausedownload';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK').then(function(resp) {
        return resp.data.result;
      });
    };

    this.resumedownload = function() {
      var url = this.url + 'resumedownload';
      return $http.jsonp(url + '?jsonp=JSON_CALLBACK').then(function(resp) {
        return resp.data.result;
      });
    };

    this.listfiles = function(IDFrom, IDTo, NZBID) {
      var url = this.url + 'listfiles';
      return $http.jsonp(url + '?params[IDFrom]=0&params[IDTo]=0&params[NZBID]=0&jsonp=JSON_CALLBACK').then(function(resp) {
        return resp.data.result;
      });
    };

  }]);
}).call(this);
