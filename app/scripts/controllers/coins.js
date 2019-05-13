'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:CoinsCtrl
 * @description
 * # CoinsCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('CoinsCtrl', function($scope, coinsService) {
    $scope.coins = coinsService.query({
      on_hostero: 1
    });
  });
