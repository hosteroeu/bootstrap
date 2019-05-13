'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.accounts
 * @description
 * # accounts
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .factory('accountsService', function($resource, api) {
    return $resource(api.url + api.version +
      '/accounts/:id/:controller/:verb/:action', {
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
