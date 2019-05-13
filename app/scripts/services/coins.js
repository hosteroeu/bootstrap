'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.coins
 * @description
 * # coins
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .factory('coinsService', function($resource, api) {
    return $resource(api.url + api.version +
      '/coins/:id/:controller/:verb/:action', {
        id: '@id',
        controller: '@controller',
        verb: '@verb',
        action: '@action'
      }, {
        'update': {
          method: 'PUT'
        }
      });
  });
