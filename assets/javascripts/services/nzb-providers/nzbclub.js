(function() {
  'use strict';

  sofaControlApp.service('NZBClubService', ['$http', '$q', function($http, $q) {
    this.search = function(query) {
      var defer = $q.defer();
      var url = 'http://www.nzbclub.com/nzbfeed.aspx?q=' + query + '&ig=2&rpp=100&st=5&sp=1&ns=1';
      var _this = this;
      _this.shortUrl(url).then(function(resp) {
        var shortUrl = resp.data.id;
        _this.feedToJson(shortUrl).then(function(response) {
          if (response.data.responseStatus !== 200) {
            defer.reject(response.data);
          }
          else {
            defer.resolve(response);
          }
        });
      });
      return defer.promise;
    };

    this.getDownloadUrl = function(entry) {
      var url = entry.link;
      // there's an error in the link where we get something like /nzb_view1234
      // which should be /nzb_view/1234. Might be fixed someday so untill then this small replace hack
      var urlParts = url.split('nzb_view');
      if(urlParts[1].substr(0, 1) !== '/') {
        url = urlParts[0] + 'nzb_view/' + urlParts[1];
      }

      return url.replace('nzb_view', 'nzb_get') + '/download.nzb';
    };

    this.feedToJson = function(feedUrl) {
      var url = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=JSON_CALLBACK&q=' + feedUrl;
      return $http.jsonp(url);
    };

    this.shortUrl = function(url) {
      return $http.post('https://www.googleapis.com/urlshortener/v1/url', {
        longUrl: url
      });
    };

  }]);
}).call(this);
