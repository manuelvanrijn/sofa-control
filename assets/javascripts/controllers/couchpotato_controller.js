(function() {
  'use strict';

  sofaControlApp.controller('CouchPotatoCtrl', ['$scope', '$rootScope', '$q', '$filter', 'CouchPotatoService',
    function($scope, $rootScope, $q, $filter, CouchPotatoService) {
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
        CouchPotatoService.movies('active').then(function(movies) {
          $scope.wantedMovies= movies;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.getDownloaded = function() {
        $rootScope.loading(true);
        $scope.downloadedMovies = [];
        CouchPotatoService.movies('done').then(function(movies) {
          $scope.downloadedMovies = movies;
        })['finally'](function() {
          $rootScope.loading(false);
        });
      };

      $scope.getPoster = function(movie) {
        var info = (movie.library) ? movie.library.info : movie;
        var poster = info.images.poster[0];
        var poster_original = info.images.poster_original[0];

        if(poster && poster.substr(0, 4) === 'http') {
          return poster;
        }
        if(poster_original && poster_original.substr(0, 4) === 'http') {
          return poster_original;
        }
        return '/assets/images/poster-unknown.png';
      };

      $scope.search = function(query) {
        $rootScope.loading(true);
        $scope.searchResult = [];
        $('input#cpquery').blur();
        CouchPotatoService.search(query).then(function(data) {
          $scope.searchResults = data;
          setTimeout(function() {
            $scope.$apply();
          }, 1000);
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
          message: 'Are you sure you want to delete the movie "' + $scope.currentWantedMovie.library.info.original_title + '"?',
          cancelButton: 'Cancel',
          continueButton: 'Delete',
          callback: function() {
            window.$chocolatechip.UIHideSheet();
            $("#wantedMovieSheet").remove();
            CouchPotatoService.removeMovie($scope.currentWantedMovie.id).then(function() {
              $scope.getWanted();
            });
          }
        });
      };
    }
  ]);
}).call(this);
