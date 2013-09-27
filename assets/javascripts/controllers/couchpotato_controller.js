(function() {
  'use strict';

  sofaControlApp.controller('CouchPotatoCtrl', ['$scope', '$rootScope', '$q', 'CouchPotatoService', 'OMDbService',
    function($scope, $rootScope, $q, CouchPotatoService, OMDbService) {
      $scope.wantedMovies = [];
      $scope.downloadedMovies = [];
      $scope.searchResults = [];
      $scope.profiles = [];

      var $elms = $('#tabbar-couchpotato, article#couchpotato .tabbar-panel:first');
      $rootScope.$on('CouchPotatoService.connectionError', function(e, result) {
        $elms.addClass('hidden');
        $('#couchpotato-error').removeClass('hidden');
        $scope.error = result.error;
      });

      $rootScope.$on('CouchPotatoService.connected', function(e, result) {
        $elms.removeClass('hidden');
        $('#couchpotato-error').addClass('hidden');
        $scope.error = null;
        $('#tabbar-couchpotato a.button:first').trigger('singletap');
      });

      $scope.init = function() {
        $rootScope.state = 'couchpotato';
        $rootScope.$apply();

        CouchPotatoService.profiles().then(function(data) {
          $scope.profiles = data;
        });
      };

      $scope.getWanted = function() {
        $rootScope.loading(true);
        $scope.wantedMovies = [];
        CouchPotatoService.movies('active').then(function(data) {
          getOMDbCollectionFromCouchPotatoMovies(data).then(function(movies) {
            $scope.wantedMovies= movies;
          })['finally'](function() {
            $rootScope.loading(false);
            setTimeout(function() {
              $scope.$apply();
            }, 1000);
          });
        });
      };

      $scope.getDownloaded = function() {
        $rootScope.loading(true);
        $scope.downloadedMovies = [];
        CouchPotatoService.movies('done').then(function(data) {
          getOMDbCollectionFromCouchPotatoMovies(data).then(function(movies) {
            $scope.downloadedMovies = movies;
            $rootScope.loading(false);
            setTimeout(function() {
              $scope.$apply();
            }, 1000);
          });
        });
      };

      $scope.getPoster = function(movie) {
        if(movie.Poster && movie.Poster.substr(0, 4) === 'http') {
          return movie.Poster;
        }
        if(movie.images && movie.images.poster && movie.images.poster.length > 0 &&
           movie.images.poster[0].substr(0, 4) === 'http') {
          return movie.images.poster[0];
        }
        return '/assets/images/poster-unknown.png';
      };

      $scope.search = function(query) {
        $rootScope.loading(true);
        $scope.searchResult = [];
        CouchPotatoService.search(query).then(function(data) {
          $scope.searchResults = data;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.download = function(movie) {
        window.$chocolatechip.UISheet({
          id: 'profileSheet'
        });
        $('#profileSheet section').html($('#profileOptions').html());

        $('#profileSheet section li').on('singletap', function(e) {
          e.preventDefault();
          var profileId = $(this).data('id');
          var title = movie.titles[0];
          var identifier = movie.imdb;

          $rootScope.loading(true);
          window.$chocolatechip.UIHideSheet();
          $('#profileSheet').remove();
          $('#tabbar-couchpotato').show();

          CouchPotatoService.addMovie(profileId, identifier, title).then(function(data) {
            $rootScope.loading(false);
            var resultTitle = 'Movie added';
            var resultMessage = 'The movie: "' + title + '" is added to your Wanted list';
            if(data.success !== true) {
              resultTitle = 'Error adding movie';
              resultMessage = 'Something went wrong adding the movie';
            }

            window.$chocolatechip.UIPopup({
              id: 'showMovieAddedPopUp',
              title: resultTitle,
              message: resultMessage,
              cancelButton: false,
              continueButton: 'OK',
              callback: function() {
                $scope.searchResults = {};
                $scope.query = '';
                $scope.$apply();
              }
            });
          });
        });

        window.$chocolatechip.UIShowSheet();
        $('#tabbar-couchpotato').hide();
      };

      $scope.wantedOptions = function(movie) {
        $scope.currentWantedMovie = movie;
        window.$chocolatechip.UISheet({
          id: 'wantedMovieSheet'
        });
        $('#wantedMovieSheet section').html($('#wantedMovieOptions').children().clone(true, true));
        window.$chocolatechip.UIShowSheet();
      };

      $scope.deleteWantedMovie = function() {
        window.$chocolatechip.UIPopup({
          id: 'warning',
          title: 'Confirm removal',
          message: 'Are you sure you want to delete the movie "' + $scope.currentWantedMovie.Title + '"?',
          cancelButton: 'Cancel',
          continueButton: 'Delete',
          callback: function() {
            window.$chocolatechip.UIHideSheet();
            $("#wantedMovieSheet").remove();
            CouchPotatoService.removeMovie($scope.currentWantedMovie.CouchPotatoId).then(function() {
              $scope.getWanted();
            });
          }
        });
      };

      var getOMDbCollectionFromCouchPotatoMovies = function(couchPotatoMovies) {
        var defer = $q.defer();
        var movies = [];
        if(couchPotatoMovies.length === 0) {
          defer.resolve(movies);
        }
        for(var i=0; i<couchPotatoMovies.length;i++) {
          var couchPotatoMovie = couchPotatoMovies[i];
          OMDbService.byImdbId(couchPotatoMovie.library.info.imdb).then(function(movie) {
            movie.CouchPotatoId = couchPotatoMovie.id;
            movies.push(movie);
            if(movies.length === couchPotatoMovies.length) {
              defer.resolve(movies);
            }
          });
        }
        return defer.promise;
      };
    }
  ]);
}).call(this);
