'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('LoginCtrl', function ($scope, authService) {
    authService.login();
  });
