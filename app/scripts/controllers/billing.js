'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:BillingCtrl
 * @description
 * # BillingCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('BillingCtrl', function($scope, $state, accountsService, paymentsService, coinsService) {
    var account = JSON.parse(localStorage.getItem('account'));

    $scope.state = $state;
    $scope.selected = {};
    $scope.selected.plan = 'hobby';
    $scope.selected.plan_id = 1;
    $scope.webdollar_amount = 0;

    paymentsService.query().$promise.then(function(payments) {
      $scope.payments = payments;
      $scope.last_payment_gateway = payments.length > 0 ? payments[0].gateway : null;
    });

    var webdollar_eur_price = 0;

    coinsService.query({
      on_hostero: 1
    }).$promise.then(function(coins) {
      for (var i = 0; i < coins.length; i++) {
        var coin = coins[i];

        if (coin.internal_name === 'webdollar') {
          webdollar_eur_price = coin.price_eur;

          $scope.set_webdollar_amount();
          break;
        }
      }
    });

    function get_price_for_plan(plan) {
      var info = {};

      switch (plan) {
        case 'hobby':
          info.id = 1;
          info.price = 1.99;
          break;
        case 'miner':
          info.id = 2;
          info.price = 9.99;
          break;
        case 'farm':
          info.id = 3;
          info.price = 49.99;
          break;
        default:
          info.price = 0;
          break;
      }

      return info;
    }

    $scope.set_webdollar_amount = function() {
      var info = get_price_for_plan($scope.selected.plan);

      $scope.selected.plan_id = info.id;
      $scope.webdollar_amount = parseInt(info.price / webdollar_eur_price * 1.15);
    };

    accountsService.get({
      id: account.id
    }).$promise.then(function(_account) {
      $scope.account = _account;

      localStorage.setItem('account', JSON.stringify(_account));

      switch (_account.plan_miners) {
        case 1:
          $scope.plan = 'free';
          break;
        case 5:
          $scope.plan = 'hobby';
          break;
        case 20:
          $scope.plan = 'miner';
          break;
        case 100:
          $scope.plan = 'farm';
          break;
        case -1:
          $scope.plan = 'unlimited';
          break;
        default:
          $scope.plan = 'custom';
      }
    });
  });
