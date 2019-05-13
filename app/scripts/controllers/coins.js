'use strict';

/**
 * @ngdoc function
 * @name atlasApp.controller:CoinsCtrl
 * @description
 * # CoinsCtrl
 * Controller of the atlasApp
 */
angular.module('atlasApp')
  .controller('CoinsCtrl', function($scope, coinsService) {
    $scope.coins = coinsService.query({
      on_hostero: 1
    });
  });
