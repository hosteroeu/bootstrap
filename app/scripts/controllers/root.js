'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('RootCtrl', function($scope, $rootScope, $state, hostsService, minersService, coinsService, accountsService, logsService) {
    var token = localStorage.getItem('token');

    $scope.isAuthenticated = false;
    $rootScope.minimalLayout = false;
    $scope.global_state = $state;

    // TODO: Don't make API calls from the root controller, it's not cool, use
    // another controller

    if (token) {
      $scope.isAuthenticated = true;
      $scope.profile = JSON.parse(localStorage.getItem('profile')) || {};
      $rootScope.global_account = JSON.parse(localStorage.getItem('account')) || {};

      if ($rootScope.minimalLayout === false) {
        hostsService.query().$promise.then(function(res) {
          $scope.global_hosts = [];

          res.forEach(function(host) {
            $scope.global_hosts.push(host);
          });
        });

        $scope.global_coins = coinsService.query({
          on_hostero: 1,
          on_bootstrap: 1
        });

        $scope.global_events = logsService.query();

        minersService.query({
          mode: 'node'
        }).$promise.then(function(res) {
          $scope.global_nodes = [];

          res.forEach(function(miner) {
            if (!miner.temporary) {
              $scope.global_nodes.push(miner);
              $scope.total_power += parseInt(miner.power) || 0;
            }
          });
        });
      }
    }
  });
