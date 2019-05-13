'use strict';

/**
 * @ngdoc factory
 * @name atlasApp.payments
 * @description
 * # payments
 * Service in the atlasApp.
 */
angular.module('atlasApp')
  .factory('paymentsService', function($resource, api) {
    return $resource(api.url + api.version +
      '/payments/:id/:controller/:verb/:action', {
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
