'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.logs
 * @description
 * # logs
 * Service in the atlasApp.
 */
angular.module('atlasApp')
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
