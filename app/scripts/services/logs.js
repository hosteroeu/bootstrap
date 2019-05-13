'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.logs
 * @description
 * # logs
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .factory('logsService', function($resource, api) {
    return $resource(api.url + api.version +
      '/logs/:id/:controller/:verb/:action', {
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
