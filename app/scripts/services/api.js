'use strict';

/**
 * @ngdoc provider
 * @name menoetiusApp.api
 * @description
 * # api
 * Provider in the menoetiusApp.
 */
angular.module('menoetiusApp')
  .provider('api', function() {
    //this.url = '//localhost:8080/';
    this.url = 'https://api.hostero.eu/';
    this.version = 'v1';

    this.$get = function() {
      return {
        url: this.url,
        version: this.version
      };
    };
  });
