(function() {
  'use strict';

  sofaControlApp.directive('errSrc', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          element.attr('src', attrs.errSrc);
        });
      }
    };
  });
}).call(this);
