(function() {
  'use strict';

  sofaControlApp.controller('ConfigCtrl', ['$scope', '$rootScope', 'localStorageService',
    function($scope, $rootScope, localStorageService) {
      $scope.sabnzbdConfigs     = localStorageService.get('sabnzbdConfigs');
      $scope.sickBeardConfigs   = localStorageService.get('sickBeardConfigs');
      $scope.couchPotatoConfigs = localStorageService.get('couchPotatoConfigs');

      $scope.switchToSABnzbdConfig = function(config) {
        $rootScope.$broadcast('setSABnzbdConfig', config);
      };

      $scope.switchToSickBeardConfig = function(config) {
        $rootScope.$broadcast('setSickBeardConfig', config);
      };

      $scope.switchToCouchPotatoConfig = function(config) {
        $rootScope.$broadcast('setCouchPotatoConfig', config);
      };

      $scope.addSABnzbdConfig = function(config) {
        var configs = addNewServiceConfig('sabnzbdConfigs', config);
        $scope.sabnzbdConfigs = configs;
      };

      $scope.addSickBeardConfig = function(config) {
        var configs = addNewServiceConfig('sickBeardConfigs', config);
        $scope.sickBeardConfigs = configs;
      };

      $scope.addCouchPotatoConfig = function(config) {
        var configs = addNewServiceConfig('couchPotatoConfigs', config);
        $scope.couchPotatoConfigs = configs;
      };

      var addNewServiceConfig = function(storageKey, newConfig) {
        if(localStorageService.keys().indexOf(storageKey) === -1) {
          localStorageService.set(storageKey, []);
        }
        var configCollection = localStorageService.get(storageKey);
        var jsonConfig = angular.toJson(newConfig);
        for(var idx in configCollection) {
          if(jsonConfig === angular.toJson(configCollection[idx])) {
            return configCollection;
          }
        }
        configCollection.push(newConfig);
        localStorageService.set(storageKey, configCollection);
        return configCollection;
      };
    }
  ]);
}).call(this);
