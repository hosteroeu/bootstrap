'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.hosts
 * @description
 * # hosts
 * Service in the atlasApp.
 */
angular.module('atlasApp')
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
