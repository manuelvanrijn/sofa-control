(function() {
  'use strict';

  sofaControlApp.service('OMDbService', ['$http', function($http) {
    this.url = 'http://www.omdbapi.com/?tomatoes=true&callback=JSON_CALLBACK&r=json';

    this.byImdbId = function(imdbId, year) {
      year = year || null;
      var url = this.url + '&i=' + imdbId;
      if(year !== null) {
        url += '&y=' + year;
      }
      return $http.jsonp(url).then(function(resp) {
        return resp.data;
      });
    };
  }]);
}).call(this);
