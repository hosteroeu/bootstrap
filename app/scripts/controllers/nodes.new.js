'use strict';

/**
 * @ngdoc function
 * @name menoetiusApp.controller:NodesNewCtrl
 * @description
 * # NodesNewCtrl
 * Controller of the menoetiusApp
 */
angular.module('menoetiusApp')
  .controller('NodesNewCtrl', function($state, minersService, hostsService, accountsService) {
    var account = JSON.parse(localStorage.getItem('account'));
    var _this = this;
    var getHostById = function(hosts, id) {
      var host = null;

      for (var i = 0, l = hosts.length; i < l; i++) {
        if (parseInt(hosts[i].id) === parseInt(id)) {
          host = hosts[i];

          break;
        }
      }

      return host;
    };

    _this.selected_host = null;
    _this.selected_host_id = null;
    _this.threads = 1;
    _this.name = null;

    hostsService.query().$promise.then(function(hosts) {
      _this.hosts = hosts;

      if ($state.params.host) {
        _this.selected_host = getHostById(_this.hosts, $state.params.host);
        _this.selected_host_id = $state.params.host;
        _this.update_threads();
      }
    });

    _this.update_threads = function() {
      _this.selected_host = getHostById(_this.hosts, _this.selected_host_id);

      _this.threads = _this.selected_host ? parseInt(_this.selected_host.cpu_count) : 0;
      _this.name = 'node-' + _this.selected_host_id;
    };

    accountsService.get({
      id: account.id
    }).$promise.then(function(account) {
      var webdollar_password = [];

      _this.wallets = account;

      if (account.password_webdollar) {
        webdollar_password = account.password_webdollar.split('|');
      }

      if (webdollar_password.length === 2) {
        _this.wallets.public_key_webdollar = webdollar_password[0];
        _this.wallets.private_key_webdollar = webdollar_password[1];
      }

      if (account.miner_webdollar) {
        _this.wallets.miner_webdollar = account.miner_webdollar;
      } else {
        _this.wallets.miner_webdollar = 'legacy';
      }
    });

    _this.deploy = function() {
      if (!_this.selected_host) {
        window.toastr.warning('Please select a Device');
        return;
      }
      var new_miner = {
        name: _this.name,
        coin: _this.wallets.auto_deploy_coin,
        status: 'stopped',
        mode: 'node',
        deployed: '2',
        threads: _this.threads,
        processor: null,
        host_id: _this.selected_host.id
      };

      switch (_this.wallets.auto_deploy_coin) {
        case 'webdollar':
          if (!_this.wallets.wallet_webdollar) {
            window.toastr.warning('Please enter WebDollar information');
            return;
          }

          new_miner.mining_pool_url = null;
          new_miner.wallet = _this.wallets.wallet_webdollar;
          new_miner.password = _this.wallets.public_key_webdollar + '|' + _this.wallets.private_key_webdollar;
          new_miner.type = null;
          break;
      }

      minersService.save({}, new_miner).$promise.then(function() {
        hostsService.update({
          id: _this.selected_host.id
        }, {
          deployed: '2'
        });

        window.toastr.success('Miner was deployed');

        $state.go('nodes');
      });
    };
  });
