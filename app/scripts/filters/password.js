'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.filter:password
 * @description
 * # Password
 * Filter of the menoetiusApp
 */
angular.module('menoetiusApp')
  .filter('password', function() {
    return function(input) {
      return Array(input.length + 1).join('*');
    };
  });
