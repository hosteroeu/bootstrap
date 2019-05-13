'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.miners
 * @description
 * # miners
 * Service in the atlasApp.
 */
angular.module('atlasApp')
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
