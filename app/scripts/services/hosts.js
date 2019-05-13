'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.hosts
 * @description
 * # hosts
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .factory('hostsService', function($resource, api) {
    return $resource(api.url + api.version +
      '/hosts/:id/:controller/:verb/:action', {
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
