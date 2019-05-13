'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.coins
 * @description
 * # coins
 * Service in the atlasApp.
 */
angular.module('atlasApp')
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
