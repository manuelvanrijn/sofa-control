var sofaControlApp;
var UISlideout;

(function() {
  'use strict';

  angular.module('LocalStorageModule').value('prefix', 'sofaControlApp');
  sofaControlApp = angular.module('sofaControlApp', ['LocalStorageModule']);
  sofaControlApp.run(['$rootScope', function($rootScope) {
    $rootScope.state = null;
    $rootScope.sabnzbdConfigs = [];
    $rootScope.sickBeardConfigs = [];
    $rootScope.couchPotatoConfigs = [];

    $rootScope.loading = function(show) {
      if(show && window.$chocolatechip('.popup').length === 0) {
        window.$chocolatechip.UIPopup({
          empty: true
        });
        window.$chocolatechip('.popup').UIBusy({
          'size': '80px'
        });
      }
      else {
        window.$chocolatechip('.popup').UIPopupClose();
      }
    };
  }]);

  // Modified version of the chocolatechip-ui slideout
  window.$chocolatechip.UISlideout = function ( position ) {
    $('article').removeClass('next');
    $('article').removeClass('current');
    $('article').prev().removeClass('next');
    $('article').prev().removeClass('current');
    position = position || 'left';
    var slideoutButton = window.$chocolatechip.make("<a class='button slide-out-button' href='javascript:void(null)'></a>");
    // if added: Manuel van Rijn
    if($('.slide-out').length === 0) {
      var slideOut = '<div class="slide-out"><section></section></div>';
      window.$chocolatechip.body.append(slideOut);
    }
    window.$chocolatechip.body.addClass('slide-out-app');
    $('article:first-of-type').addClass('show');
    $('article:first-of-type').prev().addClass('show');
    $('#global-nav').append(slideoutButton);
    $('.slide-out-button').on(window.$chocolatechip.eventStart, function() {
      $('.slide-out').toggleClass('open');
    });
    $('.slide-out').on('singletap', 'li', function() {
      var whichArticle = '#' + $(this).attr('data-show-article');
      $('.slide-out').removeClass('open');
      $('article').removeClass('show');
      $('article').prev().removeClass('show');
      $(whichArticle).addClass('show');
      $(whichArticle).prev().addClass('show');
    });
  };

  window.$chocolatechip.UIGoBack = function () {};

}).call(this);
