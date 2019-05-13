'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.accounts
 * @description
 * # accounts
 * Service in the atlasApp.
 */
angular.module('atlasApp')
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
