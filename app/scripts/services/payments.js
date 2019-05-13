'use strict';

/**
 * @ngdoc factory
 * @name menoetiusApp.payments
 * @description
 * # payments
 * Service in the menoetiusApp.
 */
angular.module('menoetiusApp')
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
