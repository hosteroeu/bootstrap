'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('LoginCtrl', function ($scope, authService) {
    authService.login();
  });
