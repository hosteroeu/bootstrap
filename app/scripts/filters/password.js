'use strict';

/**
 * @ngdoc function
 * @name atlasApp.filter:password
 * @description
 * # Password
 * Filter of the atlasApp
 */
angular.module('atlasApp')
  .filter('password', function() {
    return function(input) {
      return Array(input.length + 1).join('*');
    };
  });
