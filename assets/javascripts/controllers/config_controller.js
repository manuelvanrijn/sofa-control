(function() {
  'use strict';

  sofaControlApp.controller('ConfigCtrl', ['$scope', '$rootScope', 'localStorageService',
    function($scope, $rootScope, localStorageService) {
      $scope.showForm = false;
      $scope.SERVERTYPE = {
        SABNZBD: {name: 'SABnzbd'},
        NZBGET: {name: 'NZBGet'},
        SICKBEARD: {name: 'Sick Beard'},
        COUCHPOTATO: {name: 'CouchPotato'}
      };

      $rootScope.$on('updateConfigs', function(e) {
        $scope.sabnzbdConfigs     = localStorageService.get('sabnzbdConfigs');
        $scope.nzbgetConfigs      = localStorageService.get('nzbgetConfigs');
        $scope.sickBeardConfigs   = localStorageService.get('sickBeardConfigs');
        $scope.couchPotatoConfigs = localStorageService.get('couchPotatoConfigs');
      });

      //localStorageService.clearAll();
      $rootScope.$broadcast('updateConfigs');

      $scope.init = function() {
        $rootScope.state = 'settings';
        $rootScope.$apply();

        $('#tabbar-settings a.button:first').trigger('singletap');
      };

      $scope.edit = function(server, type) {
        server.originalConfig = angular.copy(server);
        server.serverType = type;

        $scope.showForm = true;
        $scope.editServer = server;
      };

      $scope.new = function(type) {
        $scope.showForm = true;
        $scope.editServer = {
          serverType: type
        };
      };

      $scope.save = function() {
        var type = $scope.editServer.serverType;
        var isUpdate = ($scope.editServer.originalConfig !== undefined);
        delete $scope.editServer.serverType;

        switch(type) {
        case $scope.SERVERTYPE.SABNZBD:
          if(isUpdate) {
            $scope.removeSABnzbdConfig($scope.editServer.originalConfig);
            delete $scope.editServer.originalConfig;
          }
          $scope.addSABnzbdConfig($scope.editServer);
          break;
        case $scope.SERVERTYPE.NZBGET:
          if(isUpdate) {
            $scope.removeNZBGetConfig($scope.editServer.originalConfig);
            delete $scope.editServer.originalConfig;
          }
          $scope.addNZBGetConfig($scope.editServer);
          break;
        case $scope.SERVERTYPE.SICKBEARD:
          if(isUpdate) {
            $scope.removeSickBeardConfig($scope.editServer.originalConfig);
            delete $scope.editServer.originalConfig;
          }
          $scope.addSickBeardConfig($scope.editServer);
          break;
        case $scope.SERVERTYPE.COUCHPOTATO:
          if(isUpdate) {
            $scope.removeCouchPotatoConfig($scope.editServer.originalConfig);
            delete $scope.editServer.originalConfig;
          }
          $scope.addCouchPotatoConfig($scope.editServer);
          break;
        }
        $scope.showForm = false;
      };

      $scope.remove = function() {
        var type = $scope.editServer.serverType;

        window.$chocolatechip.UIPopup({
          id: 'warning',
          title: 'Confirm removal',
          message: 'Are you sure you want to delete the "' + type.name + '" server "' + $scope.editServer.name + '"?',
          cancelButton: 'Cancel',
          continueButton: 'Delete',
          callback: function() {
            delete $scope.editServer.serverType;
            delete $scope.editServer.originalConfig;
            switch(type) {
            case $scope.SERVERTYPE.SABNZBD:
              $scope.removeSABnzbdConfig($scope.editServer);
              break;
            case $scope.SERVERTYPE.NZBGET:
              $scope.removeNZBGetConfig($scope.editServer);
              break;
            case $scope.SERVERTYPE.SICKBEARD:
              $scope.removeSickBeardConfig($scope.editServer);
              break;
            case $scope.SERVERTYPE.COUCHPOTATO:
              $scope.removeCouchPotatoConfig($scope.editServer);
              break;
            }
            $scope.showForm = false;
          }
        });
      };

      $scope.switchToSABnzbdConfig = function(config) {
        $rootScope.$broadcast('setSABnzbdConfig', config);
      };

      $scope.switchToNZBGetConfig = function(config) {
        $rootScope.$broadcast('setNZBGetConfig', config);
      };

      $scope.switchToSickBeardConfig = function(config) {
        $rootScope.$broadcast('setSickBeardConfig', config);
      };

      $scope.switchToCouchPotatoConfig = function(config) {
        $rootScope.$broadcast('setCouchPotatoConfig', config);
      };

      $scope.addSABnzbdConfig = function(config) {
        addNewServiceConfig('sabnzbdConfigs', config);
      };

      $scope.addNZBGetConfig = function(config) {
        addNewServiceConfig('nzbgetConfigs', config);
      };

      $scope.addSickBeardConfig = function(config) {
        addNewServiceConfig('sickBeardConfigs', config);
      };

      $scope.addCouchPotatoConfig = function(config) {
        addNewServiceConfig('couchPotatoConfigs', config);
      };

      $scope.removeSABnzbdConfig = function(config) {
        removeServiceConfig('sabnzbdConfigs', config);
      };

      $scope.removeNZBGetConfig = function(config) {
        removeServiceConfig('nzbgetConfigs', config);
      };

      $scope.removeSickBeardConfig = function(config) {
        removeServiceConfig('sickBeardConfigs', config);
      };

      $scope.removeCouchPotatoConfig = function(config) {
        removeServiceConfig('couchPotatoConfigs', config);
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
        $rootScope.$broadcast('updateConfigs');
        return configCollection;
      };

      var removeServiceConfig = function(storageKey, config) {
        if(localStorageService.keys().indexOf(storageKey) === -1) {
          localStorageService.set(storageKey, []);
        }
        var configCollection = localStorageService.get(storageKey);
        var jsonConfig = angular.toJson(config);
        for(var idx in configCollection) {
          if(jsonConfig === angular.toJson(configCollection[idx])) {
            configCollection.splice(idx,1);
            break;
          }
        }
        localStorageService.set(storageKey, configCollection);
        $rootScope.$broadcast('updateConfigs');
        return configCollection;
      };
    }
  ]);
}).call(this);
