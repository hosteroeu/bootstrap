'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.miners
 * @description
 * # miners
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .factory('minersService', function($resource, api) {
    return $resource(api.url + api.version +
      '/miners/:id/:controller/:verb/:action', {
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
