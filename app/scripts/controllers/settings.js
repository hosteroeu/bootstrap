'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('SettingsCtrl', function($scope, $state, accountsService) {
    var account = JSON.parse(localStorage.getItem('account'));
    var _this = this;

    _this.state = $state;

    accountsService.get({
      id: account.id
    }).$promise.then(function(_account) {
      localStorage.setItem('account', JSON.stringify(_account));

      _this.account = _account;
    });

    this.update_settings = function() {
      accountsService.update({
        id: account.id
      }, {
        default_processor: this.account.default_processor
      }).$promise.then(function() {
        window.toastr.success('Settings were updated');

        $state.reload();
      });
    };

    this.update_auto_deploy = function() {
      accountsService.update({
        id: account.id
      }, {
        auto_deploy: this.account.auto_deploy,
        auto_deploy_coin: this.account.auto_deploy_coin
      }).$promise.then(function() {
        window.toastr.success('Settings were updated');

        $state.reload();
      });
    };

    this.update_dual_mining = function() {
      accountsService.update({
        id: account.id
      }, {
        auto_deploy_idle: this.account.auto_deploy_idle,
        auto_deploy_coin_idle: this.account.auto_deploy_coin_idle
      }).$promise.then(function() {
        window.toastr.success('Settings were updated');

        $state.reload();
      });
    };
  });
