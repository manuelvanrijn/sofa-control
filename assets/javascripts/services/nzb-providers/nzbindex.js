(function() {
  'use strict';

  sofaControlApp.service('NZBIndexService', ['$http', '$q', function($http, $q) {
    this.name = 'NZBIndex';

    this.search = function(query) {
      var defer = $q.defer();
      var url = 'http://www.nzbindex.nl/rss/?q=' + query + '&sort=agedesc&hidecross=1&max=100&more=1';
      var _this = this;
      _this.shortUrl(url).then(function(resp) {
        var url = resp.data.id;
        _this.processUrl(defer, url, 1);
      });
      return defer.promise;
    };

    // Because nzbindex isn't very stable, it might fail a few times.
    // Let's try it 10 times and after the 10th try return an error
    this.processUrl = function(defer, url, times) {
      var randUrl = url + '?rand=' + Math.random();
      var _this = this;
      _this.feedToJson(randUrl).then(function(response) {
        if(times === 10) {
          defer.reject({
            responseData: null,
            responseDetails: "Feed could not be loaded after 10 attempts.",
            responseStatus: 400
          });
        }
        else {
          if (response.data.responseStatus !== 200) {
            _this.processUrl(defer, url, (times+1));
          }
          else {
            defer.resolve(response);
          }
        }
      });
    };

    this.getDownloadUrl = function(entry) {
      return entry.link.replace('/release/', '/download/');
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
